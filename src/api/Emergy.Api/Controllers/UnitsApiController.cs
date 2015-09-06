using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
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
        public async Task<Unit> GetUnit(int id)
        {
            return await _unitsRepository.GetAsync(id);
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
                _unitsRepository.Update(Mapper.Map<Unit>(model));
                await _unitsRepository.SaveAsync();
                return Ok();
            }
            return Unauthorized();
        }

        [HttpDelete]
        [Route("delete")]
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



        private readonly IUnitsRepository _unitsRepository;
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _unitsRepository.Dispose();
        }
    }
}
