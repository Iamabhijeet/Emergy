using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class UnitConfiguration : EntityTypeConfiguration<Unit>
    {
        public UnitConfiguration()
        {
            ToTable("Units");

            HasMany(x => x.Categories)
              .WithOptional(x => x.Unit)
              .WillCascadeOnDelete();

            HasMany(x => x.Locations)
             .WithOptional()
             .WillCascadeOnDelete();

            HasMany(x => x.Reports)
              .WithOptional(x => x.Unit)
              .WillCascadeOnDelete(false);

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
