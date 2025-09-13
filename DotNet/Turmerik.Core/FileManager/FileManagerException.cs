using System;
using System.Collections.Generic;
using System.Net;
using System.Runtime.Serialization;
using System.Text;

namespace Turmerik.Core.FileManager
{
    public class FileManagerException : Exception
    {
        public FileManagerException(
            HttpStatusCode? httpStatusCode = null,
            string? httpStatusText = null)
        {
            HttpStatusCode = httpStatusCode;
            HttpStatusText = httpStatusText;
        }

        public FileManagerException(
            string? message,
            HttpStatusCode? httpStatusCode = null,
            string? httpStatusText = null) : base(message)
        {
            HttpStatusCode = httpStatusCode;
            HttpStatusText = httpStatusText;
        }

        public FileManagerException(
            string? message,
            Exception? innerException,
            HttpStatusCode? httpStatusCode = null,
            string? httpStatusText = null) : base(message, innerException)
        {
            HttpStatusCode = httpStatusCode;
            HttpStatusText = httpStatusText;
        }

        protected FileManagerException(
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
