using System.Threading.Tasks;
using Emergy.Api.Hubs.Mappings;
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic;
using Emergy.Core.Services;
using Emergy.Data.Context;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using static Emergy.Core.Common.IEnumerableExtensions;
namespace Emergy.Api.Hubs
{
    [HubName("emergyHub")]
    [Authorize]
    public class EmergyHub : Hub
    {
        public EmergyHub(IUnitsRepository unitsRepository,
            IReportsRepository reportsRepository,
            IRepository<Notification> notificationsRepository,
            IRepository<Message> messagesRepository,
            IRepository<Location> locationsRepository)
        {
            _unitsRepository = unitsRepository;
            _reportsRepository = reportsRepository;
            _notificationsRepository = notificationsRepository;
            _messagesRepository = messagesRepository;
            _locationsRepository = locationsRepository;
        }

        public override Task OnConnected()
        {
            var currentUser = AccountService.GetUserByIdAsync(Context.User.Identity.GetUserId()).Result;
            Connections.Add(currentUser.Id, Context.ConnectionId);
            currentUser.Units.ForEach(async (unit) =>
            {
                await Groups.Add(Context.ConnectionId, unit.Name);
            });
            return base.OnConnected();
        }
        public override Task OnReconnected()
        {
            OnConnected();
            return base.OnReconnected();
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            var currentUser = AccountService.GetUserByIdAsync(Context.User.Identity.GetUserId()).Result;
            Connections.Remove(currentUser.Id, Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }

        [HubMethodName("updateUserLocation")]
        public async Task UpdateUserLocation(int locationId, int reportId)
        {
            Location location = await _locationsRepository.GetAsync(locationId);
            if (location != null)
            {
                Report report = await _reportsRepository.GetAsync(reportId);
                if (report != null)
                {
                    var creatorConnections = Connections.GetConnections(report.CreatorId);
                    creatorConnections.ForEach(async (connection) =>
                    {
                        await Clients.Client(connection).updateUserLocation(locationId);
                    });
                }
            }
        }

        [HubMethodName("sendNotification")]
        public async Task SendNotification(int notificationId)
        {
            Notification notification = await _notificationsRepository.GetAsync(notificationId);
            if (notification != null)
            {
                var targetConnections = Connections.GetConnections(notification.TargetId);
                targetConnections.ForEach(async (connection) =>
                {
                    await Clients.Client(connection).pushNotification(notificationId);
                });
            }
        }

        [HubMethodName("testPush")]
        public void TestPush(string greeting)
        {
            Clients.Caller.testSuccess(greeting);
        }

        private readonly static ConnectionMapping<string> Connections = new ConnectionMapping<string>();

        protected IAccountService AccountService
        {
            get
            {
                var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext()));
                var emailService = new Core.Services.EmailService();
                return new AccountService(userManager, roleManager, emailService);
            }
        }

        private readonly IRepository<Notification> _notificationsRepository;
        private readonly IRepository<Message> _messagesRepository;
        private readonly IUnitsRepository _unitsRepository;
        private readonly IReportsRepository _reportsRepository;
        private readonly IRepository<Location> _locationsRepository;

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            AccountService.Dispose();
            _unitsRepository.Dispose();
            _reportsRepository.Dispose();
            _locationsRepository.Dispose();
        }
    }
}