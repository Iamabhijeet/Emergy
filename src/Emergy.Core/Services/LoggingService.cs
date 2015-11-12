using System;
using System.Runtime.Remoting.Messaging;
using System.Threading.Tasks;
using Emergy.Core.Common;
using Emergy.Core.Models.Log;

namespace Emergy.Core.Services
{
    public class LoggingService : ILoggingService
    {
        public LoggingService(IEmailService emailService, string path = null)
        {
            _emailService = emailService;
            _loggingService = new JsonService<ExceptionLog>(path);
        }

        public void LogException(ExceptionLog log)
        {
            _loggingService.Add(log);
        }
        public async Task SendLogMail(ExceptionLog log)
        {
            await _emailService.SendLogMailAsync(log).WithoutSync();
        }

        private readonly IEmailService _emailService;
        private readonly JsonService<ExceptionLog> _loggingService;
    }
}
