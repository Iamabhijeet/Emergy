using System.Collections.Generic;
using System.Threading.Tasks;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;

namespace Emergy.Core.Repositories
{
    public interface IAssignmentsRepository : IRepository<Assignment>
    {
        Task<IEnumerable<Assignment>> GetAssignments(ApplicationUser client);
        Task<IEnumerable<Assignment>> GetAssignments(Report report);
    }
}
