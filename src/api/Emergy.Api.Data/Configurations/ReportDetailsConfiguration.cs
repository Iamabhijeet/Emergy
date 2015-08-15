using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class ReportDetailsConfiguration : EntityTypeConfiguration<ReportDetails>
    {
        public ReportDetailsConfiguration()
        {
            ToTable("ReportDetails");

            HasMany(x => x.Properties)
                .WithOptional()
                .WillCascadeOnDelete(true);
        }
    }
}
