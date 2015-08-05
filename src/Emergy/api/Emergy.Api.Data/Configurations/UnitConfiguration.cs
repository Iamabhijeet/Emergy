using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Emergy.Api.Data.Models;

namespace Emergy.Api.Data.Configurations
{
    public class UnitConfiguration : EntityTypeConfiguration<Unit>
    {
        public UnitConfiguration()
        {
            ToTable("Units");

            HasMany(x => x.Clients)
              .WithMany(x => x.Units)
              .Map(mapping =>
              {
                  mapping.MapLeftKey("UnitId")
                      .MapRightKey("ClientId")
                      .ToTable("Units2Clients");
              });
        }
    }
}
