using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Emergy.Api.Models.Account;
using Emergy.Core.Common;
using Emergy.Core.Services;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

using model = Emergy.Core.Models.Account;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountApiController : ApiController
    {
        public AccountApiController()
        {
            AccountService.SetUserManager(UserManager);
        }
        public AccountApiController(ApplicationUserManager userManager, IAccountService accountService)
        {
            UserManager = userManager;
            AccountService = accountService;
            AccountService.SetUserManager(userManager);
        }

        [HttpGet]
        [Route("Profile")]
        public async Task<IHttpActionResult> Profile()
        {
            var user = await AccountService.GetUserByIdAsync(User.Identity.GetUserId());
            if (user != null)
            {
                return Ok(Mapper.Map<model.UserProfile>(user));
            }
            return NotFound();
        }

        [AllowAnonymous]
        [Route("Register")]
        [HttpPost]
        public async Task<IHttpActionResult> Register([FromBody] model::RegisterUserBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            ApplicationUser user = Mapper.Map<ApplicationUser>(model);
            IdentityResult result = await AccountService.CreateAccountAsync(user, model.Password);
            return !result.Succeeded ? Error(result) : Ok();
        }

        [AllowAnonymous]
        [Route("Login")]
        [HttpPost]
        public async Task<IHttpActionResult> Login([FromBody] model::LoginUserBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }

            var ticket = await AccountService.LoginAsync(model, Startup.OAuthOptions);
            if (ticket != null)
            {
                return Ok(new BearerTokenModel(Startup.OAuthOptions.AccessTokenFormat.Protect(ticket), ticket.Identity.GetUserId(), ticket.Identity.GetUserName()));
            }
            return BadRequest("User with specified credentials doesn't exist!");
        }

        [Authorize]
        [Route("ChangePassword")]
        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword([FromBody] model.ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IdentityResult result = await AccountService.ChangePasswordAsync(User.Identity.GetUserId(), model);
            return !result.Succeeded ? Error(result) : Ok();
        }

        [AllowAnonymous]
        [Route("UsernameExists/{username}")]
        [HttpGet]
        [HttpPost]
        public async Task<IHttpActionResult> UsernameExists([FromUri] string username)
        {
            return (await AccountService.UserNameTaken(username)) ? (IHttpActionResult)BadRequest() : Ok();
        }


        private ApplicationUserManager UserManager
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
        private IAccountService AccountService
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


        private IHttpActionResult Error()
        {
            return BadRequest(ModelState);
        }
        private IHttpActionResult Error(IdentityResult result)
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
            AccountService.Dispose();
        }
    }
}
