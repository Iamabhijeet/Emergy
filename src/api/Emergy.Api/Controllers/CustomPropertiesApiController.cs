using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AutoMapper;
using Emergy.Core.Common;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;
using model = Emergy.Core.Models.CustomProperty;
namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Custom-Props")]
    [Authorize]
    public class CustomPropertiesApiController : MasterApiController
    {
        public CustomPropertiesApiController(IRepository<CustomProperty> propsRepo,
            IRepository<CustomPropertyValue> valuesRepo)
        {
            _propertiesRepository = propsRepo;
            _valuesRepository = valuesRepo;
        }

        [HttpGet]
        [Route("create")]
        [ResponseType(typeof(int))]
        public async Task<IHttpActionResult> CreateProperty(model::CreateCustomPropertyViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            var property = Mapper.Map<CustomProperty>(model);
            _propertiesRepository.Insert(property);
            await _propertiesRepository.SaveAsync();
            return Ok(property.Id);
        }
        [HttpGet]
        [Route("add-value")]
        [ResponseType(typeof(int))]
        public async Task<IHttpActionResult> AddValue(model::CreateCustomPropertyValueViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            var property = await _propertiesRepository.GetAsync(model.PropertyId).WithoutSync();
            if (property != null)
            {
                CustomPropertyValue value = Mapper.Map<CustomPropertyValue>(model);
                value.CustomProperty = property;
                _valuesRepository.Insert(value);
                await _valuesRepository.SaveAsync().Sync();
                return Ok(value.Id);
            }
            return NotFound();
        }

        private readonly IRepository<CustomProperty> _propertiesRepository;
        private readonly IRepository<CustomPropertyValue> _valuesRepository;
        protected override void Dispose(bool disposing)
        {
            _propertiesRepository.Dispose();
            _valuesRepository.Dispose();
            base.Dispose(disposing);
        }
    }
}
