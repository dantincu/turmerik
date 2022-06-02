// See https://aka.ms/new-console-template for more information
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Infrastucture;
using Turmerik.JavascriptClassFileGenerator.ConsoleApp;

var services = new ServiceCollection();
TrmrkCoreServiceCollectionBuilder.RegisterAll(services);

services.AddSingleton<ProgramArgsParser>();
services.AddSingleton<JavascriptClassGenerator>();

ServiceProviderContainer.Instance.Value.RegisterServices(services);

var argsParser = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<ProgramArgsParser>();
var programArgs = argsParser.Parse(args);

var component = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<JavascriptClassGenerator>();
string javascriptCode = component.GetJavascriptCode(programArgs);

File.WriteAllText(programArgs.OutputFilePath, javascriptCode);