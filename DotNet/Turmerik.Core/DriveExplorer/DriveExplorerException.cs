using System;
using System.Net;
using System.Runtime.Serialization;

namespace Turmerik.Core.DriveExplorer
{
    public class DriveExplorerException : Exception
    {
        public DriveExplorerException(
            HttpStatusCode? httpStatusCode = null,
            string? httpStatusText = null)
        {
            HttpStatusCode = httpStatusCode;
            HttpStatusText = httpStatusText;
        }

        public DriveExplorerException(
            string? message,
            HttpStatusCode? httpStatusCode = null,
            string? httpStatusText = null) : base(message)
        {
            HttpStatusCode = httpStatusCode;
            HttpStatusText = httpStatusText;
        }

        public DriveExplorerException(
            string? message,
            Exception? innerException,
            HttpStatusCode? httpStatusCode = null,
            string? httpStatusText = null) : base(message, innerException)
        {
            HttpStatusCode = httpStatusCode;
            HttpStatusText = httpStatusText;
        }

        protected DriveExplorerException(
            SerializationInfo info,
            StreamingContext context) : base(
                info,
                context)
        {
        }

        public HttpStatusCode? HttpStatusCode { get; set; }
        public string? HttpStatusText { get; set; }
    }
}
