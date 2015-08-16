using System.ComponentModel.DataAnnotations.Schema;
using Emergy.Data.Models.Base;

namespace Emergy.Data.Models
{
    public class Category : ModelBase
    {
        public string Name { get; set; }
        public Image Image { get; set; }
        public Unit Unit { get; set; }
    }
}
