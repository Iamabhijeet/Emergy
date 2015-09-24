using System.Collections.Generic;
using Emergy.Data.Models;


namespace Emergy.Core.Models.Hub
{
    public class HubData
    {
        public HubData()
        {
            Units = new List<Data.Models.Unit>();
            Reports = new List<Data.Models.Report>();
        }
        public IEnumerable<Data.Models.Unit> Units { get; set; }
        public IEnumerable<Data.Models.Report> Reports { get; set; }
    }
}
