using Microsoft.AspNetCore.Authentication.Negotiate;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;

var builder = WebApplication.CreateBuilder(args);

TrmrkCoreServices.RegisterAll(
    builder.Services, false);

DriveExplorerH.AddFsRetrieverAndExplorer(
    builder.Services, null, true);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
   .AddNegotiate();

builder.Services.AddAuthorization(options =>
{
    // By default, all incoming requests will be authorized according to the default policy.
    options.FallbackPolicy = options.DefaultPolicy;
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
