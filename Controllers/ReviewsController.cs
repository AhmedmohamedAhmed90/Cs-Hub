using Cs_Hub.Data;
using Cs_Hub.Dtos;
using Cs_Hub.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cs_Hub.Controllers
{
    [Route("api/reviews")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _DbContext;

        public ReviewsController(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

       
        [HttpPost("create_review")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto reviewDto)
        {
            var review = new Review
            {
                UserID = reviewDto.UserID,
                ResourceID = reviewDto.ResourceID,
                Rating = reviewDto.Rating
            };


            _DbContext.Reviews.Add(review);
            await _DbContext.SaveChangesAsync();
            return Ok(new { message = "review created ", review });
        }


        [HttpGet("get_all_reviews")]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _DbContext.Reviews
                .Include(r => r.User)
                .Include(r => r.Resource)
                .Select(r => new
                {
                    r.ReviewID,
                    r.Rating,
                    r.CreatedAt,
                    User = new
                    {
                        r.User.Id,
                        r.User.FullName,
                        r.User.Email
                    },
                    Resource = new
                    {
                        r.Resource.ResourceID,
                        r.Resource.Title
                    }
                })
                .ToListAsync();

            return Ok(reviews);
        }



        [HttpGet("get_review/{id}")]
        public async Task<IActionResult> GetReviewById([FromRoute] int id)
        {
            var review = await _DbContext.Reviews
                .Include(r => r.User)
                .Include(r => r.Resource)
                .Where(r => r.ReviewID == id)
                .Select(r => new
                {
                    r.ReviewID,
                    r.Rating,
                    r.CreatedAt,
                    User = new
                    {
                        r.User.Id,
                        r.User.FullName,
                        r.User.Email
                    },
                    Resource = new
                    {
                        r.Resource.ResourceID,
                        r.Resource.Title
                    }
                })
                .FirstOrDefaultAsync();

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            return Ok(review);
        }



        [HttpPut("update_review/{id}")]
        public async Task<IActionResult> UpdateReview([FromRoute]int id, int newrating)
        {
            if (newrating == null)
            {
                return BadRequest(new { message = "Invalid review data" });
            }

            var existingReview = await _DbContext.Reviews.FindAsync(id);
            if (existingReview == null)
            {
                return NotFound(new { message = "Review not found" });
            }


            existingReview.Rating = newrating;
            existingReview.CreatedAt = DateTime.UtcNow; 

            _DbContext.Reviews.Update(existingReview);
            await _DbContext.SaveChangesAsync();

            return Ok(new { message="review updated successfully", existingReview });
        }

        
        [HttpDelete("delete_review/{id}")]
        public async Task<IActionResult> DeleteReview([FromRoute]int id)
        {
            var review = await _DbContext.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            _DbContext.Reviews.Remove(review);
            await _DbContext.SaveChangesAsync();

            return Ok(new { message = "Review deleted successfully" });
        }
    }
}
