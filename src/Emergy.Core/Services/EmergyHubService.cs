using System.Collections.Generic;
using System.Threading.Tasks;
using Emergy.Core.Common;
using Emergy.Core.Models.Hub;
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic.Soundy.Core.Repositories;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;
using System.Linq;
using Newtonsoft.Json;

namespace Emergy.Core.Services
{
    public class EmergyHubService : IEmergyHubService
    {
        public EmergyHubService(IUnitsRepository unitsRepository, IRepository<Report> reportsRepository)
        {
            _unitsRepository = unitsRepository;
            _reportsRepository = reportsRepository;
            _jsonSerializerSettings = new JsonSerializerSettings
            {
                PreserveReferencesHandling = PreserveReferencesHandling.All,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            };
        }

        public async Task<HubData> Load(ApplicationUser user)
        {
            HubData hubData = new HubData();
            switch (user.AccountType)
            {
                case AccountType.Administrator:
                    {
                        hubData.Units = await GetUnitsForAdmin(user);
                        break;
                    }
                case AccountType.Client:
                    {
                        hubData.Reports = await GetReportsForUser(user);
                        break;
                    }
            }
            return hubData;
        }

        public string Stringify(HubData data)
        {
            return JsonConvert.SerializeObject(data, Formatting.Indented, _jsonSerializerSettings);
        }


        private async Task<IEnumerable<Unit>> GetUnitsForAdmin(ApplicationUser admin)
        {
            return await _unitsRepository.GetAsync(unit => unit.AdministratorId == admin.Id,
                query => query.OrderBy(u => u.DateCreated), ConstRelations.LoadAllUnitRelations);
        }
        private async Task<IEnumerable<Report>> GetReportsForUser(ApplicationUser user)
        {
            return await _reportsRepository.GetAsync(report => report.CreatorId == user.Id,
                query => query.OrderBy(r => r.DateHappened), ConstRelations.LoadAllReportRelations);
        }

        private readonly JsonSerializerSettings _jsonSerializerSettings;
        private readonly IUnitsRepository _unitsRepository;
        private readonly IRepository<Report> _reportsRepository;
    }
}
