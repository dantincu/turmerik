using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PuppeteerSharp;
using System.Net;
using Turmerik.Core.Utility;
using Turmerik.HtmlToPdf.WebApi.Services;

namespace Turmerik.HtmlToPdf.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class HtmlToPdfController : ControllerBase
    {
        private readonly ILogger<HtmlToPdfController> logger;
        private readonly HtmlToPdfService htmlToPdfService;

        public HtmlToPdfController(
            ILogger<HtmlToPdfController> logger,
            HtmlToPdfService htmlToPdfService)
        {
            this.logger = logger ?? throw new ArgumentNullException(
                nameof(logger));

            this.htmlToPdfService = htmlToPdfService ?? throw new ArgumentNullException(
                nameof(htmlToPdfService));
        }

        [HttpPost]
        [Route("[action]")]
        public Task<IActionResult> Generate() => ExecuteCoreAsync(async () =>
        {
            logger.LogDebug("Starting the Generate request");

            using var reader = new StreamReader(Request.Body);
            var html = await reader.ReadToEndAsync();

            logger.LogDebug("Generating the pdf");
            var stream = await htmlToPdfService.GenerateAsync(html);
            logger.LogDebug("Generated the pdf");

            // Ensure stream is at the beginning
            stream.Position = 0;

            // Return as a FileStreamResult
            return File(stream, "application/pdf");
        });

        [HttpPost]
        [Route("[action]")]
        private Task<IActionResult> GenerateFile(
            [FromQuery] string htmlFilePath,
            [FromQuery] string pdfFilePath) => ExecuteCoreAsync(async () =>
            {
                await htmlToPdfService.GenerateFileAsync(
                    htmlFilePath,
                    pdfFilePath);

                return Ok(new { Message = "PDF generated successfully." });
            });

        private async Task<IActionResult> ExecuteCoreAsync(
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

        private IActionResult HandleException(
            Exception exc)
        {
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
    }
}
