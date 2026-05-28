using Microsoft.JSInterop;

namespace Turmerik.Utility.BlazorServerApp.Services
{
    public class ClipboardService
    {
        private readonly IJSRuntime _js;

        public ClipboardService(IJSRuntime js)
        {
            _js = js;
        }

        public async Task<bool> CopyAsync(string text)
        {
            try
            {
                return await _js.InvokeAsync<bool>("AppInterop.copyToClipboard", text);
            }
            catch
            {
                return false;
            }
        }

        public async Task<string?> ReadAsync()
        {
            try
            {
                return await _js.InvokeAsync<string?>("AppInterop.readFromClipboard");
            }
            catch
            {
                return null;
            }
        }
    }
}
