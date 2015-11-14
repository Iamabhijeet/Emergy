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
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using model = Emergy.Core.Models.CustomProperty;
namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Custom-Props")]
    [Authorize]
    public class CustomPropertiesApiController : MasterApiController
    {
        public CustomPropertiesApiController(IRepository<CustomProperty> propsRepo,
            IRepository<CustomPropertyValue> valuesRepo, IUnitsRepository unitsRepo)
        {
            _propertiesRepository = propsRepo;
            _valuesRepository = valuesRepo;
            _unitsRepository = unitsRepo;
        }

        [HttpPost]
        [Route("create")]
        [ResponseType(typeof(int))]
        public async Task<IHttpActionResult> CreateProperty(model::CreateCustomPropertyViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            var property = Mapper.Map<CustomProperty>(model);
            var unit = await _unitsRepository.GetAsync(model.UnitId);
            if (unit != null && unit.AdministratorId == User.Identity.GetUserId())
            {
                _propertiesRepository.Insert(property);
                await _propertiesRepository.SaveAsync();
                return Ok(property.Id);
            }
            return BadRequest();
        }
        [HttpPost]
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
        private readonly IUnitsRepository _unitsRepository;
        protected override void Dispose(bool disposing)
        {
            _propertiesRepository.Dispose();
            _valuesRepository.Dispose();
            base.Dispose(disposing);
        }
    }
}
