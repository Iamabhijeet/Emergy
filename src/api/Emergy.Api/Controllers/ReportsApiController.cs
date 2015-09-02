using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Emergy.Core.Repositories;
using Emergy.Core.Services;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity.Owin;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Units")]
    [Authorize(Roles = "Administrators,Clients")]
    public class ReportsApiController : ApiController
    {
        public ReportsApiController(IAccountService accountService, IReportsRepository reportsRepository)
        {
            AccountService = accountService;
            _reportsRepository = reportsRepository;
        }

        [Authorize(Roles = "Clients")]
        [HttpGet]
        [Route("get")]
        public async Task<IEnumerable<Report>> GetReports()
        {
            return await _reportsRepository.GetAsync(await AccountService.GetUserByNameAsync(User.Identity.Name));
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IHttpActionResult> DeleteUnit([FromUri] int id)
        {
            if (!ModelState.IsValid)
            {
                return Error();
            }
            _reportsRepository.Delete(id);
            await _reportsRepository.SaveAsync();
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
        private readonly IReportsRepository _reportsRepository;
    }
}
