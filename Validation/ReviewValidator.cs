using Cs_Hub.Models;
using FluentValidation;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Validator
{
    internal sealed class ReviewValidator : AbstractValidator<Review>
    {
        public ReviewValidator()
        {

            RuleFor(x => x.UserID).NotEmpty().WithMessage("User id is required please");

            RuleFor(x => x.ResourceID).NotEmpty().WithMessage("Resource id id is required please");


            RuleFor(x => x.Rating).NotEmpty().WithMessage("Rating is required please")
                .InclusiveBetween(1, 5)
                   .WithMessage("Rating must be between 1 and 5");
        }
    }
}

