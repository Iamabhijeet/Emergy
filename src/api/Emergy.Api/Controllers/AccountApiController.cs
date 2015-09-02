using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Emergy.Api.Models.Account;
using Emergy.Core.Common;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

using model = Emergy.Core.Models.Account;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountApiController : ApiControllerBase
    {
        public AccountApiController()
        {
            
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
        public async Task<IHttpActionResult> UsernameExists([FromUri] string username)
        {
            return (await AccountService.UserNameTaken(username)) ? (IHttpActionResult)BadRequest() : Ok();
        }

       
    }
}
