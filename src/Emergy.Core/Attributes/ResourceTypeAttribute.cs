using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Emergy.Core.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class ResourceTypeAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var file = value as HttpPostedFileBase;
            if (file != null)
            {
                return (AllowedTypes.Any(type => type.Trim() == file.ContentType.Trim()));
            }
            return false;
        }
        public string[] AllowedTypes { get; set; } = {
            "video/avi", "video/3gpp", "video/mp4", "video/ogg",
            "image/bm", "image/gif", "image/jpeg", "image/png",
            "audio/mpeg", "audio/x-wav", "audio/x-mpegurl", "audio/mp4", "application/mp4", "audio/ogg"
        };
    }
}
