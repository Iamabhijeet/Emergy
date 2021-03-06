﻿using System.Net;
using System.Threading.Tasks;
using System.Net.Mail;
using Emergy.Core.Common;
using Emergy.Core.Models.Email;
using Emergy.Core.Models.Log;
using Emergy.Data.Models;

namespace Emergy.Core.Services
{

    public class EmailService : IEmailService
    {
        public async Task SendNotificationMailAsync(Notification notification, string htmlTemplatePath)
        {
            _InitializeSmtpClient();
            var emailToSend = NotificationMail.NotificationMailFactory.CreateMail(notification.Target, notification, htmlTemplatePath);
            await _smtpClient.SendMailAsync(emailToSend)
                .ContinueWith((task) => { _smtpClient.Dispose(); }).WithoutSync();
        }
        public async Task SendRegisterMailAsync(ApplicationUser user, string userKey, string htmlTemplatePath)
        {
            _InitializeSmtpClient();
            var emailToSend = RegisterMail.RegisterMailFactory.CreateMail(user, userKey, htmlTemplatePath);
            await _smtpClient.SendMailAsync(emailToSend)
                .ContinueWith((task) => { _smtpClient.Dispose(); }).WithoutSync();
        }

        public async Task SendLogMailAsync(ExceptionLog log)
        {
            _InitializeSmtpClient();
            var emailToSend = LogMail.LogMailFactory.CreateMail(log);
            await _smtpClient.SendMailAsync(emailToSend)
               .ContinueWith((task) => { _smtpClient.Dispose(); }).WithoutSync();
        }

        private void _InitializeSmtpClient()
        {
            _smtpClient = new SmtpClient(SmtpServer, Port)
            {
                Credentials = new NetworkCredential(ApiKey, SecretKey),
                EnableSsl = true
            };
        }
        private SmtpClient _smtpClient;

        private const string SmtpServer = "in-v3.mailjet.com";
        private const int Port = 587;
        private const string ApiKey = "603b4b4243a9b552e034003d486fa2da";
        private const string SecretKey = "61a09cb935737e1a2e34b0c1f8e47d0b";
    }
}
