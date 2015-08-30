using System.Threading.Tasks;
using System.Web;
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic.Soundy.Core.Repositories;
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
        public EmergyHub(IUnitsRepository unitsRepository, IRepository<Report> reportsRepository)
        {
            _unitsRepository = unitsRepository;
            _reportsRepository = reportsRepository;
        }

        public async override Task OnConnected()
        {
            await base.OnConnected();
            var currentUser = await AccountService.GetUserByNameAsync(Context.User.Identity.Name);
            currentUser.Units.ForEach(unit =>
            {
                Groups.Add(Context.ConnectionId, unit.Name);
            });
        }
        public async override Task OnReconnected()
        {
            await base.OnReconnected();
            var currentUser = await AccountService.GetUserByNameAsync(Context.User.Identity.Name);
            currentUser.Units.ForEach(unit =>
            {
                Groups.Add(Context.ConnectionId, unit.Name);
            });
        }
        public async override Task OnDisconnected(bool stopCalled)
        {
            await base.OnDisconnected(stopCalled);
            var currentUser = await AccountService.GetUserByNameAsync(Context.User.Identity.Name);
            currentUser.Units.ForEach(unit =>
            {
                Groups.Remove(Context.ConnectionId, unit.Name);
            });
        }

        


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
        private IUnitsRepository _unitsRepository;
        private IRepository<Report> _reportsRepository;
    }
}