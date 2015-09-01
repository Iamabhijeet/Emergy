﻿using System.Threading.Tasks;
using Emergy.Core.Models.Hub;
using Emergy.Data.Models;

namespace Emergy.Core.Services
{
    public interface IEmergyHubService
    {
        Task<HubData> Load(ApplicationUser user);
        string Stringify(HubData data);
    }
}
