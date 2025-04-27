using Cs_Hub.Models;
using FluentValidation;

namespace Cs_Hub.Validator
{
    internal sealed class ResourceValidation : AbstractValidator<Resource>
    {
        public ResourceValidation()
        {
            RuleFor(x => x.UserID).NotEmpty().WithMessage("User id is required");
            RuleFor(x => x.Title).NotEmpty()
              .WithMessage("User id is required")
              .MaximumLength(225).WithMessage("Max length is 225 ,Try again!");

            RuleFor(x => x.ResourceType).NotEmpty()
              .WithMessage("User id is required")
              .MaximumLength(20).WithMessage("Max length is 225 ,Try again!");

            // RuleFor(x => x.URL).NotEmpty()
            //   .WithMessage("Url is required")
            //   .MaximumLength(2083).WithMessage("Max length is 2083 ,Try again!");

            // RuleFor(x => x.FilePath).NotEmpty()
            //   .WithMessage("File path is required")
            //   .MaximumLength(500).WithMessage("Max length is 500 ,Try again!");

            // RuleFor(x => x.Status).NotEmpty()
            //  .WithMessage("Status is required")
            //  .MaximumLength(20).WithMessage("Max length is 20 ,Try again!");

            RuleFor(x => x.CategoryID).NotEmpty()
             .WithMessage("Category id is required");


        }
    }
}

