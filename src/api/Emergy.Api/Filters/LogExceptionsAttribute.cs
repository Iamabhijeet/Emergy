using System;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Filters;
using Emergy.Core.Common;
using Emergy.Core.Models.Log;
using Emergy.Core.Services;

namespace Emergy.Api.Filters
{
    public sealed class LogExceptionsAttribute : ExceptionFilterAttribute
    {
        public LogExceptionsAttribute()
        {
            _service = new LoggingService(new Core.Services.EmailService(), 
                HttpContext.Current.Server.MapPath("~/Logs/logs.json"));
        }
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            var log = new ExceptionLog
            {
                Exception = actionExecutedContext.Exception,
                ExceptionDate = DateTime.Now
            };
            _service.LogException(log);
            _service.SendLogMail(log).RunSynchronously();
        }
        public async override Task OnExceptionAsync(HttpActionExecutedContext actionExecutedContext, CancellationToken cancellationToken)
        {
            var log = new ExceptionLog
            {
                Exception = actionExecutedContext.Exception,
                ExceptionDate = DateTime.Now
            };
            _service.LogException(log);
            await SendMail(log).WithoutSync();
        }
        private async Task SendMail(ExceptionLog log)
        {
            await _service.SendLogMail(log).WithoutSync();
        }
        private readonly LoggingService _service;
    }
}
