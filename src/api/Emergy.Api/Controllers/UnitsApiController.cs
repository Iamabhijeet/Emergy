using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Models.CustomProperty;
using Emergy.Core.Models.Location;
using Emergy.Core.Repositories;
using Emergy.Core.Services;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

using model = Emergy.Core.Models.Unit;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Units")]
    [Authorize(Roles = "Administrators")]
    public class UnitsApiController : MasterApiController
    {
        public UnitsApiController()
        {
            
        }
        public UnitsApiController(IUnitsRepository unitsRepository)
        {
            _unitsRepository = unitsRepository;
        }

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> GetUnits()
        {
            var units = await _unitsRepository.GetAsync(await AccountService.GetUserByIdAsync(User.Identity.GetUserId()));
            return Ok(units);
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

        [HttpPost]
        [Route("create")]
        public async Task<IHttpActionResult> CreateUnit([FromBody] model::CreateUnitViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            _unitsRepository.Insert(Mapper.Map<Unit>(model));
            await _unitsRepository.SaveAsync();
            return Ok(model);
        }

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
        [HttpDelete]
        [Route("custom-property/remove/{id}")]
        public async Task<IHttpActionResult> RemoveCustomProperty([FromUri]int id, [FromBody] int propertyId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                await _unitsRepository.RemoveCustomProperty(id, propertyId);
                return Ok();
            }
            return Unauthorized();
        }

        [HttpGet]
        [Route("locations/get/{id}")]
        public async Task<IHttpActionResult> GetLocations(int id)
        {
            var unit = await _unitsRepository.GetAsync(id);
            if (unit != null)
            {
                if (await _unitsRepository.IsAdministrator(unit.Id, User.Identity.GetUserId()))
                {
                    return Ok(unit.Locations);
                }
                return Unauthorized();
            }
            return NotFound();
        }
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

        [HttpDelete]
        [Route("locations/remove/{id}")]
        public async Task<IHttpActionResult> RemoveLocation([FromUri]int id, [FromBody] int locationId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                await _unitsRepository.RemoveLocation(id, locationId);
                return Ok();
            }
            return Unauthorized();
        }

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
        [HttpPost]
        [Route("clients/remove/{id}")]
        public async Task<IHttpActionResult> RemoveClient([FromUri]int id, [FromBody] string clientId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                await _unitsRepository.RemoveClient(id, clientId);
                return Ok();
            }
            return Unauthorized();
        }

        [HttpGet]
        [Route("categories/get/{id}")]
        public async Task<IHttpActionResult> GetCategories(int id)
        {
            var unit = await _unitsRepository.GetAsync(id);
            if (unit != null)
            {
                if (await _unitsRepository.IsAdministrator(unit.Id, User.Identity.GetUserId()))
                {
                    return Ok(unit.Locations);
                }
                return Unauthorized();
            }
            return NotFound();
        }

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

        [HttpPost]
        [Route("categories/remove/{id}")]
        public async Task<IHttpActionResult> RemoveCategory([FromUri]int id, [FromBody] int categoryId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                await _unitsRepository.RemoveCategory(id, categoryId);
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
