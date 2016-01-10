using System.Net.Mail;
using Emergy.Core.Razor;
using Emergy.Data.Models;


namespace Emergy.Core.Models.Email
{
    public class NotificationMail : MailMessage
    {
        public NotificationMail(MailAddress from, MailAddress to) : base(from, to)
        {
        }

        public static class NotificationMailFactory
        {
            public static NotificationMail CreateMail(ApplicationUser target, Data.Models.Notification notification, string templatePath)
            {
                var from = new MailAddress("emergy.email@gmail.com", "Emergy");
                var to = new MailAddress(target.Email, target.UserName);
                return new NotificationMail(from, to)
                {
                    Subject = "Emergy - Notification!",
                    IsBodyHtml = true,
                    Body = RazorCompiler.Compile<Data.Models.Notification>(templatePath, "Notification", notification)
                };
            }
        }
    }
}

