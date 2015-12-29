﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Repositories.Generic;
using Microsoft.AspNet.Identity;
using db = Emergy.Data.Models;
using vm = Emergy.Core.Models.Notification;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Notifications")]
    [Authorize]
    public class NotificationsApiController : MasterApiController
    {
        public NotificationsApiController(IRepository<db::Notification> notificationsRepository)
        {
            _notificationsRepository = notificationsRepository;
        }

        [HttpGet]
        [Route("get-latest")]
        [ResponseType(typeof(IEnumerable<db.Notification>))]
        public async Task<IEnumerable<db.Notification>> GetLatest()
        {
            return await GetNotifications(null).WithoutSync();
        }

        [HttpGet]
        [Route("get-latest/{lastHappened:datetime}")]
        [ResponseType(typeof(IEnumerable<db.Notification>))]
        public async Task<IEnumerable<db.Notification>> GetLatest([FromUri] DateTime? lastHappened)
        {
            return await GetNotifications(lastHappened).WithoutSync();
        }

        [HttpGet]
        [Route("search")]
        [ResponseType(typeof(IEnumerable<db.Notification>))]
        public async Task<IEnumerable<db.Notification>> SearchByTerm(string searchTerm = null)
        {
            if (!string.IsNullOrEmpty(searchTerm))
            {
                return (await _notificationsRepository
                .GetAsync(m => (m.TargetId == User.Identity.GetUserId() ||
                               m.SenderId == User.Identity.GetUserId()) &&
                               m.Content.Contains(searchTerm) ||
                               m.Target.UserName.Contains(searchTerm) ||
                               m.Target.Name.Contains(searchTerm) ||
                               m.Target.Surname.Contains(searchTerm),
                               null, ConstRelations.LoadAllMessageRelations))
              .OrderByDescending(m => m.Timestamp)
              .ToArray();
            }
            return await GetLatest(null);
        }

        [HttpPost]
        [Route("create")]
        [ResponseType(typeof(int))]
        public async Task<IHttpActionResult> Create(vm::CreateNotificationVm model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            var notification = Mapper.Map<db.Notification>(model);
            var senderTask = AccountService.GetUserByIdAsync(User.Identity.GetUserId());
            var targetTask = AccountService.GetUserByIdAsync(model.TargetId);
            await Task.WhenAll(senderTask, targetTask).WithoutSync();
            var sender = await senderTask.WithoutSync();
            var target = await targetTask.WithoutSync();
            if (sender != null && target != null)
            {
                notification.SenderId = sender.Id;
                notification.TargetId = target.Id;
                _notificationsRepository.Insert(notification);
                await _notificationsRepository.SaveAsync();
                return Ok(notification.Id);
            }
            return BadRequest();
        }

        private async Task<IEnumerable<db::Notification>> GetNotifications(DateTime? lastHappened)
        {
            var notifications = (await _notificationsRepository
                   .GetAsync(null, null, ConstRelations.LoadAllNotificationRelations))
                   .ToArray();
            notifications = notifications.Where(notification => notification.TargetId == User.Identity.GetUserId()).ToArray();
            if (lastHappened == null)
            {
                return notifications
                    .OrderByDescending(notification => notification.Timestamp)
                    .Take(20)
                    .ToArray();
            }
            return notifications
                .AsParallel()
                .Where(notifaction => notifaction.Timestamp > lastHappened.Value)
                .OrderByDescending(notification => notification.Timestamp)
                .Take(20)
                .ToArray();
        }

        private readonly IRepository<db::Notification> _notificationsRepository;
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _notificationsRepository.Dispose();
        }
    }

}
