using System;
using System.Threading.Tasks;
using Emergy.Core.Common;

namespace Emergy.Core.Services
{
    public class LoggingService : ILoggingService
    {
        public LoggingService(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public Task LogException(Exception exception)
        {
            throw new NotImplementedException();
        }
        public async Task SendLogMail(Exception exception)
        {
            await _emailService.SendLogMailAsync(exception).WithoutSync();
        }

        private readonly IEmailService _emailService;
    }
}
