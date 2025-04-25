using Cs_Hub.Dtos;
using FluentValidation;

namespace Cs_Hub.Validator
{
    internal sealed class ResourceUploadValidator : AbstractValidator<ResourceUpload>
    {
        public ResourceUploadValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required please");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required please");
            RuleFor(x => x.ResourceType).NotEmpty().WithMessage("Resource type is required please");
            RuleFor(x => x.CategoryID).NotEmpty().WithMessage("Category id is required please");

        }
    }
}


