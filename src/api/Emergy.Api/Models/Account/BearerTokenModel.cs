namespace Emergy.Api.Models.Account
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
