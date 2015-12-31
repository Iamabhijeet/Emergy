using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Repositories;
using Emergy.Data.Models;
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
        public async Task<IEnumerable<Assignment>> GetAssignments()
        {
            var user = await AccountService.GetUserByIdAsync(User.Identity.GetUserId()).WithoutSync();
            return await _assignmentsRepository.GetAssignments(user).WithoutSync();
        }
        [HttpGet]
        [Route("get/{reportId}")]
        public async Task<IEnumerable<Assignment>> GetAssignments([FromUri] int reportId)
        {
            var report = await _reportsRepository.GetAsync(reportId).WithoutSync();
            return await _assignmentsRepository.GetAssignments(report).WithoutSync();
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
