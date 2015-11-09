using System;
using System.Net;
using System.Threading.Tasks;
using System.Net.Mail;
using Emergy.Core.Common;
using Emergy.Core.Models.Email;

namespace Emergy.Core.Services
{

    public class EmailService : IEmailService
    {
        public EmailService()
        {
            _smtpClient = new SmtpClient(SmtpServer, Port)
            {
                Credentials = new NetworkCredential(ApiKey, SecretKey),
                EnableSsl = true
            };

        }

        public async Task SendRegisterMailAsync(string username, string userKey, string userEmail)
        {
            var emailToSend = RegisterMail.RegisterMailFactory.CreateMail(username, userKey, userEmail);
            await _smtpClient.SendMailAsync(emailToSend).WithoutSync();
        }

        public async Task SendLogMailAsync(Exception exception)
        {
            var emailToSend = LogMail.LogMailFactory.CreateMail(exception);
            await _smtpClient.SendMailAsync(emailToSend).WithoutSync();
        }

        private readonly SmtpClient _smtpClient;

        private const string SmtpServer = "in-v3.mailjet.com";
        private const int Port = 587;
        private const string ApiKey = "603b4b4243a9b552e034003d486fa2da";
        private const string SecretKey = "61a09cb935737e1a2e34b0c1f8e47d0b";
    }
}
