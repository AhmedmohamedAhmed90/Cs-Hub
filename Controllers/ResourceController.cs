
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
        Console.WriteLine($"❌ ERROR: {ex.Message}");
        return StatusCode(500, new { error = "Internal Server Error", details = ex.Message });
    }
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
