// See https://aka.ms/new-console-template for more information
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Text;
using Turmerik.Core.Infrastucture;
using Turmerik.FIleExplorer.PrintMacros.ConsoleApp;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

Console.WriteLine("Hello, World!");

var services = new ServiceCollection();
TrmrkCoreServiceCollectionBuilder.RegisterAll(services);

services.AddSingleton<IDriveItemNameMacrosService, DriveItemNameMacrosService>();
services.AddSingleton<IDriveItemMacrosService, DriveItemMacrosService>();

ServiceProviderContainer.Instance.Value.RegisterServices(services);
var svcsProv = ServiceProviderContainer.Instance.Value.Services;

var nameMacrosService = svcsProv.GetRequiredService<IDriveItemNameMacrosService>();
var macrosHcy = nameMacrosService.GetDriveItemNameMacros();

var flatNameMacrosRetriever = new FlatNameMacrosRetriever();
var flatList = flatNameMacrosRetriever.GetFlatMacros(macrosHcy);

string[] lines = flatList.Select(macro => JsonConvert.SerializeObject(macro, new JsonSerializerSettings
{
    Formatting = Formatting.None,
    NullValueHandling = NullValueHandling.Ignore,
})).ToArray();

File.WriteAllLines("nameMacro.json", lines);