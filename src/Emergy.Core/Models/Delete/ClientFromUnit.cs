
using System.ComponentModel.DataAnnotations;

namespace Emergy.Core.Models.Delete
{
    public class ClientFromUnit
    {
        [Required]
        public int UnitId { get; set; }
        [Required]
        public string ClientId { get; set; }
    }
}
