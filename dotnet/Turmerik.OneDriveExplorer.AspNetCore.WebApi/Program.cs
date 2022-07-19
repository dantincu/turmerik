using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Identity.Web;
using Turmerik.AspNetCore.AppConfig;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FsExplorer;
using Turmerik.Core.Infrastucture;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"))
        .EnableTokenAcquisitionToCallDownstreamApi(new string[] { "User.Read" })
            .AddMicrosoftGraph(builder.Configuration.GetSection("MicrosoftGraph"))
            .AddInMemoryTokenCaches();

builder.Services.AddControllersWithViews();
// builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var svcs = TrmrkCoreServiceCollectionBuilder.RegisterAll(builder.Services);

var appSettings = builder.Services.RegisterAppSettings(
    builder.Configuration,
    svcs.TypesStaticDataCache);

builder.Services.AddSingleton<IDriveItemNameMacrosService, DriveItemNameMacrosService>();
builder.Services.AddSingleton<IDriveItemMacrosService, DriveItemMacrosService>();

if (appSettings.UseFsExplorerServiceEngine)
{
    builder.Services.AddScoped<IDriveExplorerServiceEngine, FsExplorerServiceEngine>();
}
else if (appSettings.UseOneDriveExplorerServiceEngine)
{
    throw new NotImplementedException("One Drive Explorer service engine is not yet implemented");
}
else
{
    throw new InvalidOperationException("No drive explorer service engine could be registered");
}

builder.Services.AddScoped<IDriveExplorerService, DriveExplorerService>();
builder.Services.AddScoped<IDriveItemNameMacroFactoryResolver, DriveItemNameMacroFactoryResolver>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "api/mvc/{controller}/{action=Index}/{id?}");

app.Run();


