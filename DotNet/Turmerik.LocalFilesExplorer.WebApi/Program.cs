using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.LocalFilesExplorer.WebApi.ModelBinders;
using Turmerik.NetCore.Utility;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
IConfiguration configuration = builder.Configuration;

var allowedClientHosts = configuration.GetCfgValue<string[]>(["Turmerik", "AllowedClientHosts"]);

allowedClientHosts = allowedClientHosts ?? throw new InvalidOperationException(
    string.Join(" ", "Invalid configuration file: the appsettings.{environment}.json file should contain",
    "section Turmerik with property AllowedClientHosts containing an array of allowed client hosts"));

string? allowAnonymousAuthenticationEnvVar = Environment.GetEnvironmentVariable(
    "TURMERIK_ALLOW_ANONYMOUS_AUTH");

bool allowAnonymousAuthentication = allowAnonymousAuthenticationEnvVar == "true";

TrmrkCoreServices.RegisterAll(
    builder.Services, false);

DriveExplorerH.AddFsRetrieverAndExplorer(
    builder.Services, null, false, false, Path.Combine(
        Path.Combine(
            Environment.GetFolderPath(
                Environment.SpecialFolder.ApplicationData),
                "Turmerik", "Temp")));

builder.Services.AddSingleton<IObjectModelValidator, NullValidator>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins(
                allowedClientHosts).AllowAnyHeader(
                ).AllowAnyMethod(
                ).AllowCredentials();
        });

    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(
                allowedClientHosts).AllowAnyHeader(
                ).AllowAnyMethod(
                ).AllowCredentials();
        });
});

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
    });

builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
   .AddNegotiate();

builder.Services.AddAuthorization(options =>
{
    // By default, all incoming requests will be authorized according to the default policy.
    options.FallbackPolicy = options.DefaultPolicy;
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
