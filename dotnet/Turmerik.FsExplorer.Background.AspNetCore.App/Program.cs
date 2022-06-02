using Microsoft.AspNetCore.Builder;
using Turmerik.AspNetCore.FsExplorer.Background;
using Turmerik.Core.FsExplorer.Background.AspNetCore;
using Turmerik.Core.Infrastucture;

var builder = WebApplication.CreateBuilder(args);
TrmrkCoreServiceCollectionBuilder.RegisterAll(builder.Services);

builder.Services.AddSingleton<ISingleHubClientInstance, SingleHubClientInstance>();
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<MainHub>($"/{HubsH.MAIN_HUB_ADDRESS}");

app.Run();
