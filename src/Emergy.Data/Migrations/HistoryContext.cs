using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Migrations.History;

namespace Emergy.Data.Migrations
{
    public class HistoryContext : System.Data.Entity.Migrations.History.HistoryContext
    {
        public HistoryContext(DbConnection connection, string defaultSchema)
            : base(connection, defaultSchema)
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<HistoryRow>().Property(h => h.MigrationId).HasMaxLength(128).IsRequired();
            modelBuilder.Entity<HistoryRow>().Property(h => h.ContextKey).HasMaxLength(256).IsRequired();
        }
    }

}