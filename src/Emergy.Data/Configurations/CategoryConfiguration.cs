using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class CategoryConfiguration : EntityTypeConfiguration<Category>
    {
        public CategoryConfiguration()
        {
            ToTable("Categories");

            HasOptional(x => x.Image)
                .WithOptionalPrincipal()
                .WillCascadeOnDelete();
        }
    }
}
