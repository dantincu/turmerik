using Microsoft.AspNetCore.Mvc;
using System.Net;
using Turmerik.Core.Utility;
using Turmerik.HtmlToPdf.WebApi.Services;

namespace Turmerik.HtmlToPdf.WebApi.Controllers
{
    public class BaseController : ControllerBase
    {
        private readonly ILogger<HtmlToPdfController> logger;

        public BaseController(
            ILogger<HtmlToPdfController> logger)
        {
            this.logger = logger ?? throw new ArgumentNullException(
                nameof(logger));
        }

        protected async Task<IActionResult> ExecuteCoreAsync(
            Func<Task<IActionResult>> action)
        {
            try
            {
                return (await action());
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        protected IActionResult HandleException(
            Exception exc)
        {
            this.LogError(exc);

            if (exc is TrmrkException<HttpStatusCode> trmrkExc)
            {
                return StatusCode((int)trmrkExc.AdditionalData, trmrkExc.AdditionalData switch
                {
                    HttpStatusCode.TooManyRequests => new
                    {
                        Message = "Cannot generate multiple pdfs at the same time."
                    },
                    HttpStatusCode.InternalServerError => new
                    {
                        Message = "An internal server error occurred while generating the PDF."
                    },
                    _ => null
                });
            }
            else
            {
                return StatusCode(500);
            }
        }

        protected void LogError(Exception exc)
        {
            var message = this.GetErrorLogMessage(exc);
            logger.LogError(exc, message);
        }

        protected string GetErrorLogMessage(Exception exc)
        {
            var msgParts = new List<string>()
            {
                $"ERROR: {exc.Message};"
            };

            if (exc is TrmrkException<HttpStatusCode> trmrkExc)
            {
                msgParts.Add($"STATUS CODE: {trmrkExc.AdditionalData}");
            }

            var message = string.Join(" ", msgParts);
            return message;
        }
    }
}
