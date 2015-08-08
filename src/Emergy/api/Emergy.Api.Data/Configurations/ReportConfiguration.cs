using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Emergy.Api.Data.Models;

namespace Emergy.Api.Data.Configurations
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
