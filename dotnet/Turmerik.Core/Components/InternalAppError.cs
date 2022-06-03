using System;
using System.Collections.Generic;
using System.Net;
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

    public class TrmrkActionResult
    {
        public TrmrkActionResult(
            bool isSuccess,
            ErrorViewModel errorViewModel,
            HttpStatusCode? httpStatusCode)
        {
            IsSuccess = isSuccess;
            ErrorViewModel = errorViewModel;
            HttpStatusCode = httpStatusCode;
        }

        public bool IsSuccess { get; }
        public ErrorViewModel ErrorViewModel { get; }
        public HttpStatusCode? HttpStatusCode { get; }
    }

    public class TrmrkActionResult<TData> : TrmrkActionResult
    {
        public TrmrkActionResult(
            bool isSuccess,
            TData data,
            ErrorViewModel errorViewModel,
            HttpStatusCode? httpStatusCode) : base(
                isSuccess,
                errorViewModel,
                httpStatusCode)
        {
            Data = data;
        }

        public TData Data { get; }
    }
}
