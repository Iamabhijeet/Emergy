﻿using System.Data.Entity.ModelConfiguration;
using Emergy.Data.Models;

namespace Emergy.Data.Configurations
{
    public class MessageConfiguration : EntityTypeConfiguration<Message>
    {
        public MessageConfiguration()
        {
            ToTable("Messages");
            HasOptional(n => n.Sender)
                .WithMany(n => n.SentMessages)
                .WillCascadeOnDelete();
            HasOptional(n => n.Target)
              .WithMany(n => n.ReceievedMessages)
              .WillCascadeOnDelete();
        }
    }
}
