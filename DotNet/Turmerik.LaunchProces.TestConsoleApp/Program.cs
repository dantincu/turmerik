using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using Turmerik.Core.Dependencies;
using Turmerik.NetCore.Dependencies;
using Turmerik.NetCore.Utility;

var services = TrmrkCoreServices.RegisterAll(
    new ServiceCollection());

TrmrkNetCoreServices.RegisterAll(
    services);

var svcProv = services.BuildServiceProvider();

var processLauncher = svcProv.GetService<IProcessLauncher>();
var pwsAdapter = svcProv.GetRequiredService<IPowerShellAdapter>();

var dirName = args.First();
Directory.CreateDirectory(dirName);

var filePath = Path.Combine(dirName, "in.txt");

File.WriteAllText(filePath, "asdfasdf");

/* pwsAdapter.Invoke(new PowerShellAdapterOpts
{
    Commands = new List<PowerShellCommandOpts>
    {
        new PowerShellCommandOpts
        {
            CommandName = "rmdirfull",
            CommandArguments = [ "\"asdf\"" ]
        }
    }
}); */
var processStartInfo = new ProcessStartInfo
{
    FileName = "npm",
    Arguments = "install",
    WorkingDirectory = @"F:\T\turmerik\ParcelWs-V2\apps\trmrk-notes-blazorapp",
    // RedirectStandardOutput = true,
    // RedirectStandardError = true,
    UseShellExecute = true, // Set this to true
    CreateNoWindow = true
};

using (var process = new Process { StartInfo = processStartInfo })
{
    process.Start();
    // var output = process.StandardOutput.ReadToEnd();
    // var error = process.StandardError.ReadToEnd();
    process.WaitForExit();

    Console.WriteLine("Output:");
    // Console.WriteLine(output);
    Console.WriteLine("Error:");
    // Console.WriteLine(error);
}