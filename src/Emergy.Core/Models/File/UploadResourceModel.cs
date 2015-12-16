using System.ComponentModel.DataAnnotations;

namespace Emergy.Core.Models.File
{
    public class UploadResourceModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Base64 { get; set; }
        [Required]
        public string ContentType { get; set; }
    }
}
