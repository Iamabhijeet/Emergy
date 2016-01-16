﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Emergy.Core.Common;
using Emergy.Core.Models.Stats;
using Emergy.Core.Repositories;
using Emergy.Core.Services;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;

namespace Emergy.Api.Controllers
{
    [RoutePrefix("api/Statistics")]
    [Authorize]
    public class StatisticsApiController : MasterApiController
    {
        [HttpGet]
        [Route("compute")]
        [ResponseType(typeof(StatsViewModel))]
        public async Task<IHttpActionResult> Compute()
        {
            var user = await AccountService.GetUserByIdAsync(User.Identity.GetUserId());
            List<Report> reports = null;
            if (User.IsInRole("Clients"))
            {
                reports = (await ReportsRepository.GetAsync(user))
                .Where(report => report.DateHappened >= DateTime.Now - TimeSpan.FromDays(120))
                .ToList();
            }
            if (User.IsInRole("Administrators"))
            {
                reports = (await ReportsRepository.GetAsync(report => report.Unit.AdministratorId == User.Identity.GetUserId(), null, ConstRelations.LoadAllReportRelations))
                           .Where(report => report.DateHappened <= DateTime.Now - TimeSpan.FromDays(120))
                           .ToList();
            }
            return (reports != null) ? (IHttpActionResult)Ok(StatsService.ComputeStats(reports.AsReadOnly())) : Ok();
        }
        private IStatsService StatsService { get; set; }
        private IReportsRepository ReportsRepository { get; set; }
        private IUnitsRepository UnitsRepository { get; set; }
        public StatisticsApiController(IStatsService statsService,
            IReportsRepository reportsRepository,
            IUnitsRepository unitsRepository)
        {
            StatsService = statsService;
            ReportsRepository = reportsRepository;
            UnitsRepository = unitsRepository;
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            ReportsRepository.Dispose();
        }
    }
}
