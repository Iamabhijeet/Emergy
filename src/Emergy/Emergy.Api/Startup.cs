using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Emergy.Api.Startup))]
namespace Emergy.Api
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
