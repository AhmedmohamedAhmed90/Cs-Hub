using Cs_Hub.Data;
using Cs_Hub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Cs_Hub.Controllers
{
    public class ResourseController : Controller
    {
        private readonly ApplicationDbContext _DbContext;

        public ResourseController(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        // GET: Resourse
        public async Task<IActionResult> Index()
        {
            var resources = await _DbContext.Resourses.Include(r => r.Category).ToListAsync();
            return View(resources);
        }

        // GET: Resourse/Details/5
        public async Task<IActionResult> Details(int id)
        {
            var resource = await _DbContext.Resourses
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
        public async Task<IActionResult> Create([Bind("Id,Name,Description,Link,Image,Video,Status,CategoryId")] Resourse resource)
        {
            if (ModelState.IsValid)
            {
                _DbContext.Resourses.Add(resource);
                await _DbContext.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new SelectList(_DbContext.Categories, "Id", "Name", resource.CategoryId);
            return View(resource);
        }

        // GET: Resourse/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var resource = await _DbContext.Resourses.FindAsync(id);

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
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description,Link,Image,Video,Status,CategoryId")] Resourse resource)
        {
            if (id != resource.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _DbContext.Resourses.Update(resource);
                    await _DbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ResourceExists(resource.Id))
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
            var resource = await _DbContext.Resourses
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
            var resource = await _DbContext.Resourses.FindAsync(id);
            if (resource == null)
            {
                return NotFound();
            }

            _DbContext.Resourses.Remove(resource);
            await _DbContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ResourceExists(int id)
        {
            return _DbContext.Resourses.Any(e => e.Id == id);
        }
    }
}
