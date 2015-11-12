using System;
using System.Net.Mail;
using System.Text;
using Emergy.Core.Models.Log;

namespace Emergy.Core.Models.Email
{
    public class LogMail : MailMessage
    {
        public LogMail(MailAddress from, MailAddress to) : base(from, to)
        {
        }
        public static class LogMailFactory
        {
            public static LogMail CreateMail(ExceptionLog log)
            {
                var from = new MailAddress("emergy.email@gmail.com", "Emergy");
                var to = new MailAddress("gboduljak@outlook.com", "Gabrijel Boduljak");
                return new LogMail(from, to)
                {
                    Subject = "Emergy - Application Error occured!",
                    Body = BuildBody(log)
                };
            }
            private static string BuildBody(ExceptionLog log)
            {
                StringBuilder bodyBuilder = new StringBuilder();
                bodyBuilder.AppendLine("Disi maci, desilo se sranje! \n");
                bodyBuilder.AppendLine($"Sranje se desilo: {DateTime.Now.ToShortDateString()}!\n");
                bodyBuilder.AppendLine($"Exception koji se desija je : {log.Exception.ToString()}!\n");
                bodyBuilder.AppendLine("Evo ti mali opis : \n");
                bodyBuilder.AppendLine($"\t Porukica: {log.Exception.Message} \n");
                bodyBuilder.AppendLine($"\t Data: {log.Exception.Data} \n");
                bodyBuilder.AppendLine($"\t Stack trace: {log.Exception.StackTrace} \n");
                bodyBuilder.AppendLine($"\t Inner exception: {log.GetCausingException(log.Exception).StackTrace} \n");
                bodyBuilder.AppendLine("To bi bilo to, pofixaj laganini, #samotvrdo! :) \n");
                return bodyBuilder.ToString();
            }
        }
    }
}
