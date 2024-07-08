using Cs_Hub.Data;
using Microsoft.AspNetCore.Mvc;

namespace Cs_Hub.Controllers
{
    public class ResourseController : Controller
    {
        readonly ApplicationDbContext _DbContext;
        public ResourseController(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }

    }
}
