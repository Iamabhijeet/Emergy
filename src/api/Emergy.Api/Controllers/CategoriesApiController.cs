using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Categories")]
    [Authorize(Roles = "Administrators")]
    public class CategoriesApiController : MasterApiController
    {
        public CategoriesApiController(IRepository<Category> categoriesRepository)
        {
            _categoriesRepository = categoriesRepository;
        }
        [HttpGet]
        [Route("get/{unitId}")]
        public async Task<IHttpActionResult> Get([FromUri]int unitId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            return Ok((await _categoriesRepository.GetAsync())
                .OrderByDescending(c => c.Name));
        }
        [HttpPost]
        [Route("create/{name}")]
        public async Task<IHttpActionResult> Create([FromUri]string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest("Name is required!");
            }
            var category = new Category { Name = name };
            _categoriesRepository.Insert(category);
            await _categoriesRepository.SaveAsync();
            return Ok(category.Id);
        }
        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IHttpActionResult> Delete([FromUri]int id)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            _categoriesRepository.Delete(id);
            await _categoriesRepository.SaveAsync();
            return Ok();
        }
        protected override void Dispose(bool disposing)
        {
            _categoriesRepository.Dispose();
            base.Dispose(disposing);
        }
        private readonly IRepository<Category> _categoriesRepository;
    }
}
