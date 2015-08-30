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

        // Additional business logic implementation goes here

    }
}
