using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Dependencies;
using Turmerik.Jint.Dependencies;
using Turmerik.Logging;
using Turmerik.Logging.Dependencies;
using Turmerik.NetCore.Dependencies;
using Turmerik.Utility.BlazorServerApp;
using Turmerik.Utility.BlazorServerApp.Services;
using Turmerik.Utility.BlazorServerApp.Services.FetchMultipleLinks;
using Turmerik.Utility.BlazorServerApp.Settings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var services = builder.Services;

TrmrkCoreServices.RegisterAll(services);
TrmrkServices.RegisterAll(services);
TrmrkNetCoreServices.RegisterAll(services);
DriveExplorerH.AddFsRetrieverAndExplorer(services, null, true);
services.AddSingleton<IAppEnv, AppEnv>();
LoggingServices.RegisterAll(services);
services.AddSingleton(sp => sp.GetRequiredService<IAppLoggerCreatorFactory>().Create());
TrmrkJintServices.RegisterAll(services);

services.AddSingleton<IAppDataFactory, AppDataFactory>();
services.AddSingleton<IAppSettings, AppSettings>();
services.AddSingleton<TextTransformBehavior>();
services.AddSingleton<IFetchMultipleLinksDataContainer, FetchMultipleLinksDataContainer>();
services.AddSingleton<FetchMultipleLinksService>();
services.AddScoped<ClipboardService>();
services.AddSingleton<AppNotificationService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
