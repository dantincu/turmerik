using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Turmerik.Core.Components
{
    public class InternalAppError : Exception
    {
        public InternalAppError()
        {
        }

        public InternalAppError(string message) : base(message)
        {
        }

        public InternalAppError(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected InternalAppError(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }

    public class ErrorViewModel
    {
        public ErrorViewModel(
            string message,
            Exception exception,
            bool printExcStackTrace = false)
        {
            Message = message;
            Exception = exception;
            PrintExcStackTrace = printExcStackTrace;
        }

        public string Message { get; }
        public Exception Exception { get; }
        public bool PrintExcStackTrace { get; }
    }
}
