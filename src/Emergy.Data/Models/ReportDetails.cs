using System.Collections.Generic;
using Emergy.Data.Models.Base;
namespace Emergy.Data.Models
{
    public class ReportDetails : ModelBase
    {
        public ReportDetails()
        {
            Properties = new HashSet<AdditionalProperty>();
        }
        public ICollection<AdditionalProperty> Properties { get; set; }
    
    }
}
