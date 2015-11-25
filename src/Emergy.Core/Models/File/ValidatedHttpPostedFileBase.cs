using System.Web;
using Emergy.Core.Attributes;

namespace Emergy.Core.Models.File
{
    public class ValidatedHttpPostedFileBase : HttpPostedFileBase
    {
        [ResourceMaxSize]
        public override int ContentLength { get; }
        [ResourceType]
        public override string ContentType { get; }
    }
}
