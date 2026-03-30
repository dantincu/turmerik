using Turmerik.AspNetCore.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Dependencies;
using Turmerik.GoogleDriveNotes.WebApi.Dependencies;
using Turmerik.NetCore.Dependencies;
using Turmerik.Notes.Dependencies;

var builder = WebApplication.CreateBuilder(args);

TrmrkCoreServices.RegisterAll(
    builder.Services, false);

TrmrkServices.RegisterAll(
    builder.Services);

TrmrkNoteServices.RegisterAll(
    builder.Services);

TrmrkNetCoreServices.RegisterAll(
    builder.Services);

TrmrkAspNetCoreServices.RegisterAll(
    builder.Services);

AppServices.RegisterAll(
    builder.Services);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
