using Emergy.Data.Models;
using System.Data.Entity.ModelConfiguration;

namespace Emergy.Data.Configurations
{
    public class NotificationConfiguration : EntityTypeConfiguration<Notification>
    {
        public NotificationConfiguration()
        {
            ToTable("Notifications");
            HasOptional(n => n.Sender)
                .WithMany(n => n.SentNotifications)
                .WillCascadeOnDelete();
            HasOptional(n => n.Target)
              .WithMany(n => n.ReceievedNotifications)
              .WillCascadeOnDelete();
        }
    }
}
