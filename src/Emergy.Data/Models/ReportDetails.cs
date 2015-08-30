using System.Collections.Generic;
using Emergy.Data.Models.Base;
namespace Emergy.Data.Models
{
    public class ReportDetails : ModelBase
    {
        public ReportDetails()
        {
            CustomPropertyValues = new HashSet<CustomPropertyValue>();
        }
        public ICollection<CustomPropertyValue> CustomPropertyValues { get; set; }
    
    }
}
