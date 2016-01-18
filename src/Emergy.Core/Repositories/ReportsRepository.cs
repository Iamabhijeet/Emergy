using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
            return (report.CreatorId == userId || report.Unit.AdministratorId == userId || report.Unit.Clients.ContainsUser(userId));
        }

        public async Task SetResources(int reportId, IEnumerable<int> resourceIds)
        {
            using (ApplicationDbContext context = ApplicationDbContext.Create())
            {
                var report = await context.Reports.FindAsync(reportId);
                if (report != null)
                {
                    foreach (var resourceId in resourceIds)
                    {
                        var resource = await context.Resources.FindAsync(resourceId);
                        if (resource != null)
                        {
                            report.Resources.Add(resource);
                        }
                    }
                    context.Reports.Attach(report);
                    context.Entry(report).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
        }
        public async Task SetCustomPropertyValues(int reportId, IEnumerable<int> valueIds)
        {
            using (ApplicationDbContext context = ApplicationDbContext.Create())
            {
                var report = await context.Reports.FindAsync(reportId);
                if (report != null)
                {
                    foreach (var valueId in valueIds)
                    {
                        var value = await context.CustomPropertyValues.FindAsync(valueId);
                        if (value != null)
                        {
                            report.Details.CustomPropertyValues.Add(value);
                        }
                    }
                    context.Reports.Attach(report);
                    context.Entry(report).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
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
