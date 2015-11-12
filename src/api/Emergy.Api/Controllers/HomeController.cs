using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Emergy.Api.Models;
using Emergy.Core.Models.Log;
using Emergy.Core.Services;

namespace Emergy.Api.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            PerformanceModel model = new PerformanceModel("Not available!", "Not available!");
            try
            {
                var cpuCounter = new PerformanceCounter
                {
                    CategoryName = "Processor",
                    CounterName = "% Processor Time",
                    InstanceName = "_Total"
                };
                var ramCounter = new PerformanceCounter("Memory", "Available MBytes");

                model = new PerformanceModel(cpuCounter.NextValue() + "%",
                    ramCounter.NextValue() + "MB");

            }
            catch (Exception)
            {
            }


            return View(model);
        }

        [Authorize(Users = "gboduljak,bborovic")]
        public JsonResult Logs()
        {
            _logsService = new JsonService<ExceptionLog>(Server.MapPath("~/Logs/logs.json"));
            return Json(_logsService.GetCollection());
        }

        private JsonService<ExceptionLog> _logsService;
    }
}