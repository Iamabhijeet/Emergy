using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Linq;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Repositories;
using Emergy.Core.Services;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity.Owin;
using model = Emergy.Core.Models.Unit;
namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Units")]
    [Authorize(Roles = "Administrators")]
    public class UnitsApiController : ApiController
    {
        public UnitsApiController(IAccountService accountService, IUnitsRepository unitsRepository)
        {
            AccountService = accountService;
            _unitsRepository = unitsRepository;
        }

        [HttpGet]
        [Route("get")]
        public async Task<IEnumerable<Unit>> GetUnits()
        {
            return await _unitsRepository.GetUnitsForAdmin(await AccountService.GetUserByNameAsync(User.Identity.Name));
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

        [HttpDelete]
        [Route("delete")]
        public async Task<IHttpActionResult> DeleteUnit([FromUri] int id)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            _unitsRepository.Delete(id);
            await _unitsRepository.SaveAsync();
            return Ok();
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
        private readonly IUnitsRepository _unitsRepository;
    }
}
