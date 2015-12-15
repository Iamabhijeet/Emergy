using System.Web;
using System.Web.Http;
using Emergy.Api.Filters;
using Emergy.Core.Common;
using Emergy.Core.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace Emergy.Api.Controllers
{
    [LogExceptions]
    public abstract class MasterApiController : ApiController
    {
        protected string ApplicationUrl
        {
            get
            {
                var appPath = string.Empty;
                var context = HttpContext.Current;
                if (context != null)
                {
                    appPath = $"{context.Request.Url.Scheme}://{context.Request.Url.Host}{(context.Request.Url.Port == 80 ? string.Empty : ":" + context.Request.Url.Port)}{context.Request.ApplicationPath}";
                }
                if (!appPath.EndsWith("/"))
                    appPath += "/";
                return appPath;
            }
        }
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
     
        protected IReCaptchaValidator ReCaptchaValidator
        {
            get
            {
                return _reCaptchaValidator ?? HttpContext.Current.GetOwinContext().Get<IReCaptchaValidator>();
            }
            set
            {
                _reCaptchaValidator = value;
            }
        }
        private IReCaptchaValidator _reCaptchaValidator;

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
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            UserManager.Dispose();
            RoleManager.Dispose();
            AccountService.Dispose();
            ReCaptchaValidator.Dispose();
        }
    }
}
