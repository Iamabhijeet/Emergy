using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
        [Route("get/{unitId}")]
        public async Task<IHttpActionResult> Get(int unitId)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            return Ok((await _categoriesRepository.GetAsync())
                .OrderByDescending(c => c.Name));
        }

        [Route("create")]
        public async Task<IHttpActionResult> Create(string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                return BadRequest("Name is required!");
            }
            var category = new Category { Name = name };
            _categoriesRepository.Insert(category);
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
