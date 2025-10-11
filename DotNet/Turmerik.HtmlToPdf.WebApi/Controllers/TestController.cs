using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Turmerik.Core.Utility;

namespace Turmerik.HtmlToPdf.WebApi.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class TestController : BaseController
    {
        public TestController(ILogger<HtmlToPdfController> logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("[action]")]
        public Task<IActionResult> TestError() => ExecuteCoreAsync(async () =>
        {
            throw new TrmrkException<HttpStatusCode>("This is a test error", HttpStatusCode.BadRequest);
        });
    }
}
