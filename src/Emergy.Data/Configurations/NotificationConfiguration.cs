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
                .HasForeignKey(n => n.SenderId)
                .WillCascadeOnDelete(false);
            HasOptional(n => n.Target)
                .WithMany(n => n.ReceievedNotifications)
                .HasForeignKey(n => n.TargetId)
                .WillCascadeOnDelete(false);
        }
    }
}
