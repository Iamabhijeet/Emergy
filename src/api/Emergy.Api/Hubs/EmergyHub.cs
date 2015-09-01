using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.Web;
using Emergy.Core.Models.Hub;
using Emergy.Core.Services;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.SignalR;
using static Emergy.Core.Common.IEnumerableExtensions;

namespace Emergy.Api.Hubs
{
    [Authorize]
    public class EmergyHub : Hub
    {
        public EmergyHub(IEmergyHubService hubService)
        {
            _hubService = hubService;
            _userConnections = new ConcurrentDictionary<string, ApplicationUser>();
        }

        public async Task Load()
        {
            ApplicationUser user;
            _userConnections.TryGetValue(Context.ConnectionId, out user);

            HubData data = await _hubService.Load(user);
            await Clients.Client(Context.ConnectionId).loadApp(_hubService.Stringify(data));
        }

        public async override Task OnConnected()
        {
            await base.OnConnected();
            var currentUser = await AccountService.GetUserByNameAsync(Context.User.Identity.Name);
            _userConnections.TryAdd(Context.ConnectionId, currentUser);
            currentUser.Units.ForEach(async (unit) =>
            {
                await Groups.Add(Context.ConnectionId, unit.Name);
            });
        }
        public async override Task OnReconnected()
        {
            await base.OnReconnected().ContinueWith(async (task) =>
            {
                await OnConnected();
            });
        }
        public async override Task OnDisconnected(bool stopCalled)
        {
            await base.OnDisconnected(stopCalled);
            ApplicationUser currentUser;
            _userConnections.TryRemove(Context.ConnectionId, out currentUser);
            currentUser.Units.ForEach(async (unit) =>
            {
                await Groups.Remove(Context.ConnectionId, unit.Name);
            });
        }

        private readonly ConcurrentDictionary<string, ApplicationUser> _userConnections;

        protected IAccountService AccountService
        {
            get
            {
                return _accountService ?? HttpContext.Current.GetOwinContext().Get<IAccountService>();
            }
            set
            {
                _accountService = value;
            }
        }
        private IAccountService _accountService;
        private readonly IEmergyHubService _hubService;
    }
}