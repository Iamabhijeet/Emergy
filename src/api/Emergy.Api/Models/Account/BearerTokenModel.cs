namespace Emergy.Api.Models.Account
{

    public class BearerTokenModel
    {
        public BearerTokenModel(string token, string userId, string userName, string role)
        {
            Token = token;
            UserId = userId;
            UserName = userName;
            Role = role;
        }
        public string Token { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
    }
}
