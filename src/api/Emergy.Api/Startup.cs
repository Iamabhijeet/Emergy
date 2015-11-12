using Emergy.Api;
using Emergy.Core.Common;
using Emergy.Core.Services;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace Emergy.Api
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR(new HubConfiguration()
            {
                EnableDetailedErrors = true
            });
            ConfigureAuth(app);
        }
    }
}
