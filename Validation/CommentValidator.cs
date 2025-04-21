using Cs_Hub.Models;
using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Validator
{
    internal sealed class CommentValidator : AbstractValidator<Comment>
    {
        public CommentValidator()
        {
            RuleFor(x => x.UserID).NotEmpty().WithMessage("User id is required please");
            RuleFor(x => x.ResourceID).NotEmpty().WithMessage("Resource id is required please");


        }
    }
}