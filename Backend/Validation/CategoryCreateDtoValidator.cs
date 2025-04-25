using Cs_Hub.Dtos;
using FluentValidation;

namespace Cs_Hub.Validator
{
    internal sealed class CategoryCreateDtoValidator : AbstractValidator<CategoryCreateDto>
    {
        public CategoryCreateDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty()
                .WithMessage("Name is required Please");

            RuleFor(x => x.Description).NotEmpty()
                .WithMessage("Description is required Please");

        }
    }
}

