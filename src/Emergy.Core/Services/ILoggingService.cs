using System;
using System.Threading.Tasks;
using Emergy.Core.Models.Log;

namespace Emergy.Core.Services
{
    public interface ILoggingService
    {
        void LogException(ExceptionLog log);
        Task SendLogMail(ExceptionLog log);
    }
}
