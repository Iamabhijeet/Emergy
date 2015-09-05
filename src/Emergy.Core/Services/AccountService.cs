﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Emergy.Core.Common;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Emergy.Core.Models.Account;
using Microsoft.AspNet.Identity.EntityFramework;
using MySql.Data.MySqlClient;

namespace Emergy.Core.Services
{
    public class AccountService : IAccountService
    {
        public AccountService()
        {

        }

        public AccountService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<ApplicationUser> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId).WithoutSync();
        }
        public async Task<ApplicationUser> GetUserByNameAsync(string userName)
        {
            return await _userManager.FindByNameAsync(userName).WithoutSync();
        }
        public async Task<IdentityResult> CreateAccountAsync(ApplicationUser newUser, string password)
        {
            var result = await _userManager.CreateAsync(newUser, password).WithoutSync();

            if (result.Succeeded)
            {
                var createdUser = await _userManager.FindByNameAsync(newUser.Name).WithoutSync();
                switch (newUser.AccountType)
                {
                    case Data.Models.Enums.AccountType.Client:
                        {
                            await _userManager.AddToRoleAsync(createdUser.Id, "Clients").WithoutSync();
                            break;
                        }
                    case Data.Models.Enums.AccountType.Administrator:
                        {
                            await _userManager.AddToRoleAsync(createdUser.Id, "Administrators").WithoutSync();
                            break;
                        }
                }
            }
            return result;
        }
        public async Task<AuthenticationTicket> LoginAsync(LoginUserBindingModel model, OAuthAuthorizationServerOptions authOptions)
        {
            ApplicationUser user = await _userManager.FindAsync(model.UserName, model.Password).WithoutSync();
            if (user != null)
            {
                ClaimsIdentity identity = new ClaimsIdentity(authOptions.AuthenticationType);
                identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
                identity.AddClaim(new Claim(ClaimTypes.DateOfBirth, user.BirthDate.ToShortDateString()));
                (await _userManager.GetRolesAsync(user.Id)).ForEach(role => identity.AddClaim(new Claim(ClaimTypes.Role, role)));
                AuthenticationTicket ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
                DateTime currentUtc = DateTime.UtcNow;
                ticket.Properties.IssuedUtc = currentUtc;
                ticket.Properties.ExpiresUtc = currentUtc.Add(TimeSpan.FromDays(7));
                return ticket;
            }
            return null;
        }
        public async Task<IdentityResult> ChangePasswordAsync(string userId, ChangePasswordBindingModel model)
        {
            return await _userManager.ChangePasswordAsync(userId, model.OldPassword, model.NewPassword).WithoutSync();
        }
        public async Task<bool> UserNameTaken(string username)
        {
            ApplicationUser user = await _userManager.FindByNameAsync(username).WithoutSync();
            return (user != null);
        }

        public async Task UpdateLocation(ApplicationUser user, Location location)
        {
            user.Locations.Add(location);
            await _userManager.UpdateAsync(user).WithoutSync();
        }

        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        public void Dispose()
        {
            _roleManager.Dispose();
            _userManager.Dispose();
        }
    }
}
