using Cs_Hub.Data;
using Cs_Hub.Models;
using Cs_Hub.Dtos;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using System.ComponentModel.DataAnnotations;
using ScHub.Interfaces;


namespace Cs_Hub.Controllers

{

    [ApiController]
    [Route("api/category")]
    public class CategoryController : Controller
    {
        readonly ApplicationDbContext _DbContext;
        private readonly IValidator<Category> _validator;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IValidator<CategoryCreateDto> _categoryCreateValidator;
        public CategoryController(IValidator<CategoryCreateDto> categoryCreateValidator, ApplicationDbContext DbContext, IValidator<Category> validator, ICategoryRepository categoryRepository)
        {
            _DbContext = DbContext;
            _validator = validator;
            _categoryRepository = categoryRepository;
            _categoryCreateValidator = categoryCreateValidator;
        }



        [HttpPost("add-category")]
        public async Task<IActionResult> AddCategory([FromBody] CategoryCreateDto category)
        {

            var validationResult = _categoryCreateValidator.Validate(category);
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


            var newCategory = new Category
            {
                Name = category.Name,
                Description = category.Description
            };


            await _categoryRepository.Add(newCategory);

            return Ok(new { message = "The new category is created" });
        }


        [HttpPut("edit-category/{Id}")]
        public async Task<IActionResult> EditCategory(int Id, [FromBody] CategoryUpdateDto newdata)
        {
            try
            {
                Console.WriteLine($"this is the {Id}");

                var category = await _DbContext.Categories.FindAsync(Id);


                if (category == null)
                {
                    return NotFound(new { message = "There Category is Not Found" });
                }


                category.Name = newdata?.Name ?? category.Name;
                category.Description = newdata?.Description ?? category.Description;

                var validationResult = await _validator.ValidateAsync(category);

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



                await _DbContext.SaveChangesAsync();


                return Ok(new { message = "The  Category Is Updated" });
            }
            catch (Exception ex)
            {

                return BadRequest(new { message = "There is an error in Update Category", error = ex.Message });

            }
        }

        [HttpGet("all-categories")]
        public async Task<IActionResult> AllCategories()
        {

            var categories = await _categoryRepository.GetAll();

            if (categories == null)
            {
                return NotFound(new { message = "Can not get the categories" });
            }

            return Ok(new { message = "the Categories found", categories });

        }


        [HttpDelete("delete-category/{Id}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] int Id)
        {
            try
            {

                var category = await _DbContext.Categories.FindAsync(Id);


                if (category == null)
                {
                    return NotFound(new { message = " The Category Not Found" });
                }


                _categoryRepository.Delete(category);


                return Ok(new { message = "the Category deleted Successfully" });
            }
            catch (Exception ex)
            {

                return BadRequest(new { message = "Internal server error: ", ex.Message });
            }
        }

        /*
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
        */



    }




}