using System;
using System.ComponentModel.DataAnnotations;

namespace Emergy.Core.Models.Assignment
{
    using Data.Models; 
    public class CreateAssigmentVm
    {
        [Required]
        public int      ReportId       { get; set; }
        [Required]
        public string   TargetId       { get; set; }
        public DateTime Timestamp      { get; set; } = DateTime.Now;
    }
    public class AssigmentVm
    {
        public int      ReportId               { get; set; }
        public string   AdminId                { get; set; }
        public string   AdminUserName          { get; set; }
        public string   TargetId               { get; set; }
        public string   TargetUserName         { get; set; }
        public DateTime Timestamp              { get; set; }

        public static AssigmentVm Create(Assignment model)
        {
            return new AssigmentVm
            {
                ReportId =       model.ReportId,
                AdminId =        model.AdminId,
                AdminUserName =  model.Admin.UserName,
                TargetId =       model.TargetId,
                TargetUserName = model.Target.UserName,
                Timestamp =      model.Timestamp
            };
        }
    }
}
