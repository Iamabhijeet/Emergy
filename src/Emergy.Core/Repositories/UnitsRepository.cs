using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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

        public async Task AddCustomProperty(int unitId, CustomProperty property)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                unit.CustomProperties.Add(property);
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

        public async Task<bool> IsAdministrator(int unitId, string adminId)
        {
            var unit = await GetAsync(unitId);
            return unit.AdministratorId == adminId;
        }
    }
}
