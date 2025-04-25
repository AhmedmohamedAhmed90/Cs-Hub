using Cs_Hub.Dtos;
using FluentValidation;

namespace Cs_Hub.Validator
{
    internal sealed class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentDtoValidator()
        {
            RuleFor(x => x.UserID)
                .NotEmpty()
                .WithMessage("UserId is required Please");

            RuleFor(x => x.ResourceID)
                .NotEmpty()
                .WithMessage("Resource Id is required Please");

            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage("Content must be at least 1 character long Please");



        }
    }
}
