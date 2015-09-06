using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using Emergy.Core.Models.Report;
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;
using static Emergy.Core.Common.IEnumerableExtensions;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Reports")]
    [Authorize(Roles = "Administrators,Clients")]
    public class ReportsApiController : MasterApiController
    {
        public ReportsApiController(IReportsRepository reportsRepository,
            IRepository<CustomPropertyValue> valuesRepository,
            IRepository<Image> imagesRepository)
        {
            _reportsRepository = reportsRepository;
            _valuesRepository = valuesRepository;
            _imagesRepository = imagesRepository;
        }

        [HttpGet]
        [Route("get")]
        public async Task<IEnumerable<Report>> GetReports()
        {
            return await _reportsRepository.GetAsync(await AccountService.GetUserByNameAsync(User.Identity.Name));
        }

        [HttpPost]
        [Route("create")]
        [Authorize(Roles = "Clients")]
        public async Task<IHttpActionResult> CreateReport([FromBody] CreateReportViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            Report report = Mapper.Map<Report>(model);
            _reportsRepository.Insert(report);
            await _reportsRepository.SaveAsync();
            return Ok(report.Id);
        }

        [HttpGet]
        [Route("get-properties")]
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
                _reportsRepository.Update(report);
                await _reportsRepository.SaveAsync();
                return Ok();
            }
            return NotFound();
        }

        [HttpPost]
        [Route("set-photos/{id}")]
        public async Task<IHttpActionResult> SetPhotos(int id, [FromBody]IEnumerable<int> model)
        {
            Report report = await _reportsRepository.GetAsync(id);
            if (report != null)
            {
                model.ForEach(async (imageId) =>
                {
                    var image = await _imagesRepository.GetAsync(imageId);
                    if (image != null)
                    {
                        report.Photos.Add(image);
                    }
                });
                _reportsRepository.Update(report);
                await _reportsRepository.SaveAsync();
                return Ok();
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
                await _reportsRepository.SaveAsync();
                return Ok();
            }
            return NotFound();
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IHttpActionResult> DeleteReport([FromUri] int id)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            _reportsRepository.Delete(id);
            await _reportsRepository.SaveAsync();
            return Ok();
        }

        private readonly IReportsRepository _reportsRepository;
        private readonly IRepository<CustomPropertyValue> _valuesRepository;
        private readonly IRepository<Image> _imagesRepository;
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _reportsRepository.Dispose();
            _valuesRepository.Dispose();
            _imagesRepository.Dispose();
        }
    }
}
