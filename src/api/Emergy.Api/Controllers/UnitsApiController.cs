using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using Emergy.Core.Repositories;
using Emergy.Data.Models;
using model = Emergy.Core.Models.Unit;
namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Units")]
    [Authorize(Roles = "Administrators")]
    public class UnitsApiController : ApiController
    {
        public UnitsApiController(IUnitsRepository unitsRepository)
        {
            _unitsRepository = unitsRepository;
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
        private readonly IUnitsRepository _unitsRepository;
    }
}
