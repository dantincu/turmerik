using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.LocalFilesExplorer.WebApi.ControllerConventions;
using Turmerik.LocalFilesExplorer.WebApi.Helpers;
using Turmerik.LocalFilesExplorer.WebApi.ModelBinders;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
IConfiguration configuration = builder.Configuration;

AppH.InitSingleton(configuration);

TrmrkCoreServices.RegisterAll(
    builder.Services, false);

DriveExplorerH.AddFsRetrieverAndExplorer(
    builder.Services, null, false, false, Path.Combine(
        Path.Combine(
            Environment.GetFolderPath(
                Environment.SpecialFolder.ApplicationData),
                "Turmerik", "FsExplorerRoot")));

builder.Services.AddSingleton<IObjectModelValidator, NullValidator>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins(
                AppH.Instance.AllowedClientHosts).AllowAnyHeader(
                ).AllowAnyMethod(
                ).AllowCredentials();
        });

    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(
                AppH.Instance.AllowedClientHosts).AllowAnyHeader(
                ).AllowAnyMethod(
                ).AllowCredentials();
        });
});

// Add services to the container.
builder.Services.AddControllers(options =>
    {
        options.Conventions.Add(new TrmrkControllerConvention());
    }).AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
    });

if (!AppH.Instance.AllowAnonymousAuthentication)
{
    builder.Services.AddAuthentication(
        NegotiateDefaults.AuthenticationScheme).AddNegotiate();

    builder.Services.AddAuthorization(options =>
    {
        // By default, all incoming requests will be authorized according to the default policy.
        options.FallbackPolicy = options.DefaultPolicy;
    });
}

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
