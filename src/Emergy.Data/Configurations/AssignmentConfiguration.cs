using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class AssignmentConfiguration : EntityTypeConfiguration<Assignment>
    {
        public AssignmentConfiguration()
        {
            ToTable("Assignments");

            HasRequired(a => a.Admin)
                .WithMany(a => a.CreatedAssignments)
                .HasForeignKey(a => a.AdminId)
                .WillCascadeOnDelete(false);

            HasRequired(a => a.Target)
                .WithMany(a => a.ReceievedAssignments)
                .HasForeignKey(a => a.TargetId)
                .WillCascadeOnDelete(false);

            HasRequired(a => a.Report)
                .WithMany(a => a.Assignments)
                .HasForeignKey(a => a.ReportId)
                .WillCascadeOnDelete();
        }
    }
}
