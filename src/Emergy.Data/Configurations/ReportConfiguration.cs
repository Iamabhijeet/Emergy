using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class ReportConfiguration : EntityTypeConfiguration<Report>
    {
        public ReportConfiguration()
        {
            ToTable("Reports");

            HasMany(x => x.Photos)
              .WithOptional(x => x.Report)
              .WillCascadeOnDelete(true);
        }
    }
}
