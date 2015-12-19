using System.Collections.Generic;
using Emergy.Core.Models.Stats;
using db = Emergy.Data.Models;

namespace Emergy.Core.Services
{
    public interface IStatsService
    {
        StatsViewModel ComputeStats(IReadOnlyCollection<db::Report> reportsForQuartal);
    }
}
