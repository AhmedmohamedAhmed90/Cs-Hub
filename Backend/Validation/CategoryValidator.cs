using Cs_Hub.Models;
using FluentValidation;

namespace Cs_Hub.Validator
{
    internal sealed class CategoryValidator : AbstractValidator<Category>
    {
        public CategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required please");

            RuleFor(x => x.Description)
               .NotEmpty().WithMessage("Name is required please");
        }
    }
}

