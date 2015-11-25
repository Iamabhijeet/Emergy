using Emergy.Data.Models.Base;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class Category : ModelBase
    {
        public string Name { get; set; }
        [JsonIgnore]
        public virtual Unit Unit { get; set; }
    }
}
