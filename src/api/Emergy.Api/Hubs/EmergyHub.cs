using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.Web;
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic;
using Emergy.Core.Services;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using static Emergy.Core.Common.IEnumerableExtensions;
using static Emergy.Core.Common.TaskExtensions;
namespace Emergy.Api.Hubs
{
    [Authorize]
    [HubName("emergyHub")]
    public class EmergyHub : Hub
    {
        public EmergyHub(IUnitsRepository unitsRepository,
            IReportsRepository reportsRepository,
            IRepository<Notification> notificationsRepository,
            IRepository<Message> messagesRepository)
        {
            _unitsRepository = unitsRepository;
            _reportsRepository = reportsRepository;
            _notificationsRepository = notificationsRepository;
            _messagesRepository = messagesRepository;
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
            await base.OnDisconnected(stopCalled);
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
            Unit unit = await _unitsRepository.GetAsync(unitId).WithoutSync();
            if (unit != null)
            {
                await Clients.OthersInGroup(unit.Name).notifyReportCreated(reportId);
            }
        }
        public async Task ChangedReportStatus(int unitId, int reportId)
        {
            var unitTask = _unitsRepository.GetAsync(unitId);
            var reportTask = _reportsRepository.GetAsync(reportId);
            await Task.WhenAll(unitTask, reportTask).WithoutSync();
            var unit = await unitTask;
            var report = await reportTask;
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
        public async Task UpdateUserLocation(int locationId, string userId, int reportId)
        {
            Report report = await _reportsRepository.GetAsync(reportId);
            if (report != null)
            {
                string creatorConnection;
                _userConnections.TryGetValue(report.CreatorId, out creatorConnection);
                if (!string.IsNullOrEmpty(creatorConnection))
                {
                    await Clients.Client(creatorConnection).updateUserLocation(locationId);
                }
            }
        }
        public async Task SendNotification(int notificationId)
        {
            Notification notification = await _notificationsRepository.GetAsync(notificationId);
            if (notification != null)
            {
                string targetConnection;
                _userConnections.TryGetValue(notification.Target.Id, out targetConnection);
                if (!string.IsNullOrEmpty(targetConnection))
                {
                    await Clients.Client(targetConnection).pushNotification(notificationId);
                }
            }
        }
        public async Task SendMessage(int messageId)
        {
            Message message = await _messagesRepository.GetAsync(messageId);
            if (message != null)
            {
                string targetConnection;
                _userConnections.TryGetValue(message.Target.Id, out targetConnection);
                if (!string.IsNullOrEmpty(targetConnection))
                {
                    await Clients.Client(targetConnection).pushMessage(messageId);
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
        private readonly IRepository<Notification> _notificationsRepository;
        private readonly IRepository<Message> _messagesRepository;
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