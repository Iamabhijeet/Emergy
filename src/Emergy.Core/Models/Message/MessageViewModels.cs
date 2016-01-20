using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models;

namespace Emergy.Core.Models.Message
{
    public class CreateMessageVm
    {
        [Required]
        public string           Content    { get; set; }
        [Required]
        public string           TargetId   { get; set; }
        public IEnumerable<int> Multimedia { get; set; }
        public DateTime         Timestamp  { get; set; } = DateTime.Now;
    }

    public class MessageVm
    {
        public string                        SenderUserName { get; set; }
        public string                        SenderId       { get; set; }
        public string                        TargetId       { get; set; }
        public string                        Content        { get; set; }
        public virtual ICollection<Resource> Multimedia     { get; set; }
        public DateTime                      Timestamp      { get; set; }
    }
}
