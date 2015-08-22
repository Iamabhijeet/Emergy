using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class CustomPropertyConfiguration : EntityTypeConfiguration<CustomProperty>
    {
        public CustomPropertyConfiguration()
        {
            ToTable("CustomProperties");

            HasOptional(x => x.CustomPropertyValue)
                .WithOptionalPrincipal(x => x.CustomProperty)
                .WillCascadeOnDelete();

            HasRequired(x => x.Unit)
              .WithMany(x => x.CustomProperties)
              .WillCascadeOnDelete();
        }
    }
}
