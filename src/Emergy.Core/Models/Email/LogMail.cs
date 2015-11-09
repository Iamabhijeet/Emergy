using System;
using System.Net.Mail;
using System.Runtime.Serialization;
using System.Text;

namespace Emergy.Core.Models.Email
{
    public class LogMail : MailMessage
    {
        public LogMail(MailAddress from, MailAddress to) : base(from, to)
        {
        }
        public static class LogMailFactory
        {
            public static LogMail CreateMail(Exception exception)
            {
                var from = new MailAddress("emergy.email@gmail.com", "Emergy");
                var to = new MailAddress("gboduljak@outlook.com", "Gabrijel Boduljak");
                return new LogMail(from, to)
                {
                    Subject = "Emergy - Application Error occured!",
                    Body = BuildBody(exception)
                };
            }
            private static string BuildBody(Exception exception)
            {
                StringBuilder bodyBuilder = new StringBuilder();
                bodyBuilder.AppendLine("Disi maci, desilo se sranje! \n");
                bodyBuilder.AppendLine($"Sranje se desilo: {DateTime.Now.ToShortDateString()}!\n");
                bodyBuilder.AppendLine($"Exception koji se desija je : {nameof(exception)}!\n");
                bodyBuilder.AppendLine("Evo ti mali opis : \n");
                bodyBuilder.AppendLine($"\t Porukica: {exception.Message} \n");
                bodyBuilder.AppendLine($"\t Data: {exception.Data} \n");
                bodyBuilder.AppendLine($"\t Stack trace: {exception.StackTrace} \n");
                var innerException = exception.InnerException;
                innerException = innerException.InnerException;
                bodyBuilder.AppendLine($"\t Inner exception: {innerException.StackTrace} \n");
                bodyBuilder.AppendLine("To bi bilo to, pofixaj laganini, #samotvrdo! :) \n");
                return bodyBuilder.ToString();
            }
        }
    }
}
