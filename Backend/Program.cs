using Cs_Hub.Data;
using Cs_Hub.Dtos;
using Cs_Hub.Interfaces;
using Cs_Hub.Models;
using Cs_Hub.Repository;
using Cs_Hub.Services;
using Cs_Hub.Validator;
using FluentValidation;
using Humanizer;
using Humanizer.Localisation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ScHub.Interfaces;
using System;
using System.Text;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly, includeInternalTypes: true);

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<IResourceRepository, ResourceRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});


builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = true;
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
}).AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"]))
    };

    // ✅ Enable SignalR to extract token from query string
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            Console.WriteLine($"🔍 JWT Event - Path: {path}, Token: {(string.IsNullOrEmpty(accessToken) ? "Not found" : "Found")}");

            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chatHub"))
            {
                context.Token = accessToken;
                Console.WriteLine($"✅ Token set for SignalR connection: {path}");
            }

            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"❌ JWT Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
});

builder.Services.AddSingleton<IWebHostEnvironment>(builder.Environment);

// ✅ Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Cs_Hub API",
        Description = "API Documentation for Cs_Hub"
    });

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Scheme = "bearer",
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Description = "أدخل التوكن بهذا الشكل: Bearer {token}",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    options.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200", "https://localhost:4200")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials()
                   .SetIsOriginAllowed(origin => true); // More permissive for development
        });
});


builder.Services.AddSignalR();

var app = builder.Build();




// ================== Middleware ==================
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}



//public class LoggingMiddleware
//{
//    private readonly RequestDelegate _next;
//    public LoggingMiddleware(RequestDelegate next)
//    {
//        _next = next;
//    }

//    public async Task Invoke(HttpContext context)
//    {
//        Console.WriteLine("Middleware running");
//        await _next(context); // call next middleware
//    }
//}
//app.UseMiddleware<LoggingMiddleware>();


//🔹 Example: Only apply to / admin routes
//csharp
//Copy
//Edit
//app.UseWhen(context => context.Request.Path.StartsWithSegments("/admin"), adminApp =>
//{
//    adminApp.Use(async (context, next) =>
//    {
//        Console.WriteLine("🔒 Admin area middleware");
//await next();
//    });
//});


//run mara wa7da bs
//bool hasRun = false;

//app.Use(async (context, next) =>
//{
//    if (!hasRun)
//    {
//        hasRun = true;
//        Console.WriteLine("🔥 Middleware ran only ONCE (first request)");
//    }
//    await next();
//});


//| Feature | **Middleware * *                     | **Filter * *                                        |
//| ---------------------- | ---------------------------------- | ------------------------------------------------- |
//| **Scope * *              | Application - wide(whole pipeline) | MVC - level(controller / action level) |
//| **Runs On * *            | All requests, before routing       | After routing, inside MVC pipeline                |
//| **Access**             | `HttpContext` only                 | Full access to controller, model binding, results |
//| **Use Case**           | Logging, CORS, Auth, Headers, etc. | Model validation, logging per action, auth checks |
//| **DI Support**         | Yes                                | Yes                                               |
//| **Granularity**        | Coarse-grained (global)            | Fine-grained (per-controller/action)              |
//| **Order of Execution** | Runs before Filters                | Runs after Middleware                             |

//public class LogActionFilter : IActionFilter
//{
//    public void OnActionExecuting(ActionExecutingContext context)
//    {
//        Console.WriteLine("🎯 [Filter] - Before action");
//    }

//    public void OnActionExecuted(ActionExecutedContext context)
//    {
//        Console.WriteLine("🎯 [Filter] - After action");
//    }
//}
//builder.Services.AddScoped<LogActionFilter>();  de fe el program.cs



// ✅ Swagger Middleware
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cs_Hub API V1");
    c.RoutePrefix = "swagger"; // تفتح swagger من /swagger
});


app.Use(async (context, next) =>
{
    Console.WriteLine("➡️ Before next middleware");
    Console.WriteLine(context.Request.Path.ToString());
    await next(); // Call next middleware
    Console.WriteLine("⬅️ After next middleware");
});



app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// ✅ Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Use CORS before other middleware
app.UseCors("AllowAngularApp");



app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    
    // ✅ Map SignalR Hub
    endpoints.MapHub<Cs_Hub.Hubs.ChatHub>("/chatHub");
});




// ✅ Optional: Traditional MVC route (مش مفعّل دلوقتي)
/*
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
*/

app.Run();