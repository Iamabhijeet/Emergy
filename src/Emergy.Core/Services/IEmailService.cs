using System;
using System.Threading.Tasks;

namespace Emergy.Core.Services
{
    public interface IEmailService
    {
        Task SendRegisterMailAsync(string username, string userKey, string userEmail);
        Task SendLogMailAsync(Exception exception);
    }
}