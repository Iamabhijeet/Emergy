using System.Web;
using System.Web.Http;
using Emergy.Core.Common;
using Emergy.Core.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace Emergy.Api.Controllers
{
    public abstract class ApiControllerBase : ApiController
    {
        protected ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            set
            {
                _userManager = value;
            }
        }
        private ApplicationUserManager _userManager;

        protected ApplicationRoleManager RoleManager
        {
            get
            {
                return _roleManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationRoleManager>();
            }
            set
            {
                _roleManager = value;
            }
        }
        private ApplicationRoleManager _roleManager;
        protected IAccountService AccountService
        {
            get
            {
                return _accountService ?? HttpContext.Current.GetOwinContext().Get<IAccountService>();
            }
            set
            {
                _accountService = value;
            }
        }
        private IAccountService _accountService;


        protected IHttpActionResult Error()
        {
            return BadRequest(ModelState);
        }
        protected IHttpActionResult Error(IdentityResult result)
        {
            if (!result.Succeeded && result.Errors != null)
            {
                result.Errors.ForEach(err => ModelState.AddModelError("", err));
                return BadRequest(ModelState);
            }
            return InternalServerError();
        }
    }
}
