using System;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace Emergy.Core.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class ResourceMaxSizeAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var file = value as HttpPostedFileBase;
            return file != null && file.ContentLength <= SizeInBytes;
        }
        public int SizeInBytes { get; set; } = (25 * 1024 * 1024);
    }
}
