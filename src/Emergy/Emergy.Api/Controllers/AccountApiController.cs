using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Emergy.Api.Core.Repositories;
using Emergy.Api.Data.Models;
using Emergy.Api.Models.Input;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Infrastructure;
using Microsoft.Owin.Security;
using model = Emergy.Api.Models;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountApiController : ApiController
    {
        public AccountApiController()
        {

        }


        /// <summary>
        /// Akcija koja vraća profil već logiranog korisnika.
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        [Route("Profile")]
        public async Task<IHttpActionResult> Profile()
        {
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            if (user != null)
            {
                return Ok(Mapper.Map<model::User>(user));
            }
            return NotFound();
        }


        /// <summary>
        /// Akcija koja registrira korisnika ako je validan model
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("Register")]
        [HttpPost]
        public async Task<IHttpActionResult> Register([FromBody] model::RegisterUserBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = Mapper.Map<ApplicationUser>(model);
            user.DateRegistered = DateTime.Now;

            IdentityResult result = await UserManager.CreateAsync(user, model.Password);
            return !result.Succeeded ? GetErrorResult(result) : Ok();
        }


        /// <summary>
        /// Akcija koja prijavljuje korisnika u sustav. Radi na način :
        /// 1. provjerava postoji li user sa poslanim login modelom
        /// 2. ako postoji vraća model sa autorizacijskim Bearer tokenom
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("Login")]
        [HttpPost]
        public async Task<IHttpActionResult> Login([FromBody] model::LoginUserBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ApplicationUser user = await UserManager.FindAsync(model.UserName, model.Password);
            if (user != null)
            {
                var identity = new ClaimsIdentity(Startup.OAuthOptions.AuthenticationType);
                identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
                identity.AddClaim(new Claim(ClaimTypes.DateOfBirth, user.BirthDate.ToShortDateString()));
                var ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
                var currentUtc = DateTime.UtcNow;
                ticket.Properties.IssuedUtc = currentUtc;
                ticket.Properties.ExpiresUtc = currentUtc.Add(TimeSpan.FromDays(7)); // postavljamo validnost tokena na 7 dana
                return Ok(new BearerTokenModel(Startup.OAuthOptions.AccessTokenFormat.Protect(ticket), user.Id, user.UserName));

            }
            return BadRequest("User with specified credentials doesn't exist!");
        }


        /// <summary>
        /// Akcija koja mijenja lozinku korisnika
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>    
        [Authorize]
        [Route("ChangePassword")]
        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword([FromBody] model::ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
                model.NewPassword);

            return !result.Succeeded ? GetErrorResult(result) : Ok();
        }


        /// <summary>
        /// Akcija koja provjerava postoji li korisničko ime u bazi podataka, korisno za frontend validaciju
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("UsernameExists/{username}")]
        [HttpGet]
        [HttpPost]
        public async Task<IHttpActionResult> UsernameExists([FromUri] string username)
        {
            ApplicationUser user = await UserManager.FindByNameAsync(username);
            return user == null ? (IHttpActionResult)Ok() : BadRequest("Username is already taken!");
        }


        /// <summary>
        /// User Manager i SignInManager su komponente librarya Asp.Net MVC Identity Framework i defaultno su injectani u svaki request, stoga
        /// ih možemo dohvatiti preko owin contexta. :)
        /// 1. -> UserManager možemo shvatiti kao repository za ApplicationUsere
        /// </summary>

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

        private IAuthenticationManager Authentication => HttpContext.Current.GetOwinContext().Authentication;


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UserManager.Dispose();
            }

            base.Dispose(disposing);
        }

        /// <summary>
        /// Helper metoda koja kreira IHttpActionResult 
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }


    }
}
