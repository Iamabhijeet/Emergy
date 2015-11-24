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
                query => query.OrderByDescending(r => r.DateHappened), ConstRelations.LoadAllReportRelations).WithoutSync();
        }

        public override async Task<Report> GetAsync(object id)
        {
            return (await this.GetAsync(report => report.Id == (int)id,
                null, ConstRelations.LoadAllReportRelations).WithoutSync()).SingleOrDefault();
        }

        public async Task<bool> PermissionsGranted(int reportId, string userId)
        {
            Report report = await this.GetAsync(reportId).WithoutSync();
            return (report.CreatorId == userId || report.Unit.AdministratorId == userId);
        }

        public void Insert(Report entity, string userId, Unit unit)
        {
            entity.Details = new ReportDetails();
            entity.Status = ReportStatus.Created;
            entity.CreatorId = userId;
            entity.Unit = unit;
            base.Insert(entity);
        }
    }
}
