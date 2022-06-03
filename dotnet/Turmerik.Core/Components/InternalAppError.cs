using System;
using System.Collections.Generic;
using System.Net;
using System.Runtime.Serialization;
using System.Text;

namespace Turmerik.Core.Components
{
    public class InternalAppError : Exception
    {
        public InternalAppError(HttpStatusCode? httpStatusCode = null)
        {
            HttpStatusCode = httpStatusCode;
        }

        public InternalAppError(
            string message,
            HttpStatusCode? httpStatusCode = null) : base(message)
        {
            HttpStatusCode = httpStatusCode;
        }

        public InternalAppError(
            string message,
            Exception innerException,
            HttpStatusCode? httpStatusCode = null) : base(message, innerException)
        {
            HttpStatusCode = httpStatusCode;
        }

        protected InternalAppError(
            SerializationInfo info,
            StreamingContext context,
            HttpStatusCode? httpStatusCode = null) : base(info, context)
        {
            HttpStatusCode = httpStatusCode;
        }

        public HttpStatusCode? HttpStatusCode { get; }
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
        public TrmrkActionResult(TrmrkActionResult src)
        {
            IsSuccess = src.IsSuccess;
            ErrorViewModel = src.ErrorViewModel;
            HttpStatusCode = src.HttpStatusCode;
        }

        public TrmrkActionResult(
            bool isSuccess,
            ErrorViewModel errorViewModel = null,
            HttpStatusCode? httpStatusCode = null)
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
        public TrmrkActionResult(TrmrkActionResult<TData> src) : base(src)
        {
            Data = src.Data;
        }

        public TrmrkActionResult(TrmrkActionResult src, TData data) : base(src)
        {
            Data = data;
        }

        public TrmrkActionResult(
            bool isSuccess,
            TData data,
            ErrorViewModel errorViewModel = null,
            HttpStatusCode? httpStatusCode = null) : base(
                isSuccess,
                errorViewModel,
                httpStatusCode)
        {
            Data = data;
        }

        public TData Data { get; }
    }
}
