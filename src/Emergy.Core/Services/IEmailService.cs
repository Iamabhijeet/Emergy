using System.Threading.Tasks;
using Emergy.Core.Models.Log;

namespace Emergy.Core.Services
{
    public interface IEmailService
    {
        Task SendRegisterMailAsync(string username, string userKey, string userEmail);
        Task SendLogMailAsync(ExceptionLog log);
    }
}