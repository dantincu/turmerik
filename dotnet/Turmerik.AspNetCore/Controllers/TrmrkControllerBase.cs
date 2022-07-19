using Microsoft.AspNetCore.Mvc;
using System.Net;
using Turmerik.Core.Components;

namespace Turmerik.AspNetCore.Controllers
{
    public abstract class TrmrkControllerBase : ControllerBase
    {
        protected async Task<ActionResult> ExecuteAsync<TData>(
            Func<Task<TrmrkActionResult<TData>>> action)
        {
            var result = await action();
            ActionResult actionResult;

            if (result.IsSuccess)
            {
                actionResult = new JsonResult(result.Data);
            }
            else
            {
                var httpStatusCode = result.HttpStatusCode ?? HttpStatusCode.InternalServerError;
                actionResult = StatusCode((int)httpStatusCode);
            }

            return actionResult;
        }
    }
}
