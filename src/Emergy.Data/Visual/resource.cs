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
    
    public partial class Resource
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Resource()
        {
            this.AspNetUsers = new HashSet<AspNetUser>();
        }
    
        public int Id { get; set; }
        public string Url { get; set; }
        public string Name { get; set; }
        public System.DateTime DateUploaded { get; set; }
        public string MimeType { get; set; }
        public string Base64 { get; set; }
        public Nullable<int> Message_Id { get; set; }
        public Nullable<int> Report_Id { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AspNetUser> AspNetUsers { get; set; }
        public virtual Message Message { get; set; }
        public virtual Report Report { get; set; }
    }
}
