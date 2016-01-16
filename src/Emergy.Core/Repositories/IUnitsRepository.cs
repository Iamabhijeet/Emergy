using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;

namespace Emergy.Core.Repositories
{
    public interface IUnitsRepository : IRepository<Unit>
    {
        Task<IEnumerable<Unit>> GetAsync(ApplicationUser user);
        Task<IEnumerable<ApplicationUser>> GetUsers(int unitId);
        Task<IEnumerable<Location>> GetLocations(int unitId);
        Task<IEnumerable<Report>> GetReports(int unitId);
        Task<IEnumerable<Report>> GetReportsForUser(ApplicationUser user, DateTime? lastHappened);
        Task<IEnumerable<Report>> GetAllReportsForAdmin(ApplicationUser user);
        Task<IEnumerable<CustomProperty>> GetCustomProperties(int unitId);

        Task AddCustomProperty(int unitId, int propertyId);
        Task RemoveCustomProperty(int unitId, int propertyId);

        Task AddClient(int unitId, string userId);
        Task RemoveClient(int unitId, string userId);

        Task AddLocation(int unitId, int locationId);
        Task RemoveLocation(int unitId, int locationId);

        Task AddCategory(int unitId, int categoryId);
        Task RemoveCategory(int unitId, int categoryId);
        Task<bool> IsAdministrator(int unitId, string adminId);
        Task<bool> IsInUnit(int unitId, string userId);
    }
}
