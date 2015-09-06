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
    public class ReportsRepository : Repository<Report>, IReportsRepository
    {
        public ReportsRepository(ApplicationDbContext context) : base(context)
        {

        }

        public async Task<IEnumerable<Report>> GetAsync(ApplicationUser user)
        {
            return await this.GetAsync(report => report.CreatorId == user.Id,
                query => query.OrderBy(r => r.DateHappened), ConstRelations.LoadAllReportRelations).WithoutSync();
        }

        public override void Insert(Report entity)
        {
            entity.Details = new ReportDetails();
            entity.Status = ReportStatus.Created;
            base.Insert(entity);
        }
    }
}
