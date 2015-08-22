using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

using model = Emergy.Api.Models.Account;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountApiController : ApiController
    {
        public AccountApiController()
        {
            // mora bit vamo
        }
        public AccountApiController(ApplicationUserManager userManager)
        {
            UserManager = userManager;
        }

        [HttpGet]
        [Route("Profile")]
        public async Task<IHttpActionResult> Profile()
        {
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            if (user != null)
            {
                return Ok(Mapper.Map<model.User>(user));
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
            IdentityResult result = await UserManager.CreateAsync(user, model.Password);
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
            ApplicationUser user = await UserManager.FindAsync(model.UserName, model.Password);
            if (user != null)
            {
                ClaimsIdentity identity = new ClaimsIdentity(Startup.OAuthOptions.AuthenticationType);
                identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
                identity.AddClaim(new Claim(ClaimTypes.DateOfBirth, user.BirthDate.ToShortDateString()));
                AuthenticationTicket ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
                DateTime currentUtc = DateTime.UtcNow;
                ticket.Properties.IssuedUtc = currentUtc;
                ticket.Properties.ExpiresUtc = currentUtc.Add(TimeSpan.FromDays(7));
                return Ok(new model::BearerTokenModel(Startup.OAuthOptions.AccessTokenFormat.Protect(ticket), user.Id, user.UserName));
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
            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
            return !result.Succeeded ? Error(result) : Ok();
        }

        [AllowAnonymous]
        [Route("UsernameExists/{username}")]
        [HttpGet]
        [HttpPost]
        public async Task<IHttpActionResult> UsernameExists([FromUri] string username)
        {
            ApplicationUser user = await UserManager.FindByNameAsync(username);
            return user == null ? (IHttpActionResult)Ok() : BadRequest("Username is already taken!");
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
            if (disposing)
            {
                UserManager.Dispose();
            }
            base.Dispose(disposing);
        }

    }
}
