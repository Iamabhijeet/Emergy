using System.Data.Entity;
using Emergy.Data.Context;

namespace Emergy.Data.Initializers
{
    public class DbInitializer : IDatabaseInitializer<ApplicationDbContext>
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