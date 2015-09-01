using System.Collections.Generic;
using System.Threading.Tasks;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;

namespace Emergy.Core.Repositories
{
    public interface IReportsRepository : IRepository<Report>
    {
        Task<IEnumerable<Report>> GetReportsForUser(ApplicationUser user);
    }
}
