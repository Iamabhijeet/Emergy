using Emergy.Data.Models;
using System.Collections.Generic;

namespace Emergy.Core.Common
{
    public static class ClientsListExtensions
    {
        public static bool ContainsUser(this IEnumerable<ApplicationUser> clients, ApplicationUser user)
        {
            foreach (var client in clients)
            {
                if (client.Id == user.Id)
                {
                    return true;
                }
            }
            return false;
        }
    }
}
