using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using WebGrease.Css.Extensions;
using vm = Emergy.Core.Models.Message;
using model = Emergy.Data.Models;


namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Messages")]
    [Authorize]
    public class MessagesController : MasterApiController
    {
        public MessagesController(IRepository<Message> messagesRepository,
            IRepository<Resource> resourcesRepository)
        {
            _messagesRepository = messagesRepository;
            _resourcesRepository = resourcesRepository;
        }

        [HttpGet]
        [Route("get-latest")]
        [ResponseType(typeof(IEnumerable<Message>))]
        public async Task<IHttpActionResult> GetLatest()
        {
            return Ok((await _messagesRepository
                .GetAsync(m => m.Target.Id == User.Identity.GetUserId() ||
                               m.Sender.Id == User.Identity.GetUserId(), null, ConstRelations.LoadAllMessageRelations))
                .OrderByDescending(m => m.Timestamp)
                .Take(50)
                .ToArray());
        }

        [HttpGet]
        [Route("search")]
        [ResponseType(typeof(IEnumerable<Message>))]
        public async Task<IHttpActionResult> SearchByTerm(string searchTerm = null)
        {
            if (!string.IsNullOrEmpty(searchTerm))
            {
                return Ok((await _messagesRepository
                .GetAsync(m => (m.Target.Id == User.Identity.GetUserId() ||
                               m.Sender.Id == User.Identity.GetUserId()) &&
                               m.Content.Contains(searchTerm) ||
                               m.Target.UserName.Contains(searchTerm) ||
                               m.Target.Name.Contains(searchTerm) ||
                               m.Target.Surname.Contains(searchTerm),
                               null, ConstRelations.LoadAllMessageRelations))
              .OrderByDescending(m => m.Timestamp)
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
            var targetTask = AccountService.GetUserByIdAsync(model.TargetId);
            await Task.WhenAll(senderTask,targetTask).WithoutSync();
            var sender = await senderTask.WithoutSync();
            var target = await targetTask.WithoutSync();
            if (sender != null && target != null)
            {
                message.Sender = sender;
                message.Target = target;
                ListExtensions.ForEach(model.Multimedia, async (resourceId) =>
                {
                    var resource = await _resourcesRepository.GetAsync(resourceId);
                    if (resource != null)
                    {
                        message.Multimedia.Add(resource);
                    }
                });
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
