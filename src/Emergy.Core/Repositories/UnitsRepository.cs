using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Emergy.Core.Common;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Context;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;

namespace Emergy.Core.Repositories
{
    public class UnitsRepository : Repository<Unit>, IUnitsRepository
    {
        public UnitsRepository(ApplicationDbContext context) : base(context)
        {
        }
        public override async Task<Unit> GetAsync(object id)
        {
            return (await this.GetAsync(unit => unit.Id == (int)id, null, ConstRelations.LoadAllUnitRelations)
                .ConfigureAwait(false)).SingleOrDefault();
        }
        public async Task<IEnumerable<Unit>> GetAsync(ApplicationUser user)
        {
            switch (user.AccountType)
            {
                case AccountType.Administrator:
                    {
                        return await this.GetAsync(unit => unit.AdministratorId == user.Id,
                                     query => query.OrderBy(u => u.DateCreated), ConstRelations.LoadAllUnitRelations).ConfigureAwait(false);
                    }
                case AccountType.Client:
                    {
                        var units = await this.GetAsync(null, query => query.OrderBy(u => u.DateCreated), ConstRelations.LoadAllUnitRelations).ConfigureAwait(false);
                        return units.Where(unit => unit.Clients.Contains(user));
                    }
            }
            return null;
        }
        public async Task<IEnumerable<ApplicationUser>> GetUsers(int unitId)
        {
            return (await GetAsync(unitId)).Clients;
        }
        public async Task<IEnumerable<Location>> GetLocations(int unitId)
        {
            return (await GetAsync(unitId)).Locations;
        }
        public async Task<IEnumerable<Report>> GetReports(int unitId)
        {
            return (await GetAsync(unitId)).Reports;
        }
        public async Task<IEnumerable<CustomProperty>> GetCustomProperties(int unitId)
        {
            return (await GetAsync(unitId)).CustomProperties;
        }
        public async Task AddCustomProperty(int unitId, int propertyId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                unit.CustomProperties.Add(await Context.CustomProperties.FindAsync(propertyId));
                this.Update(unit);
                await this.SaveAsync();
            }
        }
        public async Task RemoveCustomProperty(int unitId, int propertyId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                CustomProperty property = unit.CustomProperties.SingleOrDefault(prop => prop.Id == propertyId);
                if (unit.CustomProperties.Contains(property))
                {
                    unit.CustomProperties.Remove(property);
                    this.Update(unit);
                    await this.SaveAsync();
                }
            }
        }
        public async Task AddClient(int unitId, string userId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                unit.Clients.Add(Context.Users.Find(userId));
                this.Update(unit);
                await this.SaveAsync();
            }
        }
        public async Task RemoveClient(int unitId, string userId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                ApplicationUser user = unit.Clients.SingleOrDefault(u => u.Id == userId);
                if (unit.Clients.Contains(user))
                {
                    unit.Clients.Remove(user);
                    this.Update(unit);
                    await this.SaveAsync();
                }
            }
        }
        public async Task AddLocation(int unitId, int locationId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                unit.Locations.Add(await Context.Locations.FindAsync(locationId));
                this.Update(unit);
                await this.SaveAsync();
            }
        }
        public async Task RemoveLocation(int unitId, int locationId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                Location location = unit.Locations.SingleOrDefault(l => l.Id == locationId);
                if (unit.Locations.Contains(location))
                {
                    unit.Locations.Remove(location);
                    this.Update(unit);
                    await this.SaveAsync();
                }
            }
        }
        public async Task<bool> IsAdministrator(int unitId, string adminId)
        {
            var unit = await GetAsync(unitId);
            return unit.AdministratorId == adminId;
        }
    }
}
