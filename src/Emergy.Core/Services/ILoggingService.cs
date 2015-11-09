using System;
using System.Threading.Tasks;

namespace Emergy.Core.Services
{
    public interface ILoggingService
    {
        Task LogException(Exception exception);
        Task SendLogMail(Exception exception);
    }
}
