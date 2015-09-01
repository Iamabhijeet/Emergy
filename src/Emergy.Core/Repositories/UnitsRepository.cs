using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Emergy.Core.Common;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Context;
using Emergy.Data.Models;

namespace Emergy.Core.Repositories
{
    public class UnitsRepository : Repository<Unit>, IUnitsRepository
    {
        public UnitsRepository(ApplicationDbContext context) : base(context)
        {
        }

    
        public override async Task<Unit> GetAsync(object id)
        {
            return (await this.GetAsync(unit => unit.Id ==  (int) id, null, ConstRelations.LoadAllUnitRelations)).SingleOrDefault();
        }

        public async Task<IEnumerable<Unit>> GetUnitsForAdmin(ApplicationUser admin)
        {
            return await this.GetAsync(unit => unit.AdministratorId == admin.Id,
                query => query.OrderBy(u => u.DateCreated), ConstRelations.LoadAllUnitRelations);
        }
    }
}
