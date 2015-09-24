using System.Collections.Generic;
using System.Threading.Tasks;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;

namespace Emergy.Core.Repositories
{
    public interface IReportsRepository : IRepository<Report>
    {
        Task<IEnumerable<Report>> GetAsync(ApplicationUser user);
        Task<bool> PermissionsGranted(int reportId, string userId);
        void Insert(Report entity, string userId, Unit unit);
    }
}
