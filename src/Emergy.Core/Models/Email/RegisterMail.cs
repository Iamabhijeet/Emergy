using System.Net.Mail;
using Emergy.Core.Razor;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;

namespace Emergy.Core.Models.Email
{
    public class RegisterMailParameters
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string AccountType { get; set; }
        public string UserKey { get; set; }
    }
    public class RegisterMail : MailMessage
    {
        public RegisterMail(MailAddress from, MailAddress to) : base(from, to)
        {
        }

        public static class RegisterMailFactory
        {
            public static RegisterMail CreateMail(ApplicationUser user, string userkey, string templatePath)
            {
                var from = new MailAddress("emergy.email@gmail.com", "Emergy");
                var to = new MailAddress(user.Email, user.UserName);
                return new RegisterMail(from, to)
                {
                    Subject = "Emergy - Registration successfull!",
                    IsBodyHtml = true,
                    Body = RazorCompiler.Compile<RegisterMailParameters>(templatePath, "RegistrationSuccessfull", new RegisterMailParameters
                    {
                        UserName = user.UserName,
                        Email = user.Email,
                        AccountType = user.AccountType.ToString(),
                        UserKey = userkey
                    })
                };
            }
        }
    }
}
