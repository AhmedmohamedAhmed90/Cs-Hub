using Cs_Hub.Data;
using Cs_Hub.Models;
using Cs_Hub.Dtos;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Cs_Hub.Controllers

{

    [ApiController]
    [Route("api/category")]
    public class CategoryController : Controller
    {
        readonly ApplicationDbContext _DbContext;
        public CategoryController(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }


        [HttpPost("add-category")]
        public async Task<IActionResult> AddCategory(Category category)
        {
            _DbContext.Categories.Add(category);

            await _DbContext.SaveChangesAsync();

            return Ok(new {message="The New Category Is Created"});
        }


        [HttpPost("edit-category/{id}")]
        public async Task<IActionResult> EditCategory(int Id,[FromBody] CategoryUpdateDto newdata)
        {
            try
            {
                
                var category = await _DbContext.Categories.FindAsync(Id);

                
                if (category == null)
                {
                            return NotFound(new {message="There Category is Not Found"});
                }
               

                 category.Name = newdata?.name ?? category.Name;
                 category.Description = newdata?.description ?? category.Description;


                
                await _DbContext.SaveChangesAsync();

                
            return Ok(new {message="The  Category Is Updated"});
            }
            catch (Exception ex)
            {
              
                            return BadRequest(new {message="There is an error in Update Category",error = ex.Message});

            }
        }

  /*      public async Task<IActionResult> AllCategories()
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
  */
    }
  

   

}
