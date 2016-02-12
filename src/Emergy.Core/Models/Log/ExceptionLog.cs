using System;

namespace Emergy.Core.Models.Log
{
    [Serializable]
    public class ExceptionLog
    {
        public Exception Exception { get; set; }
        public DateTime ExceptionDate { get; set; }
        public Exception GetCausingException(Exception exception) => exception.InnerException != null ? GetCausingException(exception.InnerException) : exception;
    }
}
