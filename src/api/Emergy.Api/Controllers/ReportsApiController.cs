using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Models.Report;
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;
using Microsoft.AspNet.Identity;
using dto = Emergy.Core.Models.Report;
namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Reports")]
    [Authorize]
    public class ReportsApiController : MasterApiController
    {
        public ReportsApiController() { }
        public ReportsApiController(IReportsRepository reportsRepository,
            IUnitsRepository unitsRepository, IRepository<CustomPropertyValue> valuesRepository,
            IRepository<Resource> resourcesRepository, IRepository<Notification> notificationsRepository,
            IAssignmentsRepository assignmentsRepository)
        {
            _reportsRepository       = reportsRepository;
            _valuesRepository        = valuesRepository;
            _resourcesRepository     = resourcesRepository;
            _unitsRepository         = unitsRepository;
            _notificationsRepository = notificationsRepository;
            _assignmentsRepository   = assignmentsRepository;
        }
        [Authorize(Roles = "Administrators,Clients")]
        [HttpPost]
        [Route("get")]
        public async Task<IEnumerable<Report>> GetReports([FromBody]DateTime? lastHappened)
        {
            if (User.IsInRole("Administrators"))
            {
                var admin = await AccountService.GetUserByIdAsync(User.Identity.GetUserId());
                return (await _unitsRepository.GetReportsForUser(admin, lastHappened)).ToArray();
            }
            if (User.IsInRole("Clients"))
            {
                var client = await AccountService.GetUserByIdAsync(User.Identity.GetUserId());
                return (await _unitsRepository.GetReportsForUser(client, lastHappened)).ToArray();
            }
            return null;
        }
        [Authorize(Roles = "Administrators,Clients")]
        [HttpGet]
        [Route("get")]
        public async Task<IEnumerable<Report>> GetReports()
        {
            if (User.IsInRole("Administrators"))
            {
                var admin = await AccountService.GetUserByIdAsync(User.Identity.GetUserId());
                return (await _unitsRepository.GetReportsForUser(admin, null)).ToArray();
            }
            if (User.IsInRole("Clients"))
            {
                var client = await AccountService.GetUserByIdAsync(User.Identity.GetUserId());
                return (await _unitsRepository.GetReportsForUser(client, null)).ToArray();
            }
            return null;
        }

        [Authorize]
        [HttpGet]
        [Route("get/{id}")]
        public async Task<dto::ReportDetailsViewModel> GetReport([FromUri] int id)
        {
            var report = await _reportsRepository.GetAsync(id).WithoutSync();
            if (report != null)
            {
                if (await _reportsRepository.PermissionsGranted(id, User.Identity.GetUserId()))
                {
                    return Mapper.Map<dto::ReportDetailsViewModel>(report);
                }
                return null;
            }
            return null;
        }

        [HttpPost]
        [Route("create")]
        [Authorize(Roles = "Clients")]
        [ResponseType(typeof(int))]
        public async Task<IHttpActionResult> CreateReport([FromBody] CreateReportViewModel model)
        {
            if (!ModelState.IsValid) { return Error(); }
            Report report = Mapper.Map<Report>(model);
            if (await _unitsRepository.IsInUnit(model.UnitId, User.Identity.GetUserId()))
            {
                Unit unit = await _unitsRepository.GetAsync(model.UnitId).WithoutSync();
                if (unit != null)
                {
                    report.Status = ReportStatus.Processing;
                    _reportsRepository.Insert(report, User.Identity.GetUserId(), unit);
                    await _reportsRepository.SaveAsync().Sync();
                    return Ok(report.Id);
                }
                return NotFound();
            }
            return Unauthorized();
        }
        [HttpGet]
        [Route("get-properties/{id}")]
        public async Task<IHttpActionResult> GetCustomProperties([FromUri] int id)
        {
            Report report = await _reportsRepository.GetAsync(id);
            if (report != null)
            {
                return Ok(report.Details.CustomPropertyValues);
            }
            return NotFound();
        }
        [HttpPost]
        [Route("set-properties/{id}")]
        public async Task<IHttpActionResult> SetCustomProperties(int id, [FromBody]IEnumerable<int> model)
        {
            await _reportsRepository.SetCustomPropertyValues(id, model);
            return Ok();
        }
        [HttpPost]
        [Route("set-resources/{id}")]
        public async Task<IHttpActionResult> SetResources(int id, [FromBody]IEnumerable<int> model)
        {
            await _reportsRepository.SetResources(id, model);
            return Ok();
        }
        [HttpPost]
        [Route("change-status/{id}")]
        public async Task<IHttpActionResult> ChangeStatus([FromUri]int id, [FromBody] ReportStatus newStatus)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            Report report = await _reportsRepository.GetAsync(id);
            if (report != null)
            {
                report.Status = newStatus;
                _reportsRepository.Update(report);
                await _reportsRepository.SaveAsync();
                if (report.Status == ReportStatus.Completed || report.Status == ReportStatus.Failure)
                {
                    foreach (var assignment in report.Assignments.ToArray())
                    {
                        _assignmentsRepository.Delete(assignment.Id);
                    }
                    report.Assignments.Clear();
                    await _assignmentsRepository.SaveAsync();
                    await _reportsRepository.SaveAsync();
                }
                return Ok();
            }
            return NotFound();
        }
        [Authorize(Roles = "Administrators,Clients")]
        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IHttpActionResult> DeleteReport([FromUri] int id)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            Report report = await _reportsRepository.GetAsync(id);
            if (report != null)
            {
                if (await _reportsRepository.PermissionsGranted(id, User.Identity.GetUserId()))
                {
                    var reportNotifications = await _notificationsRepository.GetAsync(
                        notification => notification.Type == NotificationType.ReportCreated &&
                        notification.ParameterId == id.ToString());
                    _reportsRepository.Delete(report);
                    await _reportsRepository.SaveAsync();
                    foreach (var notification in reportNotifications)
                    {
                        _notificationsRepository.Delete(notification.Id);
                    }
                    await _notificationsRepository.SaveAsync();
                    return Ok();
                }
                return Unauthorized();
            }
            return BadRequest();
        }

        private readonly IReportsRepository               _reportsRepository;
        private readonly IUnitsRepository                 _unitsRepository;
        private readonly IRepository<CustomPropertyValue> _valuesRepository;
        private readonly IRepository<Resource>            _resourcesRepository;
        private readonly IRepository<Notification>        _notificationsRepository;
        private readonly IAssignmentsRepository           _assignmentsRepository;
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _unitsRepository.Dispose();
            _reportsRepository.Dispose();
            _valuesRepository.Dispose();
            _resourcesRepository.Dispose();
            _notificationsRepository.Dispose();
            _assignmentsRepository.Dispose();
        }
    }
}