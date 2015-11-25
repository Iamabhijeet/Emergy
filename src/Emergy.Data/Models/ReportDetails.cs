using System.Collections.Generic;
using Emergy.Data.Models.Base;
namespace Emergy.Data.Models
{
    public class ReportDetails : ModelBase
    {
        public virtual ICollection<CustomPropertyValue> CustomPropertyValues { get; set; }
    }
}
