
using System.Collections.Generic;

namespace Emergy.Core.Models.File
{
    public class UploadMultipleResourcesViewModel
    {
        public UploadMultipleResourcesViewModel()
        {
            Files = new List<ValidatedHttpPostedFileBase>();
        }
        public ICollection<ValidatedHttpPostedFileBase> Files { get; set; }
    }
}
