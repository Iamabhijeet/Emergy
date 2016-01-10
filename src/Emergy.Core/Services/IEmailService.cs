using System.Threading.Tasks;
using Emergy.Core.Models.Log;
using Emergy.Data.Models;

namespace Emergy.Core.Services
{
    public interface IEmailService
    {
        Task SendNotificationMailAsync(Notification notification, string htmlTemplatePath);
        Task SendRegisterMailAsync(ApplicationUser user, string userKey, string templatePath);
        Task SendLogMailAsync(ExceptionLog log);
    }
}