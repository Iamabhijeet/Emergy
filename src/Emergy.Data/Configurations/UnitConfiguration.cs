using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class UnitConfiguration : EntityTypeConfiguration<Unit>
    {
        public UnitConfiguration()
        {
            ToTable("Units");

            HasMany(x => x.AdditionalProperties)
             .WithOptional()
             .WillCascadeOnDelete(true);

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
