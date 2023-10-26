using Microsoft.AspNetCore.Authentication.Negotiate;
using Turmerik.AspNetCore.Dependencies;
using Turmerik.Dependencies;
using Turmerik.LocalFileNotes.AspNetCoreApp.Dependencies;
using Turmerik.Notes.AspNetCore.Dependencies;

var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
LocalFileNotesAspNetCoreServices.RegisterAll(builder.Services);

var clientHost = builder.Configuration.GetValue<string>("ClientHost");

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        builder =>
        {
            builder.WithOrigins(
                clientHost).AllowAnyHeader(
                ).AllowAnyMethod(
                ).AllowCredentials();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(
    NegotiateDefaults.AuthenticationScheme)
   .AddNegotiate();

builder.Services.AddAuthorization(options =>
{
    // By default, all incoming requests will be authorized according to the default policy.
    options.FallbackPolicy = options.DefaultPolicy;
});

var app = builder.Build();
https://www.wipo.int/pct-eservices/en/support/cert_import_backup_chrome.html
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(myAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
