using Cs_Hub.Data;
using Cs_Hub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cs_Hub.Controllers
{
    public class CategoryController : Controller
    {
        readonly ApplicationDbContext _DbContext;
        public CategoryController(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }


        public async Task<IActionResult> AddCategory(Category category)
        {
            _DbContext.Categories.Add(category);

            await _DbContext.SaveChangesAsync();

            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> EditCategory(int Id,[FromBody] dynamic newdata)
        {
            try
            {
                
                var category = await _DbContext.Categories.FirstOrDefaultAsync(x => x.CategoryID == Id);

                
                if (category == null)
                {
                    return NotFound();
                }

              
                category.Name = newdata.Name;

                
                await _DbContext.SaveChangesAsync();

                
                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
              
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        public async Task<IActionResult> AllCategories()
        {
            var  category =await _DbContext.Categories.ToListAsync();


            return RedirectToAction("Index", "Home");
        }



        public async Task<IActionResult> DeleteCategory(int Id)
        {
            try
            {
                
                var category = await _DbContext.Categories.FirstOrDefaultAsync(x => x.CategoryID == Id);

               
                if (category == null)
                {
                    return NotFound();
                }

                
                _DbContext.Categories.Remove(category);

                
                await _DbContext.SaveChangesAsync();

               
                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
             
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }

   

}
