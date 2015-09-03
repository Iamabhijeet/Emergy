using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Emergy.Core.Models.Hub;
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic;
using Emergy.Core.Services;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using static Emergy.Core.Common.IEnumerableExtensions;

namespace Emergy.Api.Hubs
{
    [Authorize]
    [HubName("emergyHub")]
    public class EmergyHub : Hub
    {
        public EmergyHub(IUnitsRepository unitsRepository, IReportsRepository reportsRepository)
        {
            _unitsRepository = unitsRepository;
            _reportsRepository = reportsRepository;
            _userConnections = new ConcurrentDictionary<string, string>();
        }

        public async override Task OnConnected()
        {
            await base.OnConnected();
            var currentUser = await AccountService.GetUserByNameAsync(Context.User.Identity.Name);
            _userConnections.TryAdd(currentUser.Id, Context.ConnectionId);
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
            await base.OnConnected();
            var currentUser = await AccountService.GetUserByNameAsync(Context.User.Identity.Name);
            string connection;
            _userConnections.TryRemove(currentUser.Id, out connection);
            currentUser.Units.ForEach(async (unit) =>
            {
                await Groups.Remove(Context.ConnectionId, unit.Name);
            });
        }

        [Authorize(Roles = "Clients")]
        public async Task PushReport(int unitId, int reportId)
        {
            Unit unit = await _unitsRepository.GetAsync(unitId).ConfigureAwait(false);
            if (unit != null)
            {
                await Clients.OthersInGroup(unit.Name).notifyReportCreated(reportId);
            }
        }

        [Authorize(Roles = "Administrators")]
        public async Task ChangedReportStatus(int unitId, int reportId)
        {
            Unit unit = null;
            Report report = null;
            Parallel.Invoke(new ParallelOptions
            {
                TaskScheduler = TaskScheduler.Default,
                CancellationToken = CancellationToken.None
            }, async () =>
            {
                unit = await _unitsRepository.GetAsync(unitId).ConfigureAwait(false);
            }, async () =>
            {
                report = await _reportsRepository.GetAsync(reportId).ConfigureAwait(false);
            });

            if (unit != null && report != null)
            {
                string creatorConnection;
                _userConnections.TryGetValue(report.CreatorId, out creatorConnection);
                if (!string.IsNullOrEmpty(creatorConnection))
                {
                    await Clients.Client(creatorConnection).notifyReportStatusChanged(reportId);
                }
            }
        }

        private readonly ConcurrentDictionary<string, string> _userConnections;

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
        private readonly IUnitsRepository _unitsRepository;
        private readonly IReportsRepository _reportsRepository;

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            AccountService.Dispose();
            _unitsRepository.Dispose();
            _reportsRepository.Dispose();
        }
    }
}