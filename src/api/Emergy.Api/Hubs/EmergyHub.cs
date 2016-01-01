﻿using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using Emergy.Api.Hubs.Mappings;
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic;
using Emergy.Core.Services;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using static Emergy.Core.Common.IEnumerableExtensions;
using static Emergy.Core.Common.TaskExtensions;
namespace Emergy.Api.Hubs
{
    [HubName("emergyHub")]
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

        public async override Task OnConnected()
        {
            var currentUser = await AccountService.GetUserByIdAsync(Context.User.Identity.GetUserId());
            Connections.Add(currentUser.Id, Context.ConnectionId);
            currentUser.Units.ForEach(async (unit) =>
            {
                await Groups.Add(Context.ConnectionId, unit.Name);
            });
        }
        public async override Task OnReconnected()
        {
            await OnConnected();
        }
        public async override Task OnDisconnected(bool stopCalled)
        {
            await base.OnDisconnected(stopCalled);
            var currentUser = await AccountService.GetUserByIdAsync(Context.User.Identity.GetUserId());
            Connections.Remove(currentUser.Id, Context.ConnectionId);
            currentUser.Units.ForEach(async (unit) =>
            {
                await Groups.Remove(Context.ConnectionId, unit.Name);
            });
        }

        [HubMethodName("pushReport")]
        [Authorize(Roles = "Clients")]
        public async Task PushReport(int unitId, int reportId)
        {
            Unit unit = await _unitsRepository.GetAsync(unitId).WithoutSync();
            if (unit != null)
            {
                await Clients.OthersInGroup(unit.Name).notifyReportCreated(reportId);
            }
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
            Clients.Caller.pushNotification(notification.SenderId);
            if (notification != null)
            {
                var targetConnections = Connections.GetConnections(notification.TargetId);
                targetConnections.ForEach(async (connection) =>
                {
                    await Clients.Client(connection).pushNotification(notificationId);
                });
            }
        }

        [HubMethodName("sendMessage")]
        public async Task SendMessage(int messageId)
        {
            Message message = await _messagesRepository.GetAsync(messageId);
            if (message != null)
            {
                var targetConnections = Connections.GetConnections(message.TargetId);
                targetConnections.ForEach(async (connection) =>
                {
                    await Clients.Client(connection).pushNotification(messageId);
                });
            }
        }

        private readonly static ConnectionMapping<string> Connections = new ConnectionMapping<string>();

        protected IAccountService AccountService
        {
            get
            {
                return _accountService ?? Context.Request.GetHttpContext().GetOwinContext().Get<IAccountService>();
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