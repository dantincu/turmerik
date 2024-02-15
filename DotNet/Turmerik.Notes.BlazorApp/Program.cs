using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Newtonsoft.Json;
using Turmerik.Notes.BlazorApp;
using Turmerik.Notes.BlazorApp.Dependencies;
using Turmerik.Notes.BlazorApp.Services;
using Turmerik.Notes.Core;

async Task<INotesBlazorAppConfig> GetAppConfig(HttpClient httpClient)
{
    string json = await httpClient.GetStringAsync(
        $"trmrk-notes-config/trmrk-notes-config.{FileCheckSums.TRMRK_NOTES_CONFIG_FILE}.json");

    var notesAppConfig = JsonConvert.DeserializeObject<NotesBlazorAppConfigMtbl>(json)!;

    string jsDirName = notesAppConfig.IsDevEnv ? "dev" : "prod";

    string jsFileNameChecksum = notesAppConfig.IsDevEnv ? FileCheckSums.DEV_JS_FILE : FileCheckSums.PROD_JS_FILE;
    string jsFileName = string.Join(".", "index", jsFileNameChecksum, "js");

    notesAppConfig.JsFilePath = Path.Combine(
        "/js",
        jsDirName,
        // "test.js");
        jsFileName);

    return notesAppConfig;
};

var builder = WebAssemblyHostBuilder.CreateDefault(args);
TrmrkNotesBlazorAppServices.RegisterAll(builder.Services);

var httpClient = new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) };
builder.Services.AddScoped(sp => httpClient);

var notesAppConfig = await GetAppConfig(httpClient);

builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddSingleton(svcProv => notesAppConfig);

builder.Services.AddSingleton(svcProv => svcProv.GetRequiredService<NotesBlazorAppModuleFactory>(
    ).Create(notesAppConfig));

await builder.Build().RunAsync();
