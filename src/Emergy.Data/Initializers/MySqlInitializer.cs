using System.Data.Entity;
using Emergy.Data.Context;

namespace Emergy.Data.Initializers
{
    public class MySqlInitializer : IDatabaseInitializer<ApplicationDbContext>
    {
        public void InitializeDatabase(ApplicationDbContext context)
        {
            if (!context.Database.Exists())
            {
                context.Database.Create();
            }
        }
    }

}