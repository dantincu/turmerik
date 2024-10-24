using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Newtonsoft.Json.Serialization;
using System.Text.Json.Serialization;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;
using Turmerik.LocalFilesExplorerAnonymous.WebApi.Helpers;
using Turmerik.LocalFilesExplorerAnonymous.WebApi.Middlewares;
using Turmerik.LocalFilesExplorerAnonymous.WebApi.ModelBinders;

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
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
}).AddJsonOptions(jsonOptions =>
{
    jsonOptions.JsonSerializerOptions.PropertyNamingPolicy = null;
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseMiddleware<ExposeHeadersMiddleware>();

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
