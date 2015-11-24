using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using Emergy.Core.Common;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;
using System.Linq;
using System.Threading;
using System.Web.Http.Description;
using AutoMapper;
using Emergy.Core.Models.Location;
using Emergy.Core.Repositories;
using Microsoft.AspNet.Identity;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Locations")]
    [Authorize(Roles = "Administrators,Clients")]
    public class LocationsApiController : MasterApiController
    {
        public LocationsApiController(IRepository<Location> locationsRepository,
            IUnitsRepository unitsRepository, IReportsRepository reportsRepository)
        {
            _locationsRepository = locationsRepository;
            _unitsRepository = unitsRepository;
            _reportsRepository = reportsRepository;
        }

        [HttpGet]
        [Authorize(Roles = "Clients")]
        [Route("get-user")]
        public async Task<IEnumerable<Location>> GetLocations()
        {
            return (await AccountService.GetUserByIdAsync(User.Identity.GetUserId()))
                .Locations
                .OrderByDescending(location => location.Timestamp);
        }

        [HttpGet]
        [Authorize(Roles = "Administrators")]
        [Route("get-unit/{id}")]
        public async Task<IHttpActionResult> GetLocations(int id)
        {
            Unit unit = await _unitsRepository.GetAsync(id);
            if (unit != null)
            {
                return Ok(unit.Locations
                   .OrderByDescending(location => location.Timestamp));
            }
            return NotFound();
        }

        [HttpGet]
        [Route("get-report/{id}")]
        public async Task<IHttpActionResult> GetLocationForReport(int id)
        {
            Report report = await _reportsRepository.GetAsync(id);
            if (report != null)
            {
                return Ok(report.Location);
            }
            return NotFound();
        }

        [HttpPost]
        [Route("users/update/{id}")]
        public async Task<IHttpActionResult> UpdateUserLocation(int id)
        {
            ApplicationUser user = null;
            Location location = null;
            Parallel.Invoke(new ParallelOptions
            {
                TaskScheduler = TaskScheduler.Default,
                CancellationToken = CancellationToken.None
            },
                async () =>
                {
                    user = await AccountService.GetUserByIdAsync(User.Identity.GetUserId()).WithoutSync();
                },
                async () =>
                {
                    location = await _locationsRepository.GetAsync(id).WithoutSync();
                });

            if (user != null && location != null)
            {
                await AccountService.UpdateLocation(user, location);
                return Ok();
            }
            return NotFound();
        }

        [HttpPost]
        [Route("create")]
        [ResponseType(typeof(int))]
        public async Task<IHttpActionResult> CreateLocation(CreateLocationViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            var location = Mapper.Map<Location>(model);
            _locationsRepository.Insert(location);
            await _locationsRepository.SaveAsync();
            return Ok(location.Id);
        }

        [HttpPut]
        [Route("edit/{id}")]
        public async Task<IHttpActionResult> CreateLocation([FromUri] int id, [FromBody]EditLocationViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            var location = await _locationsRepository.GetAsync(id).WithoutSync();
            if (location != null)
            {
                location.Latitude = model.Latitude;
                location.Longitude = model.Longitude;
                location.Name = model.Name;
                location.Type = model.Type;
                _locationsRepository.Update(location);
                await _locationsRepository.SaveAsync().Sync();
                return Ok();
            }
            return NotFound();
        }

        private readonly IRepository<Location> _locationsRepository;
        private readonly IUnitsRepository _unitsRepository;
        private readonly IReportsRepository _reportsRepository;
        protected override void Dispose(bool disposing)
        {
            _locationsRepository.Dispose();
            _unitsRepository.Dispose();
            _reportsRepository.Dispose();
            base.Dispose(disposing);
        }
    }
}
