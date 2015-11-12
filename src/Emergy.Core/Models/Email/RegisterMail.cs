using System.Net.Mail;

namespace Emergy.Core.Models.Email
{
    public class RegisterMail : MailMessage
    {
        public RegisterMail(MailAddress from, MailAddress to) : base(from, to)
        {
        }

        public static class RegisterMailFactory
        {
            public static RegisterMail CreateMail(string username, string userkey, string userEmail)
            {
                var from = new MailAddress("emergy.email@gmail.com", "Emergy");
                var to = new MailAddress(userEmail, username);
                return new RegisterMail(from, to)
                {
                    Subject = "Emergy - Registration successfull!",
                    Body = $"Key = {userkey} \n, UserName = {username}" // temporary just for testing
                };
            }
        }
    }
}
