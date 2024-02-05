
using Microsoft.JSInterop;
using Turmerik.Core.Threading;

namespace Turmerik.Notes.BlazorApp.Services
{
    public class NotesBlazorAppModuleFactory
    {
        private readonly IJSRuntime js;
        private readonly ISynchronizedAdapterFactory synchronizedAdapterFactory;

        public NotesBlazorAppModuleFactory(
            IJSRuntime js,
            ISynchronizedAdapterFactory synchronizedAdapterFactory)
        {
            this.js = js ?? throw new ArgumentNullException(nameof(js));

            this.synchronizedAdapterFactory = synchronizedAdapterFactory ?? throw new ArgumentNullException(
                nameof(synchronizedAdapterFactory));
        }

        public NotesBlazorAppModule Create(
            INotesBlazorAppConfig appConfig) => new NotesBlazorAppModule(
                js, synchronizedAdapterFactory.SempahoreSlim(
                    new SemaphoreSlim(1)), appConfig);
    }

    public class NotesBlazorAppModule
    {
        private readonly ISemaphoreSlimAdapter semaphoreSlimAdapter;

        private IJSObjectReference? module;

        public NotesBlazorAppModule(
            IJSRuntime js,
            ISemaphoreSlimAdapter semaphoreSlimAdapter,
            INotesBlazorAppConfig appConfig)
        {
            JS = js ?? throw new ArgumentNullException(nameof(js));

            this.semaphoreSlimAdapter = semaphoreSlimAdapter ?? throw new ArgumentNullException(
                nameof(semaphoreSlimAdapter));

            AppConfig = appConfig ?? throw new ArgumentNullException(
                nameof(appConfig));
        }

        public IJSRuntime JS { get; }
        public INotesBlazorAppConfig AppConfig { get; }

        public async Task<IJSObjectReference> GetAppModule()
        {
            await semaphoreSlimAdapter.ExecuteAsync(async () =>
            {
                if (module == null)
                {
                    module = await JS.InvokeAsync<IJSObjectReference>("import", AppConfig.JsFilePath);
                }
            });

            return module!;
        }
    }
}
