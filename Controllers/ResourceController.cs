/*using Cs_Hub.Data;
using Cs_Hub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Cs_Hub.Controllers
{
    public class ResourceController : Controller
    {
        private readonly ApplicationDbContext _DbContext;

        public ResourceController(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        // GET: Resourse
        public async Task<IActionResult> Index()
        {
            var resources = await _DbContext.Resources.Include(r => r.Category).ToListAsync();
            return View(resources);
        }

        // GET: Resourse/Details/5
        public async Task<IActionResult> Details(int id)
        {
            var resource = await _DbContext.Resources
                .Include(r => r.Category)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (resource == null)
            {
                return NotFound();
            }

            return View(resource);
        }

        // GET: Resourse/Create
        public IActionResult CreateResourse()
        {
            ViewData["CategoryId"] = new SelectList(_DbContext.Categories, "Id", "Name");
            return View();
        }

        // POST: Resourse/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Description,Link,Image,Video,Status,CategoryId")] Resource resource)
        {
            if (ModelState.IsValid)
            {
                _DbContext.Resources.Add(resource);
                await _DbContext.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new SelectList(_DbContext.Categories, "Id", "Name", resource.CategoryId);
            return View(resource);
        }

        // GET: Resourse/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var resource = await _DbContext.Resources.FindAsync(id);

            if (resource == null)
            {
                return NotFound();
            }

            ViewData["CategoryId"] = new SelectList(_DbContext.Categories, "Id", "Name", resource.CategoryId);
            return View(resource);
        }

        // POST: Resourse/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description,Link,Image,Video,Status,CategoryId")] Resource resource)
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

            ViewData["CategoryId"] = new SelectList(_DbContext.Categories, "Id", "Name", resource.CategoryId);
            return View(resource);
        }

        // GET: Resourse/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            var resource = await _DbContext.Resources
                .Include(r => r.Category)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (resource == null)
            {
                return NotFound();
            }

            return View(resource);
        }

        // POST: Resourse/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var resource = await _DbContext.Resources.FindAsync(id);
            if (resource == null)
            {
                return NotFound();
            }

            _DbContext.Resources.Remove(resource);
            await _DbContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ResourceExists(int id)
        {
            return _DbContext.Resources.Any(e => e.ResourceID == id);
        }
    }
}*/

using Cs_Hub.Data;
using Cs_Hub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Cs_Hub.Controllers
{
    public class ResourceController : Controller
    {
        private readonly ApplicationDbContext _DbContext;

        public ResourceController(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public async Task<IActionResult> Index()
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

        public IActionResult Create()
        {
            ViewData["Categories"] = new SelectList(_DbContext.Categories, "CategoryID", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ResourceID,Name,Description,Link,Image,Video,Status")] Resource resource, int[] CategoryIDs)
        {
            if (ModelState.IsValid)
            {
                _DbContext.Resources.Add(resource);
                await _DbContext.SaveChangesAsync();

                foreach (var categoryId in CategoryIDs)
                {
                    _DbContext.ResourceCategories.Add(new ResourceCategory { ResourceID = resource.ResourceID, CategoryID = categoryId });
                }
                await _DbContext.SaveChangesAsync();

                return RedirectToAction(nameof(Index));
            }
            ViewData["Categories"] = new SelectList(_DbContext.Categories, "CategoryID", "Name");
            return View(resource);
        }

        public async Task<IActionResult> Edit(int id)
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
    }
}
