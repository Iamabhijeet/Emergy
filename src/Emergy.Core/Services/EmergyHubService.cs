using System.Collections.Generic;
using System.Threading.Tasks;
using Emergy.Core.Common;
using Emergy.Core.Models.Hub;
using Emergy.Core.Repositories;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;
using System.Linq;
using Emergy.Core.Repositories.Generic;
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


        private readonly JsonSerializerSettings _jsonSerializerSettings;
        private readonly IUnitsRepository _unitsRepository;
        private readonly IRepository<Report> _reportsRepository;
    }
}
