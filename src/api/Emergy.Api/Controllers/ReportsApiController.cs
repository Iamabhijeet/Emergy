using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
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
using static Emergy.Core.Common.IEnumerableExtensions;
namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Reports")]
    [Authorize]
    public class ReportsApiController : MasterApiController
    {
        public ReportsApiController() { }
        public ReportsApiController(IReportsRepository reportsRepository,
            IUnitsRepository unitsRepository, IRepository<CustomPropertyValue> valuesRepository,
            IRepository<Resource> resourcesRepository)
        {
            _reportsRepository = reportsRepository;
            _valuesRepository = valuesRepository;
            _resourcesRepository = resourcesRepository;
            _unitsRepository = unitsRepository;
        }
        [Authorize(Roles = "Administrators,Clients")]
        [HttpGet]
        [Route("get/{lastHappened:datetime}")]
        public async Task<IEnumerable<Report>> GetReports([FromUri] DateTime? lastHappened)
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
            Report report = await _reportsRepository.GetAsync(id);
            if (report != null)
            {
                model.ForEach(async (valueId) =>
                {
                    var value = await _valuesRepository.GetAsync(valueId);
                    if (value != null)
                    {
                        report.Details.CustomPropertyValues.Add(value);
                    }
                });
                _reportsRepository.Update(report); await _reportsRepository.SaveAsync(); return Ok();
            }
            return NotFound();
        }
        [HttpPost]
        [Route("set-resources/{id}")]
        public async Task<IHttpActionResult> SetResources(int id, [FromBody]IEnumerable<int> model)
        {
            Report report = await _reportsRepository.GetAsync(id);
            if (report != null)
            {
                model.ForEach(async (resourceId) =>
                {
                    var resource = await _resourcesRepository.GetAsync(resourceId);
                    if (resource != null)
                    { report.Resources.Add(resource); }
                });
                _reportsRepository.Update(report);
                await _reportsRepository.SaveAsync(); return Ok();
            }
            return NotFound();
        }
        [HttpPost]
        [Route("change-status/{id}")]
        public async Task<IHttpActionResult> ChangeStatus(int id, [FromBody] ReportStatus newStatus)
        {
            Report report = await _reportsRepository.GetAsync(id);
            if (report != null)
            {
                report.Status = newStatus;
                _reportsRepository.Update(report);
                await _reportsRepository.SaveAsync(); return Ok();
            }
            return NotFound();
        }
        [Authorize(Roles = "Administrators,Clients")]
        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IHttpActionResult> DeleteReport([FromUri] int id)
        {
            if (!ModelState.IsValid) { return Error(); }
            if (await _reportsRepository.PermissionsGranted(id, User.Identity.GetUserId()))
            {
                _reportsRepository.Delete(id);
                await _reportsRepository.SaveAsync().Sync();
                return Ok();
            }
            return Unauthorized();
        }
        private readonly IReportsRepository _reportsRepository;
        private readonly IUnitsRepository _unitsRepository;
        private readonly IRepository<CustomPropertyValue> _valuesRepository;
        private readonly IRepository<Resource> _resourcesRepository;
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _unitsRepository.Dispose();
            _reportsRepository.Dispose();
            _valuesRepository.Dispose();
            _resourcesRepository.Dispose();
        }
    }
}