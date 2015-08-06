using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Emergy.Api.Core.Repositories.Generic;
using Emergy.Api.Data.Context;
using Emergy.Api.Data.Models;

namespace Emergy.Api.Core.Repositories
{
    public class UnitsRepository : Repository<Unit>, IUnitsRepository
    {
        public UnitsRepository(ApplicationDbContext context) : base(context)
        {  
        }

        // Additional business logic implementation goes here

    }
}
