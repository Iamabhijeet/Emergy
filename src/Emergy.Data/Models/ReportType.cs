using System.ComponentModel.DataAnnotations.Schema;
using Emergy.Data.Models.Base;

namespace Emergy.Data.Models
{
    public class ReportType : ModelBase
    {
        public string Name { get; set; }
        public Image Image { get; set; }
        public Report Report { get; set; }
    }
}
