using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emergy.Api.Models.Input
{

    public class BearerTokenModel
    {
        public BearerTokenModel()
        {

        }
        public BearerTokenModel(string token, string userId, string userName)
        {
            Token = token;
            UserId = userId;
            UserName = userName;
        }
        public string Token { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
    }
}
