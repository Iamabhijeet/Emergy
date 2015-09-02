using System.Collections.Generic;
using System.Threading.Tasks;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;

namespace Emergy.Core.Repositories
{
    public interface IUnitsRepository : IRepository<Unit>
    {
        Task<IEnumerable<Unit>> GetAsync(ApplicationUser user);
        Task AddCustomProperty(int unitId, CustomProperty property);
        Task RemoveCustomProperty(int unitId, int propertyId);
        Task<bool> IsAdministrator(int unitId, string adminId);
    }
}
