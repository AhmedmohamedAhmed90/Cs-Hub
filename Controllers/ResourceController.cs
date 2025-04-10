﻿
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


namespace Cs_Hub.Controllers
{
    [Route("api/resources")]
    [ApiController]
    public class ResourceController : Controller
    {
        private readonly ApplicationDbContext _DbContext;
        private readonly IWebHostEnvironment _env; 


        public ResourceController(ApplicationDbContext dbContext,IWebHostEnvironment env)
        {
            _DbContext = dbContext;
             _env = env;
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
public async Task<IActionResult> UploadResource([FromForm] ResourceUpload model)
{
    try
    {
        Console.WriteLine("🔹 UploadResource action triggered!");

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Handle file upload
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

        // Create new resource
        var resource = new Resource
        {
            Title = model.Title,
            Description = model.Description,
            ResourceType = model.ResourceType,
            UserID = "c711a6c3-6639-4601-90b6-bab21a744847",
            CategoryID = model.CategoryID,
            URL = model.URL,
            FilePath = filePath,
            CreatedAt = DateTime.UtcNow,
            Status = "Pending"
        };

        _DbContext.Resources.Add(resource);
        await _DbContext.SaveChangesAsync();

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
             _DbContext.Remove(resource);
            await _DbContext.SaveChangesAsync();

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
        public async Task<IActionResult> UpdateResource(int id, [FromForm] ResourceUpload updatedResource)
        {
            var resource = await _DbContext.Resources.FindAsync(id);
            if (resource == null)
            {
                return NotFound(new { message = "Resource not found" });
            }

            resource.Title = updatedResource.Title;
            resource.Description = updatedResource.Description;
            resource.ResourceType = updatedResource.ResourceType;
            resource.URL = updatedResource.URL;
            resource.CategoryID = updatedResource.CategoryID;

            if (updatedResource.File != null)
            {
                var fileName = $"{Guid.NewGuid()}_{updatedResource.File.FileName}";
                var filePath = Path.Combine("wwwroot/uploads", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await updatedResource.File.CopyToAsync(stream);
                }

                resource.FilePath = $"/uploads/{fileName}";  // Save relative path
            }

            _DbContext.Resources.Update(resource);
            await _DbContext.SaveChangesAsync();

            return Ok(new { message = "Resource updated successfully", resource });
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
