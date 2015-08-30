using System;
using System.Threading.Tasks;
using Emergy.Core.Models.Account;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;

namespace Emergy.Core.Services
{
    public interface IAccountService : IDisposable
    {
        void SetUserManager(UserManager<ApplicationUser> userManager);
        Task<ApplicationUser> GetUserAsync(string userId);
        Task<IdentityResult> CreateAccountAsync(ApplicationUser newUser, string password);
        Task<AuthenticationTicket> LoginAsync(LoginUserBindingModel model, OAuthAuthorizationServerOptions authOptions);
        Task<IdentityResult> ChangePasswordAsync(string userId, ChangePasswordBindingModel model);
        Task<bool> UserNameTaken(string username);
    }
}
