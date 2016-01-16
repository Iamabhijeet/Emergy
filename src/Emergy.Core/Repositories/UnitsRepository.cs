using System;
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
    public class UnitsRepository : Repository<Unit>, IUnitsRepository
    {
        public UnitsRepository(ApplicationDbContext context) : base(context)
        {
        }
        public override async Task<Unit> GetAsync(object id)
        {
            return (await this.GetAsync(unit => unit.Id == (int)id, null, ConstRelations.LoadAllUnitRelations)
                .WithoutSync()).SingleOrDefault();
        }
        public async Task<IEnumerable<Unit>> GetAsync(ApplicationUser user)
        {
            switch (user.AccountType)
            {
                case AccountType.Administrator:
                    {
                        return await this.GetAsync(unit => unit.AdministratorId == user.Id,
                                     query => query.OrderByDescending(u => u.DateCreated), ConstRelations.LoadAllUnitRelations).WithoutSync();
                    }
                case AccountType.Client:
                    {
                        var units = await this.GetAsync(null, query => query.OrderByDescending(u => u.DateCreated), ConstRelations.LoadAllUnitRelations).WithoutSync();
                        return units.Where(unit => unit.Clients.ContainsUser(user));
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
        public async Task<IEnumerable<Report>> GetReportsForUser(ApplicationUser user, DateTime? lastHappened)
        {
            switch (user.AccountType)
            {
                case AccountType.Administrator:
                    {
                        var adminUnits = await this.GetAsync(user);
                        var units = adminUnits as Unit[] ?? adminUnits.ToArray();

                        if (units
                            .Where(unit => unit.AdministratorId == user.Id)
                            .Select(unit => unit.Reports).Any())
                        {
                            var reports =
                                units.AsParallel()
                                    .Where(unit => unit.AdministratorId == user.Id)
                                    .Select(unit => unit.Reports)
                                    .Aggregate((current, next) =>
                                    {
                                        if (current != null && next != null)
                                        {
                                            return next.Concat(current).ToList();
                                        }
                                        return null;
                                    })
                                    .OrderByDescending(report => report.DateHappened)
                                    .ToArray();
                            if (lastHappened == null)
                            {
                                return reports.Take(10);
                            }
                            return reports.Where(report => report.DateHappened > lastHappened)
                                .OrderByDescending(report => report.DateHappened)
                                .Take(10);
                        }
                        return Enumerable.Empty<Report>();
                    }
                case AccountType.Client:
                    {
                        var reports = Context.Reports.Where(report => report.CreatorId == user.Id)
                                                     .OrderByDescending(report => report.DateHappened);
                        if (lastHappened == null)
                        {
                            return await reports.Take(10)
                                                .ToArrayAsync()
                                                .WithoutSync();
                        }
                        return await reports.Where(report => report.DateHappened > lastHappened)
                                .OrderByDescending(report => report.DateHappened)
                                .Take(10)
                                .ToArrayAsync()
                                .WithoutSync();
                    }
                default:
                    {
                        return Enumerable.Empty<Report>();
                    }
            }
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
                await this.SaveAsync();
            }
        }
        public async Task RemoveCustomProperty(int unitId, int propertyId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                CustomProperty property = await Context.CustomProperties.FindAsync(propertyId);
                unit.CustomProperties.Remove(property);
                await this.SaveAsync();
            }
        }
        public async Task AddClient(int unitId, string userId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                unit.Clients.Add(Context.Users.Find(userId));
                await this.SaveAsync();
            }
        }
        public async Task RemoveClient(int unitId, string userId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                ApplicationUser user = Context.Users.Find(userId);
                unit.Clients.Remove(user);
                await this.SaveAsync();
            }
        }
        public async Task AddLocation(int unitId, int locationId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                unit.Locations.Add(await Context.Locations.FindAsync(locationId));
                await this.SaveAsync();
            }
        }
        public async Task RemoveLocation(int unitId, int locationId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                Location location = await Context.Locations.FindAsync(locationId);
                unit.Locations.Remove(location);
                await this.SaveAsync();
            }
        }
        public async Task AddCategory(int unitId, int categoryId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                unit.Categories.Add(await Context.Categories.FindAsync(categoryId));
                await this.SaveAsync();
            }
        }
        public async Task RemoveCategory(int unitId, int categoryId)
        {
            var unit = await this.GetAsync(unitId);
            if (unit != null)
            {
                unit.Categories.Remove(await Context.Categories.FindAsync(categoryId));
                await this.SaveAsync();
            }
        }
        public async Task<bool> IsAdministrator(int unitId, string adminId)
        {
            var unit = await GetAsync(unitId);
            return unit.AdministratorId == adminId;
        }
        public async Task<bool> IsInUnit(int unitId, string userId)
        {
            return (await GetUsers(unitId).WithoutSync()).Any(u => u.Id == userId);
        }

        public async Task<IEnumerable<Report>> GetAllReportsForAdmin(ApplicationUser user)
        {
            var adminUnits = await this.GetAsync(user);
            var units = adminUnits as Unit[] ?? adminUnits.ToArray();

            if (units
                .Where(unit => unit.AdministratorId == user.Id)
                .Select(unit => unit.Reports).Any())
            {
               return 
                    units.AsParallel()
                        .Where(unit => unit.AdministratorId == user.Id)
                        .Select(unit => unit.Reports)
                        .Aggregate((current, next) =>
                        {
                            if (current != null && next != null)
                            {
                                return next.Concat(current).ToList();
                            }
                            return null;
                        })
                        .OrderByDescending(report => report.DateHappened)
                        .ToArray();
            }
            return Enumerable.Empty<Report>();
        }

        public override void Delete(Unit entityToDelete)
        {
            entityToDelete.Clients.Clear();
            entityToDelete.Locations.Clear();
            entityToDelete.Categories.Clear();
            entityToDelete.Reports.Clear();
            entityToDelete.CustomProperties.Clear();
            entityToDelete.Administrator = null;
            base.Delete(entityToDelete);
        }
    }
}
