using Cs_Hub.Data;
using Cs_Hub.Models;

namespace Cs_Hub.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(User User);
    }
}
