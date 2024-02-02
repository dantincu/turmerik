using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Turmerik.Notes.BlazorApp;
using Turmerik.Notes.BlazorApp.Dependencies;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
TrmrkNotesBlazorAppServices.RegisterAll(builder.Services);

builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

await builder.Build().RunAsync();
