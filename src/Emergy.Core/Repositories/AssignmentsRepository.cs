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
    public class AssignmentsRepository : Repository<Assignment>, IAssignmentsRepository
    {
        public async Task<IEnumerable<Assignment>> GetAssignments(ApplicationUser user)
        {
            if (user.AccountType == AccountType.Client)
            {
                return (await GetAsync(assigment => assigment.TargetId == user.Id,
                    null, ConstRelations.LoadAllAssignmentRelations))
                    .OrderByDescending(assignment => assignment.Timestamp);

            }
            return (await GetAsync(assigment => assigment.AdminId == user.Id,
                   null, ConstRelations.LoadAllAssignmentRelations))
                   .OrderByDescending(assignment => assignment.Timestamp);
        }
        public async Task<IEnumerable<Assignment>> GetAssignments(Report report)
        {
            return (await GetAsync(assigment => assigment.ReportId == report.Id,
                   null, ConstRelations.LoadAllAssignmentRelations))
                   .OrderByDescending(assignment => assignment.Timestamp);
        }

        public AssignmentsRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
