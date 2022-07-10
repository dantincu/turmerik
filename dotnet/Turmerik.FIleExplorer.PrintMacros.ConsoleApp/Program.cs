// See https://aka.ms/new-console-template for more information
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Text;
using Turmerik.Core.Infrastucture;
using Turmerik.FIleExplorer.PrintMacros.ConsoleApp;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

var services = new ServiceCollection();
TrmrkCoreServiceCollectionBuilder.RegisterAll(services);

services.AddSingleton<IDriveItemNameMacrosService, DriveItemNameMacrosService>();
services.AddSingleton<IDriveItemMacrosService, DriveItemMacrosService>();

ServiceProviderContainer.Instance.Value.RegisterServices(services);
var svcsProv = ServiceProviderContainer.Instance.Value.Services;

var nameMacrosService = svcsProv.GetRequiredService<IDriveItemNameMacrosService>();
var macrosService = svcsProv.GetRequiredService<IDriveItemMacrosService>();

var nameMacrosHcy = nameMacrosService.GetDriveItemNameMacros();
var macrosHcy = macrosService.GetDriveItemMacros();

var flatNameMacrosRetriever = new FlatNameMacrosRetriever();

flatNameMacrosRetriever.WriteFlatNameMacrosToFile(nameMacrosHcy, "nameMacros.json");
flatNameMacrosRetriever.WriteFlatMacrosToFile(macrosHcy, "macros.json");