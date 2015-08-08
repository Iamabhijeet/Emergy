using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Emergy.Api.Data.Models.Base;

namespace Emergy.Api.Data.Models
{
    public class Image : ModelBase
    {
        public string Url { get; set; }
        public byte[] Base64 { get; set; }
        public Report Report { get; set; }
    }
}
