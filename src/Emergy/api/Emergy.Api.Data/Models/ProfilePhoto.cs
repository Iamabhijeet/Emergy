using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Emergy.Api.Data.Models.Base;

namespace Emergy.Api.Data.Models
{
    public class ProfilePhoto : ModelBase
    {
        public string Url { get; set; }
        public byte[] Base64 { get; set; }

        public ApplicationUser User { get; set; }
    }
}
