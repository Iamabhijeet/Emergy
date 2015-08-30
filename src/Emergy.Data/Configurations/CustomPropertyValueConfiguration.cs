using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class CustomPropertyValueConfiguration : EntityTypeConfiguration<CustomPropertyValue>
    {
        public CustomPropertyValueConfiguration()
        {
            ToTable("CustomPropertyValues");
        }
    }
}
