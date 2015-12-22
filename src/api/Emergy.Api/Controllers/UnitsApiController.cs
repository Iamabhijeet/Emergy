using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Repositories;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;

using model = Emergy.Core.Models.Unit;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Units")]
    [Authorize]
    public class UnitsApiController : MasterApiController
    {
        public UnitsApiController()
        {

        }
        public UnitsApiController(IUnitsRepository unitsRepository)
        {
            _unitsRepository = unitsRepository;
        }
        [Authorize(Roles = "Administrators,Clients")]
        [HttpGet]
        [Route("get")]
        public async Task<IEnumerable<Unit>> GetUnits()
        {
            var units = await _unitsRepository.GetAsync(await AccountService.GetUserByIdAsync(User.Identity.GetUserId())).WithoutSync();
            return units;
        }

        [HttpGet]
        [Route("get/{id}")]
        public async Task<IHttpActionResult> GetUnit(int id)
        {
            var unit = await _unitsRepository.GetAsync(id);
            if (unit != null)
            {
                if (await _unitsRepository.IsAdministrator(unit.Id, User.Identity.GetUserId()))
                {
                    return Ok(unit);
                }
                return Unauthorized();
            }
            return NotFound();
        }
        [Authorize(Roles = "Administrators")]
        [HttpPost]
        [Route("create")]
        public async Task<IHttpActionResult> CreateUnit([FromBody] model::CreateUnitViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            var unit = Mapper.Map<Unit>(model);
            unit.AdministratorId = User.Identity.GetUserId();
            _unitsRepository.Insert(unit);
            await _unitsRepository.SaveAsync();
            return Ok(unit.Id);
        }
        [Authorize(Roles = "Administrators")]
        [HttpPut]
        [Route("edit")]
        public async Task<IHttpActionResult> EditUnit([FromBody] model::EditUnitViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(model.Id, User.Identity.GetUserId()))
            {
                var unit = await _unitsRepository.GetAsync(model.Id).WithoutSync();
                if (unit != null)
                {
                    unit.Name = model.Name;
                    _unitsRepository.Update(unit);
                    await _unitsRepository.SaveAsync();
                    return Ok();
                }
                return NotFound();
            }
            return Unauthorized();
        }
        [Authorize(Roles = "Administrators")]
        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IHttpActionResult> DeleteUnit([FromUri] int id)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                _unitsRepository.Delete(id);
                await _unitsRepository.SaveAsync();
                return Ok();
            }
            return Unauthorized();
        }
        [Authorize(Roles = "Administrators")]
        [HttpGet]
        [Route("custom-properties/get/{unitId}")]
        public async Task<IHttpActionResult> GetCustomProperties(int unitId)
        {
            var unit = await _unitsRepository.GetAsync(unitId);
            if (unit != null)
            {
                if (await _unitsRepository.IsAdministrator(unit.Id, User.Identity.GetUserId()))
                {
                    return Ok(unit.CustomProperties);
                }
                return Unauthorized();
            }
            return NotFound();
        }
        [Authorize(Roles = "Administrators")]
        [HttpPost]
        [Route("custom-property/add/{id}")]
        public async Task<IHttpActionResult> AddCustomProperty([FromUri]int id, [FromBody] int propertyId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                await _unitsRepository.AddCustomProperty(id, propertyId);
                return Ok();
            }
            return Unauthorized();
        }
        [Authorize(Roles = "Administrators")]
        [HttpGet]
        [Route("locations/get/{id}")]
        public async Task<IHttpActionResult> GetLocations(int id)
        {
            var unit = await _unitsRepository.GetAsync(id);
            if (unit != null)
            {
                if (await _unitsRepository.IsAdministrator(unit.Id, User.Identity.GetUserId()))
                {
                    return Ok(unit.Locations.OrderByDescending(location => location.Timestamp)
                        .ToArray());
                }
                return Unauthorized();
            }
            return NotFound();
        }
        [Authorize(Roles = "Administrators")]
        [HttpPost]
        [Route("locations/add/{id}")]
        public async Task<IHttpActionResult> AddLocation([FromUri]int id, [FromBody] int locationId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                await _unitsRepository.AddLocation(id, locationId);
                return Ok();
            }
            return Unauthorized();
        }
        [Authorize(Roles = "Administrators")]
        [HttpGet]
        [Route("clients/get/{id}")]
        public async Task<IHttpActionResult> GetClients(int id)
        {
            var unit = await _unitsRepository.GetAsync(id);
            if (unit != null)
            {
                if (await _unitsRepository.IsAdministrator(unit.Id, User.Identity.GetUserId()))
                {
                    return Ok(unit.Clients);
                }
                return Unauthorized();
            }
            return NotFound();
        }
        [Authorize(Roles = "Administrators")]
        [HttpPost]
        [Route("clients/add/{id}")]
        public async Task<IHttpActionResult> AddClient([FromUri]int id, [FromBody] string clientId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                await _unitsRepository.AddClient(id, clientId);
                return Ok();
            }
            return Unauthorized();
        }
        [Authorize(Roles = "Administrators")]
        [HttpPost]
        [Route("clients/remove")]
        public async Task<IHttpActionResult> RemoveClient([FromBody] Core.Models.Delete.ClientFromUnit model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(model.UnitId, User.Identity.GetUserId()))
            {
                await _unitsRepository.RemoveClient(model.UnitId, model.ClientId);
                return Ok();
            }
            return Unauthorized();
        }
        [Authorize(Roles = "Administrators")]
        [HttpGet]
        [Route("categories/get/{id}")]
        public async Task<IHttpActionResult> GetCategories(int id)
        {
            var unit = await _unitsRepository.GetAsync(id);
            if (unit != null)
            {
                if (await _unitsRepository.IsAdministrator(unit.Id, User.Identity.GetUserId()))
                {
                    return Ok(unit.Categories.OrderByDescending(category => category.Id)
                                             .ToArray());
                }
                return Unauthorized();
            }
            return NotFound();
        }
        [Authorize(Roles = "Administrators")]
        [HttpPost]
        [Route("categories/add/{id}")]
        public async Task<IHttpActionResult> AddCategory([FromUri]int id, [FromBody] int categoryId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                await _unitsRepository.AddCategory(id, categoryId);
                return Ok();
            }
            return Unauthorized();
        }

        private readonly IUnitsRepository _unitsRepository;
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _unitsRepository.Dispose();
        }
    }
}
