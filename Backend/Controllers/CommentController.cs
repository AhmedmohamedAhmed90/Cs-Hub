using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cs_Hub.Data;
using Cs_Hub.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using Cs_Hub.Dtos;
using FluentValidation;
using ScHub.Interfaces;
using Cs_Hub.Interfaces;
using Cs_Hub.Repository;


namespace Cs_Hub.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ApplicationDbContext _DbContext;
        private readonly IValidator<Comment> _validator;
        private readonly ICommentRepository _commentRepository;
        private readonly IValidator<CreateCommentDto> _CreateCommentDtoValidator;

        public CommentController(IValidator<CreateCommentDto> CreateCommentDtoValidator, ApplicationDbContext dbContext, IValidator<Comment> validator, ICommentRepository commentRepository)
        {
            _DbContext = dbContext;
            _validator = validator;
            _commentRepository = commentRepository;
            _CreateCommentDtoValidator = CreateCommentDtoValidator;
        }



        [HttpGet("get_resource_comments/{resourceId}")]
        public async Task<IActionResult> GetCommentsByResource(int resourceId)
        {
            var comments = await _DbContext.Comments
                .Where(c => c.ResourceID == resourceId)
                .Include(c => c.User)
                .Select(c => new
                {
                    c.CommentID,
                    c.ResourceID,
                    User = new
                    {
                        c.User.Id,
                        c.User.FullName,
                        c.User.Email
                    },
                    c.Content,
                }
                ).ToListAsync();

            if (!comments.Any())
            {
                return NotFound(new { message = "No comments found for this resource" });
            }

            return Ok(new { message = "Comments retrieved successfully", comments });
        }



        [HttpPost("create_comment")]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Content))
            {
                return BadRequest(new { message = "Invalid comment data" });
            }


            var validationResult1 = _CreateCommentDtoValidator.Validate(dto);
            if (!validationResult1.IsValid)
            {
                var problemDetails = new HttpValidationProblemDetails(validationResult1.ToDictionary())
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Validation failed",
                    Detail = "One or more validation errors occured",
                    Instance = "/api/account/register"
                };
                return BadRequest(Results.Problem(problemDetails));
            }


            var comment = new Comment
            {
                UserID = dto.UserID,
                ResourceID = dto.ResourceID,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow
            };

            var validationResult = await _validator.ValidateAsync(comment);

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

            await _commentRepository.Add(comment);
            return CreatedAtAction(nameof(GetCommentsByResource), new { resourceId = comment.ResourceID },
                new { message = "Comment created successfully", comment });
        }


        [HttpPut("update_comment/{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] string content)
        {
            var comment = await _DbContext.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound(new { message = "Comment not found" });
            }

            if (string.IsNullOrWhiteSpace(content))
            {
                return BadRequest(new { message = "Content cannot be empty" });
            }

            comment.Content = content;


            var validationResult = await _validator.ValidateAsync(comment);

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

            await _commentRepository.Update(comment);

            return Ok(new { message = "Comment updated successfully", comment });
        }


        [HttpDelete("delete_comment/{Id}")]
        public async Task<IActionResult> DeleteComment(int Id)
        {
            var comment = await _DbContext.Comments.FindAsync(Id);
            if (comment == null)
            {
                return NotFound(new { message = "Comment not found" });
            }

            await _commentRepository.Delete(comment);
            await _DbContext.SaveChangesAsync();

            return Ok(new { message = "Comment deleted successfully" });
        }
    }
}