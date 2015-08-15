using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class ReportConfiguration : EntityTypeConfiguration<Report>
    {
        public ReportConfiguration()
        {
            ToTable("Reports");

            HasRequired(x => x.ReportType)
                .WithRequiredPrincipal(x => x.Report);

            HasMany(x => x.Photos)
              .WithOptional(x => x.Report)
              .WillCascadeOnDelete(true);
        }
    }
}
