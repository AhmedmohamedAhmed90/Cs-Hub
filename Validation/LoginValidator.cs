using Cs_Hub.Dtos;
using FluentValidation;

namespace Cs_Hub.Validator
{
    internal sealed class LoginValidator : AbstractValidator<Login>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required Please")
                .EmailAddress().WithMessage("Invalid email address please");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Email is required please");

        }
    }
}


