using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using AutoMapper;
using Emergy.Api.Models.Account;
using Emergy.Core.Common;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;

using model = Emergy.Core.Models.Account;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountApiController : MasterApiController
    {
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
        [HttpPut]
        [Route("Profile/Edit")]
        public async Task<IHttpActionResult> Profile(model::UserProfile profileVm)
        {
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            if (user != null)
            {
                user.ProfilePhotoId = profileVm.ProfilePhotoId;
                user.Name = profileVm.Name;
                user.Surname = profileVm.Surname;
                user.BirthDate = profileVm.BirthDate;
                user.AccountType = profileVm.AccountType;
                await UserManager.UpdateAsync(user).WithoutSync();
                return Ok();
            }
            return NotFound();
        }

        [HttpGet]
        [Authorize(Roles = "Administrators")]
        [Route("With-Key/{key}")]
        public async Task<IHttpActionResult> WithKey(string key)
        {
            var user = await AccountService.GetUserByKeyAsync(key);
            if (user != null)
            {
                return Ok(Mapper.Map<model.UserProfile>(user));
            }
            return NotFound();
        }

        [HttpGet]
        [Authorize]
        [Route("With-Username/{username}")]
        public async Task<IHttpActionResult> WithUsername(string username)
        {
            var user = await AccountService.GetUserByNameAsync(username);
            if (user != null)
            {
                return Ok(Mapper.Map<model.UserProfile>(user));
            }
            return NotFound();
        }

        [AllowAnonymous]
        [Route("Register")]
        [HttpPost]
        public async Task<HttpResponseMessage> Register([FromBody] model::RegisterUserBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            var reCaptchaResponse = await ReCaptchaValidator.Validate(model.ReCaptchaResponse);
            if (!reCaptchaResponse.IsValid)
            {
                return Request.CreateResponse(HttpStatusCode.NotAcceptable, ReCaptchaValidator.GetErrors(reCaptchaResponse));
            }
            ApplicationUser user = Mapper.Map<ApplicationUser>(model);
            IdentityResult result = await AccountService.CreateAccountAsync(user, model.Password);
            return !result.Succeeded ?
                Request.CreateResponse(HttpStatusCode.BadRequest, result.Errors)
                : Request.CreateResponse(HttpStatusCode.OK, user.Id);
        }

        [AllowAnonymous]
        [Route("Login")]
        [HttpPost]
        [ResponseType(typeof(BearerTokenModel))]
        public async Task<IHttpActionResult> Login([FromBody] model::LoginUserBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }

            var ticket = await AccountService.LoginAsync(model, Startup.OAuthOptions).WithoutSync();
            if (ticket != null)
            {
                var roles = ticket.Identity.Claims
                    .Where(claim => claim.Type == ClaimTypes.Role)
                    .Select(claim => claim.Value)
                    .ToArray();

                return Ok(new BearerTokenModel
                    (
                    Startup.OAuthOptions.AccessTokenFormat.Protect(ticket),
                    ticket.Identity.GetUserId(),
                    ticket.Identity.GetUserName(),
                    roles
                    ));
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
        [Route("IsUsernameTaken")]
        [HttpPost]
        public async Task<bool> IsUsernameTaken([FromBody]string username)
        {
            return await AccountService.UserNameTaken(username);
        }

        [AllowAnonymous]
        [Route("IsEmailTaken")]
        [HttpPost]
        public async Task<bool> IsEmailTaken([FromBody]string email)
        {
            return await AccountService.EmailTaken(email);
        }

        [AllowAnonymous]
        [Route("IsValidKey")]
        [HttpGet]
        public async Task<bool> IsValidKey(string id, string key)
        {
            var userWithId = await UserManager.FindByIdAsync(id).WithoutSync();
            var userWithKey = await AccountService.GetUserByKeyAsync(key).WithoutSync();
            return (userWithId != null && userWithKey != null) && userWithId.Id == userWithKey.Id;
        }
        public AccountApiController()
        {
            AccountService.EmailTemplates.Add("RegistrationSuccessfull",
                HttpContext.Current.Server.MapPath("~/Content/Templates/RegistrationSuccessful.cshtml"));
        }
    }
}
