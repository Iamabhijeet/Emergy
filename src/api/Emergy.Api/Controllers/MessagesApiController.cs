using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Models.Account;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Ninject.Infrastructure.Language;
using WebGrease.Css.Extensions;
using vm = Emergy.Core.Models.Message;
using model = Emergy.Data.Models;


namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Messages")]
    [Authorize]
    public class MessagesApiController : MasterApiController
    {
        public MessagesApiController(IRepository<Message> messagesRepository,
            IRepository<Resource> resourcesRepository)
        {
            _messagesRepository = messagesRepository;
            _resourcesRepository = resourcesRepository;
        }

        [HttpGet]
        [Route("get-latest")]
        [ResponseType(typeof(IEnumerable<vm::MessageVm>))]
        public async Task<IHttpActionResult> GetLatest()
        {
            var userId = User.Identity.GetUserId();
            return Ok((await _messagesRepository
                .GetAsync(m => m.TargetId == userId ||
                               m.TargetId == userId, null, ConstRelations.LoadAllMessageRelations))
                .OrderByDescending(m => m.Timestamp)
                .Take(50)
                .Select(Mapper.Map<vm::MessageVm>)
                .ToArray());
        }

        [HttpGet]
        [Route("get/{id}")]
        [ResponseType(typeof(vm::MessageVm))]
        public async Task<IHttpActionResult> Get([FromUri] int id)
        {
            var message = await _messagesRepository.GetAsync(id);
            if (message != null)
            {
                return Ok(Mapper.Map<vm::MessageVm>(message));
            }
            return NotFound();
        }

        [HttpGet]
        [Route("get-chats/users")]
        [ResponseType(typeof(IEnumerable<UserProfile>))]
        public async Task<IEnumerable<UserProfile>> GetChats()
        {
            var userId = User.Identity.GetUserId();
            var messages = await _messagesRepository
                    .GetAsync(m => m.TargetId == userId ||
                                   m.SenderId == userId, null, ConstRelations.LoadAllMessageRelations);
            var userIds = messages
                           .OrderBy(message => message.Timestamp)
                           .SelectMany(message => new[] { message.TargetId, message.SenderId })
                           .Distinct();
            var mappedUsers = new Collection<UserProfile>();
            foreach (var id in userIds)
            {
                if (id != User.Identity.GetUserId())
                {
                    var userWithId = await UserManager.FindByIdAsync(id);
                    mappedUsers.Add(Mapper.Map<UserProfile>(userWithId));
                }
            }
            return mappedUsers.ToEnumerable();
        }

        [HttpPost]
        [Route("get-chats/messages")]
        [ResponseType(typeof(IEnumerable<vm::MessageVm>))]
        public async Task<IEnumerable<vm::MessageVm>> GetChats([FromBody]string userId)
        {
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            var messages = new Collection<Message>();
            ListExtensions.ForEach(user.ReceievedMessages, (m) => messages.Add(m));
            ListExtensions.ForEach(user.SentMessages, (m) => messages.Add(m));
            var messageIds = messages
                .Where(message => message.SenderId == userId || message.TargetId == userId)
                .OrderBy(message => message.Timestamp)
                .Select(message => message.Id)
                .ToArray();
            messages.Clear();
            foreach (var messageId in messageIds)
            {
                var message = (await _messagesRepository.GetAsync(m => m.Id == messageId, null, ConstRelations.LoadAllMessageRelations)).SingleOrDefault();
                messages.Add(message);
            }
            return messages.Select(Mapper.Map<vm::MessageVm>).ToEnumerable();
        }

        [HttpGet]
        [Route("search")]
        [ResponseType(typeof(IEnumerable<vm::MessageVm>))]
        public async Task<IHttpActionResult> SearchByTerm(string searchTerm = null)
        {
            if (!string.IsNullOrEmpty(searchTerm))
            {
                var currentUserId = User.Identity.GetUserId();
                return Ok((await _messagesRepository
                .GetAsync(m => (m.Target.Id == currentUserId ||
                               m.Sender.Id == currentUserId) &&
                               m.Content.Contains(searchTerm) ||
                               m.Target.UserName.Contains(searchTerm) ||
                               m.Target.Name.Contains(searchTerm) ||
                               m.Target.Surname.Contains(searchTerm),
                               null, ConstRelations.LoadAllMessageRelations))
              .OrderByDescending(m => m.Timestamp)
              .Select(Mapper.Map<vm::MessageVm>)
              .ToArray());
            }
            return await GetLatest();
        }

        [HttpPost]
        [Route("create")]
        [ResponseType(typeof(int))]
        public async Task<IHttpActionResult> Create(vm::CreateMessageVm model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            var message = Mapper.Map<Message>(model);
            var senderTask = AccountService.GetUserByIdAsync(User.Identity.GetUserId());
            var accountService = AccountService.Create();
            var targetTask = accountService.GetUserByIdAsync(model.TargetId);
            await Task.WhenAll(senderTask, targetTask).WithoutSync();
            var sender = await senderTask.WithoutSync();
            var target = await targetTask.WithoutSync();
            if (sender != null && target != null)
            {
                accountService.Dispose();
                message.SenderId = sender.Id;
                message.TargetId = target.Id;
                if (model.Multimedia != null)
                {
                    foreach (var resourceId in model.Multimedia)
                    {
                        var resource = await _resourcesRepository.GetAsync(resourceId);
                        if (resource != null)
                        {
                            message.Multimedia.Add(resource);
                        }
                    }
                }
                _messagesRepository.Insert(message);
                await _messagesRepository.SaveAsync();
                return Ok(message.Id);
            }
            return BadRequest();
        }

        private readonly IRepository<Resource> _resourcesRepository;
        private readonly IRepository<Message> _messagesRepository;
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _messagesRepository.Dispose();
        }
    }
}
