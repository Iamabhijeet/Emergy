using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Repositories;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;
using Microsoft.AspNet.Identity;
using dto = Emergy.Core.Models.Assignment;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Assignments")]
    [Authorize]
    public class AssignmentsApiController : MasterApiController
    {
        [HttpGet]
        [Route("get")]
        public async Task<dto::AssigmentVm> GetAssignment()
        {
            var user = await AccountService.GetUserByIdAsync(User.Identity.GetUserId()).WithoutSync();
            var assignment = (await _assignmentsRepository.GetAssignments(user).WithoutSync())
                .OrderByDescending(a => a.Timestamp)
                .FirstOrDefault();
            return (assignment != null) ? dto::AssigmentVm.Create(assignment) : null;
        }
        [HttpGet]
        [Route("get/{reportId}")]
        public async Task<IEnumerable<dto::AssigmentVm>> GetAssignments([FromUri] int reportId)
        {
            var report = await _reportsRepository.GetAsync(reportId).WithoutSync();
            return (await _assignmentsRepository.GetAssignments(report).WithoutSync()).Select(dto::AssigmentVm.Create);
        }

        [HttpPost]
        [Route("is-assigned/{userId}")]
        [Authorize(Roles = "Administrators")]
        [ResponseType(typeof(bool))]
        public async Task<IHttpActionResult> IsAssigned([FromUri] string userId)
        {
            var user = await AccountService.GetUserByIdAsync(userId);
            if (user != null && user.AccountType == AccountType.Client)
            {
                return Ok(user.ReceievedAssignments.Any());
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("create")]
        [Authorize(Roles = "Administrators")]
        public async Task<IHttpActionResult> CreateAssignment([FromBody] dto::CreateAssigmentVm vm)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            var assignment = Mapper.Map<Assignment>(vm);
            assignment.AdminId = User.Identity.GetUserId();
            _assignmentsRepository.Insert(assignment);
            await _assignmentsRepository.SaveAsync();
            return Ok(assignment.Id);
        }

        private readonly IReportsRepository _reportsRepository;
        private readonly IAssignmentsRepository _assignmentsRepository;
        public AssignmentsApiController(IAssignmentsRepository assignmentsRepository, IReportsRepository reportsRepository)
        {
            _assignmentsRepository = assignmentsRepository;
            _reportsRepository = reportsRepository;
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _assignmentsRepository.Dispose();
            _reportsRepository.Dispose();
        }
    }
}
