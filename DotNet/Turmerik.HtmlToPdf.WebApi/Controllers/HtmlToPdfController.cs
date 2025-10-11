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
    public class HtmlToPdfController : BaseController
    {
        private readonly ILogger<HtmlToPdfController> logger;
        private readonly HtmlToPdfService htmlToPdfService;

        public HtmlToPdfController(
            ILogger<HtmlToPdfController> logger,
            HtmlToPdfService htmlToPdfService) : base(logger)
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
    }
}
