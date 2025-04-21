using Cs_Hub.Dtos;
using FluentValidation;

namespace Cs_Hub.Validator
{
    internal sealed class RegisterValidator : AbstractValidator<Register>
    {
        public RegisterValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required please")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters long");

            RuleFor(x => x.FullName).NotEmpty().WithMessage("Full Name is required please");

            RuleFor(x => x.Address).NotEmpty().WithMessage("Address is required please");

            RuleFor(x => x.Age)
                .NotEmpty().WithMessage("Age is required please")
                .Must(x => x > 0 && x < 100).WithMessage("Age must be between 0 and 100");

        }

    }
}

