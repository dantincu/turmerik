using System.Net;

namespace Turmerik.LocalFilesExplorerAnonymous.WebApi.Middlewares
{
    public class ExposeHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public ExposeHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Set the headers before invoking the next middleware in the pipeline
            context.Response.OnStarting(() =>
            {
                context.Response.Headers["Access-Control-Expose-Headers"] = new Microsoft.Extensions.Primitives.StringValues(
                    ["Trmrk-Status-Reason"]);

                return Task.CompletedTask;
            });

            await _next(context);
        }
    }
}
