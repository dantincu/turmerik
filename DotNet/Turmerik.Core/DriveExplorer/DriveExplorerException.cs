using System;
using System.Net;
using System.Runtime.Serialization;
using Turmerik.Core.FileManager;

namespace Turmerik.Core.DriveExplorer
{
    public class DriveExplorerException : FileManagerException
    {
        public DriveExplorerException(
            HttpStatusCode? httpStatusCode = null,
            string? httpStatusText = null) : base(httpStatusCode, httpStatusText)
        {
        }

        public DriveExplorerException(
            string? message,
            HttpStatusCode? httpStatusCode = null,
            string? httpStatusText = null) : base(message, httpStatusCode, httpStatusText)
        {
        }

        public DriveExplorerException(
            string? message,
            Exception? innerException,
            HttpStatusCode? httpStatusCode = null,
            string? httpStatusText = null) : base(message, innerException, httpStatusCode, httpStatusText)
        {
        }

        protected DriveExplorerException(
            SerializationInfo info,
            StreamingContext context) : base(
                info,
                context)
        {
        }
    }
}
