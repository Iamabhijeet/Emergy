using System;
using System.Collections.Generic;
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
        Task<ApplicationUser> GetUserByIdAsync(string userId);
        Task<ApplicationUser> GetUserByKeyAsync(string userId);
        Task<ApplicationUser> GetUserByNameAsync(string userName);
        Task<IdentityResult> CreateAccountAsync(ApplicationUser newUser, string password);
        Task<AuthenticationTicket> LoginAsync(LoginUserBindingModel model, OAuthAuthorizationServerOptions authOptions);
        Task<IdentityResult> ChangePasswordAsync(string userId, ChangePasswordBindingModel model);
        Task<bool> UserNameTaken(string username);
        Task<bool> EmailTaken(string email);
        Task UpdateLocation(ApplicationUser user, Location location);
        Dictionary<string,string> EmailTemplates{ get; set; } 
    }
}
