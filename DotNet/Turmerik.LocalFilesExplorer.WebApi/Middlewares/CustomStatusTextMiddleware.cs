using System.Net;

namespace Turmerik.LocalFilesExplorer.WebApi.Middlewares
{
    public class CustomStatusTextMiddleware
    {
        private readonly RequestDelegate _next;

        public CustomStatusTextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            await _next(context);

            if (context.Response.StatusCode == (int)HttpStatusCode.BadRequest)
            {
                context.Response.Headers["Trmrk-Status-Reason"] = "Your custom status text";
            }
        }
    }
}
