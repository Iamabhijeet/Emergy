using Emergy.Core.Services;
using Emergy.Data.Models;

namespace Emergy.Core.Common
{
    public static class ApplicationUserExtensions
    {
        public static bool UserKeyValid(this ApplicationUser user, string key)
        {
            var userKeyService = new UserKeyService();
            return userKeyService.VerifyKeys(user.UserKeyHash, key.Trim());
        }
    }
}
