//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Emergy.Data.Visual
{
    using System;
    using System.Collections.Generic;
    
    public partial class Assignment
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public string TargetId { get; set; }
        public string AdminId { get; set; }
        public System.DateTime Timestamp { get; set; }
    
        public virtual AspNetUser AspNetUser { get; set; }
        public virtual AspNetUser AspNetUser1 { get; set; }
        public virtual Report Report { get; set; }
    }
}