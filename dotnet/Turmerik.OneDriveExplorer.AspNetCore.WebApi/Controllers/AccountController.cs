using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApi.Controllers
{
    /* [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly GraphServiceClient _graphServiceClient;

        public AccountController(GraphServiceClient graphServiceClient)
        {
            _graphServiceClient = graphServiceClient;
        }

        public async Task<IActionResult> LoggedIn()
        {
            var user = await _graphServiceClient.Me.Request().GetAsync();
            string username = user.UserPrincipalName;

            return View((object)username);
        }

        [HttpGet]
        public async Task<string> GetUserName()
        {
            var user = await _graphServiceClient.Me.Request().GetAsync();
            string username = user.UserPrincipalName;

            return username;
        }
    } */
}
