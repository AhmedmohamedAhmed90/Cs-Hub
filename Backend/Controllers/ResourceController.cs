using Cs_Hub.Data;
using Cs_Hub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Cs_Hub.Dtos;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using FluentValidation;
using Cs_Hub.Interfaces;
using ScHub.Interfaces;


namespace Cs_Hub.Controllers
{
    [Route("api/resources")]
    [ApiController]
    public class ResourceController : Controller
    {
        private readonly ApplicationDbContext _DbContext;
        private readonly IWebHostEnvironment _env;
        private readonly IValidator<ResourceUpload> _validator;
        private readonly IValidator<Resource> _ResourceValidator;
        private readonly IResourceRepository _resourceRepository;



        public ResourceController(IResourceRepository resourceRepository, IValidator<Resource> ResourceValidator, ApplicationDbContext dbContext, IWebHostEnvironment env, IValidator<ResourceUpload> validator)
        {
            _DbContext = dbContext;
            _env = env;
            _validator = validator;
            _ResourceValidator = ResourceValidator;
            _resourceRepository = resourceRepository;
        }

        //119944697
        /*    public async Task<IActionResult> Index()
            {
                var resources = await _DbContext.Resources
                    .Include(r => r.ResourceCategories)
                    .ThenInclude(rc => rc.Category)
                    .ToListAsync();
                return View(resources);
            }

            public async Task<IActionResult> Details(int id)
            {
                var resource = await _DbContext.Resources
                    .Include(r => r.ResourceCategories)
                    .ThenInclude(rc => rc.Category)
                    .FirstOrDefaultAsync(r => r.ResourceID == id);

                if (resource == null)
                {
                    return NotFound();
                }

                return View(resource);
            }
        */
        /*   [HttpPost("uploads")]
       public async Task<IActionResult> UploadResource()
       {
                   Console.WriteLine("testtttttttttttttttttt");
                   return Ok();
                   }*/



        [HttpPost("upload")]
        public async Task<IActionResult> UploadResource(
            [FromForm] ResourceUpload model)

        {
            try
            {
                Console.WriteLine("🔹 UploadResource action triggered!");

                // الخطوة الجديدة: التحقق من الصحة باستخدام FluentValidation
                var validationResult = await _validator.ValidateAsync(model);

                if (!validationResult.IsValid)
                {
                    var problemDetails = new HttpValidationProblemDetails(validationResult.ToDictionary())
                    {
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Validation failed",
                        Detail = "One or more validation errors occured",
                        Instance = "/api/account/register"
                    };
                    return BadRequest(Results.Problem(problemDetails));
                }

                // باقي الكود كما هو...
                string? filePath = null;
                if (model.File != null && model.File.Length > 0)
                {
                    var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(model.File.FileName)}";
                    filePath = Path.Combine(_env.WebRootPath, "uploads", fileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.File.CopyToAsync(stream);
                    }

                    filePath = $"/uploads/{fileName}";
                }

                var resource = new Resource
                {
                    Title = model.Title,
                    Description = model.Description,
                    ResourceType = model.ResourceType,
                    UserID = model.UserId,
                    CategoryID = model.CategoryID,
                    URL = model.URL,
                    FilePath = filePath,
                    CreatedAt = DateTime.UtcNow,
                    // Status = model.Status
                };



                var ValidatorResult = await _ResourceValidator.ValidateAsync(resource);

                if (!ValidatorResult.IsValid)
                {
                    var problemDetails = new HttpValidationProblemDetails(ValidatorResult.ToDictionary())
                    {
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Validation failed",
                        Detail = "One or more validation errors occured",
                        Instance = "/api/account/register"
                    };
                    return BadRequest(Results.Problem(problemDetails));
                }


                await _resourceRepository.Add(resource);

                return Ok(new
                {
                    message = "Resource uploaded successfully!",
                    resourceID = resource.ResourceID,
                    title = resource.Title,
                    filePath = resource.FilePath,
                    url = resource.URL
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($" ERROR: {ex.Message}");
                return StatusCode(500, new { error = "Internal Server Error", details = ex.Message });
            }
        }

        [HttpGet("get_all_resources")]
        public async Task<IActionResult> GetAllResources()
        {
            var resources = await _DbContext.Resources
                .Include(r => r.Reviews)
                .Include(r => r.Comments)
                .Include(r => r.Category)
                .Include(r => r.User)
                .Select(r => new
                {
                    r.ResourceID,
                    r.Title,
                    r.Description,
                    r.ResourceType,
                    r.URL,
                    r.FilePath,
                    r.Status,
                    r.CreatedAt,
                    User = new
                    {
                        r.User.Id,
                        r.User.FullName,
                        r.User.Email
                    },
                    Category = new
                    {
                        r.Category.CategoryID,
                        r.Category.Name
                    },
                    Reviews = r.Reviews.Select(review => new
                    {
                        review.ReviewID,
                        review.Rating,
                        review.CreatedAt
                    }),
                    Comments = r.Comments.Select(comment => new
                    {
                        comment.CommentID,
                        comment.Content,
                        comment.CreatedAt
                    })
                })
                .ToListAsync();

            return Ok(new { message = "Resources found", resources });
        }



        [HttpGet("view_resources")]
        public async Task<IActionResult> ViewAllResources()
        {
            var resources = await _DbContext.Resources
                .Where(r => r.Status == "Approved")
                .Include(r => r.Reviews)
                .Include(r => r.Comments)
                .Include(r => r.Category)
                .Include(r => r.User)
                .Select(r => new
                {
                    r.ResourceID,
                    r.Title,
                    r.Description,
                    r.ResourceType,
                    r.URL,
                    r.FilePath,
                    r.Status,
                    r.CreatedAt,
                    User = new
                    {
                        r.User.Id,
                        r.User.FullName,
                        r.User.Email
                    },
                    Category = new
                    {
                        r.Category.CategoryID,
                        r.Category.Name
                    },
                    Reviews = r.Reviews.Select(review => new
                    {
                        review.ReviewID,
                        review.Rating,
                        review.CreatedAt
                    }),
                    Comments = r.Comments.Select(comment => new
                    {
                        comment.CommentID,
                        comment.Content,
                        comment.CreatedAt
                    })
                })
                .ToListAsync();

            if (!resources.Any())
            {
                return NotFound(new { message = "No approved resources" });
            }

            return Ok(new { message = "Resources found", resources });
        }


        [HttpPut("approve_resource/{id}")]

        public async Task<IActionResult> ApproveResource([FromRoute] int id)
        {
            var resource = await _DbContext.Resources.FindAsync(id);
            if (resource == null)
            {
                return NotFound("resource is not found");

            }

            resource.Status = "Approved";

            var ValidatorResult = await _ResourceValidator.ValidateAsync(resource);

            if (!ValidatorResult.IsValid)
            {
                var problemDetails = new HttpValidationProblemDetails(ValidatorResult.ToDictionary())
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Validation failed",
                    Detail = "One or more validation errors occured",
                    Instance = "/api/account/register"
                };
                return BadRequest(Results.Problem(problemDetails));
            }

            await _DbContext.SaveChangesAsync();

            return Ok(new { message = "resource Approved Successfully" });

        }


        [HttpDelete("delete_resource/{id}")]

        public async Task<IActionResult> DeleteResource([FromRoute] int id)
        {
            var resource = await _DbContext.Resources.FindAsync(id);
            if (resource == null)
            {
                return NotFound("resource is not found");

            }
            await _resourceRepository.Delete(resource);

            return Ok(new { message = "resource Deleted Successfully" });

        }


        [HttpGet("get_resource/{id}")]
        public async Task<IActionResult> GetResource([FromRoute] int id)
        {
            var resource = await _DbContext.Resources
                .Include(r => r.Reviews)
                .Include(r => r.Comments)
                .Include(r => r.Category)
                .Include(r => r.User)
                .Where(r => r.ResourceID == id)
                .Select(r => new
                {
                    r.ResourceID,
                    r.Title,
                    r.Description,
                    r.ResourceType,
                    r.URL,
                    r.FilePath,
                    r.Status,
                    r.CreatedAt,
                    User = new
                    {
                        r.User.Id,
                        r.User.FullName,
                        r.User.Email
                    },
                    Category = new
                    {
                        r.Category.CategoryID,
                        r.Category.Name
                    },
                    Reviews = r.Reviews.Select(review => new
                    {
                        review.ReviewID,
                        review.Rating,
                        review.CreatedAt
                    }),
                    Comments = r.Comments.Select(comment => new
                    {
                        comment.CommentID,
                        comment.Content,
                        comment.CreatedAt
                    })
                })
                .FirstOrDefaultAsync();

            if (resource == null)
            {
                return NotFound(new { message = "Resource not found" });
            }

            return Ok(new { message = "Resource found", resource });
        }


        [HttpPut("update_resource/{id}")]
        public async Task<IActionResult> UpdateResource(
            int id,
            [FromForm] ResourceUpload updatedResource)
        // حقن الـ Validator
        {
            try
            {
                Console.WriteLine("🔹 UpdateResource action triggered!");

                // التحقق من صحة المدخلات باستخدام FluentValidation
                var validationResult = await _validator.ValidateAsync(updatedResource);

                if (!validationResult.IsValid)
                {
                    var problemDetails = new HttpValidationProblemDetails(validationResult.ToDictionary())
                    {
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Validation failed",
                        Detail = "One or more validation errors occured",
                        Instance = "/api/account/register"
                    };
                    return BadRequest(Results.Problem(problemDetails));
                }

                var resource = await _DbContext.Resources.FindAsync(id);
                if (resource == null)
                {
                    return NotFound(new { message = "Resource not found" });
                }

                // تحديث البيانات الأساسية
                resource.Title = updatedResource.Title;
                resource.Description = updatedResource.Description;
                resource.ResourceType = updatedResource.ResourceType;
                resource.URL = updatedResource.URL;
                resource.CategoryID = updatedResource.CategoryID;

                // معالجة تحميل الملف إذا تم توفيره
                if (updatedResource.File != null && updatedResource.File.Length > 0)
                {
                    // حذف الملف القديم إذا كان موجودًا
                    if (!string.IsNullOrEmpty(resource.FilePath))
                    {
                        var oldFilePath = Path.Combine("wwwroot", resource.FilePath.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    // تحميل الملف الجديد
                    var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(updatedResource.File.FileName)}";
                    var filePath = Path.Combine(_env.WebRootPath, "uploads", fileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await updatedResource.File.CopyToAsync(stream);
                    }

                    resource.FilePath = $"/uploads/{fileName}";
                }

                var validation = await _ResourceValidator.ValidateAsync(resource);

                if (!validation.IsValid)
                {
                    var problemDetails = new HttpValidationProblemDetails(validation.ToDictionary())
                    {
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Validation failed",
                        Detail = "One or more validation errors occured",
                        Instance = "/api/account/register"
                    };
                    return BadRequest(Results.Problem(problemDetails));
                }

                await _resourceRepository.Update(resource);

                return Ok(new
                {
                    message = "Resource updated successfully",
                    resource = new
                    {
                        resourceID = resource.ResourceID,
                        title = resource.Title,
                        description = resource.Description,
                        filePath = resource.FilePath,
                        url = resource.URL
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($" ERROR: {ex.Message}");
                return StatusCode(500, new { error = "Internal Server Error", details = ex.Message });
            }
        }


        [HttpGet("user/{userId}/resources")]
public async Task<IActionResult> GetResourcesByUserId([FromRoute] string userId)
{
    var resources = await _DbContext.Resources
        .Where(r => r.UserID == userId)
        .Include(r => r.Reviews)
        .Include(r => r.Comments)
        .Include(r => r.Category)
        .Include(r => r.User)
        .Select(r => new
        {
            r.ResourceID,
            r.Title,
            r.Description,
            r.ResourceType,
            r.URL,
            r.FilePath,
            r.Status,
            r.CreatedAt,
            User = new
            {
                r.User.Id,
                r.User.FullName,
                r.User.Email
            },
            Category = new
            {
                r.Category.CategoryID,
                r.Category.Name
            },
            Reviews = r.Reviews.Select(review => new
            {
                review.ReviewID,
                review.Rating,
                review.CreatedAt
            }),
            Comments = r.Comments.Select(comment => new
            {
                comment.CommentID,
                comment.Content,
                comment.CreatedAt
            })
        })
        .ToListAsync();

    if (!resources.Any())
    {
        return NotFound(new { message = "No resources found for this user." });
    }

    return Ok(new { message = "Resources found", resources });
}

        /*     public async Task<IActionResult> Edit(int id)
             {
                 var resource = await _DbContext.Resources.FindAsync(id);
                 if (resource == null)
                 {
                     return NotFound();
                 }
                 ViewData["Categories"] = new SelectList(_DbContext.Categories, "CategoryID", "Name");
                 return View(resource);
             }

             [HttpPost]
             [ValidateAntiForgeryToken]
             public async Task<IActionResult> Edit(int id, [Bind("ResourceID,Name,Description,Link,Image,Video,Status")] Resource resource, int[] CategoryIDs)
             {
                 if (id != resource.ResourceID)
                 {
                     return NotFound();
                 }

                 if (ModelState.IsValid)
                 {
                     try
                     {
                         _DbContext.Resources.Update(resource);
                         await _DbContext.SaveChangesAsync();

                         var existingCategories = _DbContext.ResourceCategories.Where(rc => rc.ResourceID == id);
                         _DbContext.ResourceCategories.RemoveRange(existingCategories);

                         foreach (var categoryId in CategoryIDs)
                         {
                             _DbContext.ResourceCategories.Add(new ResourceCategory { ResourceID = resource.ResourceID, CategoryID = categoryId });
                         }
                         await _DbContext.SaveChangesAsync();
                     }
                     catch (DbUpdateConcurrencyException)
                     {
                         if (!ResourceExists(resource.ResourceID))
                         {
                             return NotFound();
                         }
                         else
                         {
                             throw;
                         }
                     }
                     return RedirectToAction(nameof(Index));
                 }
                 ViewData["Categories"] = new SelectList(_DbContext.Categories, "CategoryID", "Name");
                 return View(resource);
             }

             public async Task<IActionResult> Delete(int id)
             {
                 var resource = await _DbContext.Resources
                     .Include(r => r.ResourceCategories)
                     .ThenInclude(rc => rc.Category)
                     .FirstOrDefaultAsync(r => r.ResourceID == id);
                 if (resource == null)
                 {
                     return NotFound();
                 }
                 return View(resource);
             }

             [HttpPost, ActionName("Delete")]
             [ValidateAntiForgeryToken]
             public async Task<IActionResult> DeleteConfirmed(int id)
             {
                 var resource = await _DbContext.Resources.FindAsync(id);
                 if (resource == null)
                 {
                     return NotFound();
                 }

                 var associatedCategories = _DbContext.ResourceCategories.Where(rc => rc.ResourceID == id);
                 _DbContext.ResourceCategories.RemoveRange(associatedCategories);
                 _DbContext.Resources.Remove(resource);
                 await _DbContext.SaveChangesAsync();
                 return RedirectToAction(nameof(Index));
             }

             private bool ResourceExists(int id)
             {
                 return _DbContext.Resources.Any(e => e.ResourceID == id);
             }
        */




    }
}