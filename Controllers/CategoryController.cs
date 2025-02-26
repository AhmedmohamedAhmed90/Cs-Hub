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
               

                 category.Name = newdata?.Name ?? category.Name;
                 category.Description = newdata?.Description ?? category.Description;



                
                await _DbContext.SaveChangesAsync();

                
            return Ok(new {message="The  Category Is Updated"});
            }
            catch (Exception ex)
            {
              
                            return BadRequest(new {message="There is an error in Update Category",error = ex.Message});

            }
        }

        [HttpGet("all-categories")]
     public async Task<IActionResult> AllCategories()
        {
            var  categories =await _DbContext.Categories.ToListAsync();

            if (categories == null)
            {
                return NotFound(new {message="Can not get the categories"});
            }

            return Ok(new {message="the Categories found",categories});
            
        }


        [HttpDelete("delete-category/{id}")]
        public async Task<IActionResult> DeleteCategory(int Id)
        {
            try
            {
                
                var category = await _DbContext.Categories.FindAsync(Id);

               
                if (category == null)
                {
                    return NotFound(new {message=" The Category Not Found"});
                }

                
                _DbContext.Categories.Remove(category);

                
                await _DbContext.SaveChangesAsync();

               
            return Ok(new {message="the Category deleted Successfully"});
            }
            catch (Exception ex)
            {
             
                return BadRequest(new {message="Internal server error: " ,ex.Message});
            }
        }

        [HttpPost("add-resource/{ResourceId}/{CategoryId}")]
        public async Task<IActionResult> AddResourceToCategory(int ResourceId, int CategoryId)
        {
           var resource = await _DbContext.Resources.FindAsync(ResourceId);
           var category = await _DbContext.Categories.FindAsync(CategoryId);

           if (resource == null || category == null)
            {
              return NotFound("Resource or Category not found.");
            }

           var resourceCategory = new ResourceCategory
            {
            ResourceID = ResourceId,
            CategoryID = CategoryId
            };

            _DbContext.ResourceCategories.Add(resourceCategory);
            await _DbContext.SaveChangesAsync();

            return Ok("Resource added to category successfully.");
        }



  
    }
  

   

}
