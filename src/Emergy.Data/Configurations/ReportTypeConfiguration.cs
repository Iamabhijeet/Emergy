using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class ReportTypeConfiguration : EntityTypeConfiguration<ReportType>
    {
        public ReportTypeConfiguration()
        {
            ToTable("ReportTypes");

            HasOptional(x => x.Image)
                .WithOptionalPrincipal()
                .WillCascadeOnDelete();


        }
    }
}
