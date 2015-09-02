using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Emergy.Core.Models.CustomProperty;
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
    public class UnitsApiController : ApiController
    {
        public UnitsApiController()
        {
            AccountService.SetUserManager(UserManager);
        }
        public UnitsApiController(ApplicationUserManager userManager, IAccountService accountService)
        {
            UserManager = userManager;
            AccountService = accountService;
            AccountService.SetUserManager(userManager);
        }
        public UnitsApiController(IUnitsRepository unitsRepository)
        {
            _unitsRepository = unitsRepository;
        }

        [HttpGet]
        [Route("get")]
        public async Task<IEnumerable<Unit>> GetUnits()
        {
            return await _unitsRepository.GetAsync(await UserManager.FindByIdAsync(User.Identity.GetUserId()));
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
        public async Task<IHttpActionResult> AddCustomProperty([FromUri]int id, [FromBody] CreateCustomPropertyViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            if (await _unitsRepository.IsAdministrator(id, User.Identity.GetUserId()))
            {
                await _unitsRepository.AddCustomProperty(id, Mapper.Map<CustomProperty>(model));
                return Ok();
            }
            return Unauthorized();
        }
        [HttpPost]
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

        private IHttpActionResult Error()
        {
            return BadRequest(ModelState);
        }
        private IAccountService AccountService
        {
            get
            {
                return _accountService ?? HttpContext.Current.GetOwinContext().Get<IAccountService>();
            }
            set
            {
                _accountService = value;
            }
        }
        private IAccountService _accountService;
        private ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            set
            {
                _userManager = value;
            }
        }
        private ApplicationUserManager _userManager;
        private readonly IUnitsRepository _unitsRepository;
    }
}
