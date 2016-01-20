using Emergy.Data.Models;
using System.Collections.Generic;
using System.Linq;

namespace Emergy.Core.Common
{
    public static class ClientsListExtensions
    {
        public static bool ContainsUser(this IEnumerable<ApplicationUser> clients, ApplicationUser user)
        {
            return clients.Any(client => client.Id == user.Id);
        }
        public static bool ContainsUser(this IEnumerable<ApplicationUser> clients, string userId)
        {
            return clients.Any(client => client.Id == userId);
        }
    }
}
