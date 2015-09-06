using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Emergy.Api.Models;

namespace Emergy.Api.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
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
            catch(Exception)
            {
            }


            return View(model);
        }
    }
}