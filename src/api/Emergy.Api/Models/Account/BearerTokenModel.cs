using System.Collections.Generic;

namespace Emergy.Api.Models.Account
{

    public class BearerTokenModel
    {
        public BearerTokenModel(string token, string userId, string userName, IEnumerable<string> roles)
        {
            Token = token;
            UserId = userId;
            UserName = userName;
            Roles = roles;
        }
        public string Token { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public IEnumerable<string> Roles { get; set; }
    }
}
