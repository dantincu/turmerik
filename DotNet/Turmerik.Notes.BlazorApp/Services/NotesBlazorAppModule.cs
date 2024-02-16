
using Microsoft.JSInterop;
using Turmerik.Core.Threading;

namespace Turmerik.Notes.BlazorApp.Services
{
    public class NotesBlazorModuleFactory
    {
        private readonly IJSRuntime js;

        public NotesBlazorModuleFactory(
            IJSRuntime js)
        {
            this.js = js ?? throw new ArgumentNullException(nameof(js));
        }

        public NotesBlazorAppModule AppModule(
            INotesBlazorAppConfig appConfig) => new NotesBlazorAppModule(
                js, appConfig);
    }

    public class NotesBlazorAppModule : IAsyncDisposable
    {
        private IJSObjectReference? module;
        private ValueTask<IJSObjectReference>? moduleTask;

        public NotesBlazorAppModule(
            IJSRuntime js,
            INotesBlazorAppConfig appConfig)
        {
            JS = js ?? throw new ArgumentNullException(nameof(js));

            AppConfig = appConfig ?? throw new ArgumentNullException(
                nameof(appConfig));
        }

        public IJSRuntime JS { get; }
        public INotesBlazorAppConfig AppConfig { get; }

        public async ValueTask DisposeAsync()
        {
            if (moduleTask.HasValue)
            {
                await moduleTask.Value.Result.DisposeAsync();
            }
        }

        public async Task<IJSObjectReference> GetAppModule()
        {
            if (module == null)
            {
                moduleTask ??= JS.InvokeAsync<IJSObjectReference>("import", AppConfig.JsFilePath);
                module = await moduleTask.Value;
            }

            return module!;
        }
    }
}
