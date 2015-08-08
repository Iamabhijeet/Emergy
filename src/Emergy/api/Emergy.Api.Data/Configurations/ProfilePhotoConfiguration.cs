using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Emergy.Api.Data.Models;

namespace Emergy.Api.Data.Configurations
{
    public class ProfilePhotoConfiguration : EntityTypeConfiguration<ProfilePhoto>
    {
        public ProfilePhotoConfiguration()
        {
            ToTable("ProfilePhotos");
            HasRequired(x => x.User)
              .WithOptional(x => x.ProfilePhoto)
              .WillCascadeOnDelete(true);
        }
    }
}
