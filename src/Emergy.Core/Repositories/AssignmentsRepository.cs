using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Emergy.Core.Common;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Context;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;

namespace Emergy.Core.Repositories
{
    public class AssignmentsRepository : Repository<Assignment>, IAssignmentsRepository
    {
        public async Task<IEnumerable<Assignment>> GetAssignments(ApplicationUser user)
        {
            IOrderedQueryable<Assignment> assignments;
            if (user.AccountType == AccountType.Client)
            {
                assignments = DbSet.Where(assigment => assigment.TargetId == user.Id)
                    .OrderByDescending(assigment => assigment.Timestamp);
                return await assignments.ToArrayAsync().WithoutSync();
            }
            assignments = DbSet.Where(assigment => assigment.AdminId == user.Id)
                .OrderByDescending(assigment => assigment.Timestamp);
            return await assignments.ToArrayAsync().WithoutSync();
        }
        public async Task<IEnumerable<Assignment>> GetAssignments(Report report)
        {
            var assignments = DbSet.Where(assigment => assigment.ReportId == report.Id)
                .OrderByDescending(assigment => assigment.Timestamp);
            return await assignments.ToArrayAsync().WithoutSync();
        }

        public AssignmentsRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
