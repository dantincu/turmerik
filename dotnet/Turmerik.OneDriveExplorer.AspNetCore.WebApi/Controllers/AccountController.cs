using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApi.Controllers
{
    [Authorize]
    // [ApiController]
    [Route("api/mvc/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly GraphServiceClient _graphServiceClient;

        public AccountController(GraphServiceClient graphServiceClient)
        {
            _graphServiceClient = graphServiceClient;
        }

        [HttpGet]
        public async Task<IActionResult> LoggedIn()
        {
            var user = await _graphServiceClient.Me.Request().GetAsync();
            string username = user.Mail;

            return View((object)username);
        }

        [HttpGet]
        public async Task<string> GetEmail()
        {
            var user = await _graphServiceClient.Me.Request().GetAsync();
            string username = user.Mail;

            return username;
        }
    }
}
