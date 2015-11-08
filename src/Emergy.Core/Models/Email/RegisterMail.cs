using System.Net.Mail;

namespace Emergy.Core.Models.Email
{
    public class RegisterMail : MailMessage
    {
        public RegisterMail(MailAddress from, MailAddress to) : base(from, to)
        {

        }
        public string UserName { get; set; }
        public string UserKey { get; set; }
        public string UserEmail { get; set; }

        public static class RegisterMailFactory
        {
            public static RegisterMail CreateMail(string username, string userkey, string userEmail)
            {
                var from = new MailAddress("emergy.email@gmail.com", "Emergy");
                var to = new MailAddress(userEmail, username);
                return new RegisterMail(from, to)
                {
                    Body = $"Key = {userkey} \n, UserName = {username}" // temporary just for testing
                };
            }
        }
    }
}
