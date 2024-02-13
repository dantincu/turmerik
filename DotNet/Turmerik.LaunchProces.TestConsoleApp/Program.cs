using Microsoft.Extensions.DependencyInjection;
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

pwsAdapter.Invoke(new PowerShellAdapterOpts
{
    Commands = new List<PowerShellCommandOpts>
    {
        new PowerShellCommandOpts
        {
            CommandName = "rmdirfull",
            CommandArguments = [ "\"asdf\"" ]
        }
    }
});

/* await processLauncher.Launch(
    Environment.CurrentDirectory,
    "powershell.exe",
    // ["-ExecutionPolicy", "Bypass", "-File", "rmdirfull1", dirName],
    // [ "-Command", $"& rmdirfull \"{dirName}\"" ],
    // [ "-Command", $"if (Test-Path -Path (\"{dirName}\\\") -PathType Container) {{ Remove-Item \"{dirName}\\*\" -Recurse -Force; Remove-Item \"{dirName}\\*\"; \"removed\" | Out-File -FilePath \"out.txt\"\" }} else {{ \"not removed\" | Out-File -FilePath \"out.txt\" }}" ],
    ["-Command", $"if (Test-Path -Path (\"{dirName}\\\") -PathType Container) {{ \"removed\" | Out-File -FilePath \"out.txt\"\" }} else {{ \"not removed\" | Out-File -FilePath \"out.txt\" }}"],
    // ["-Command", $"\"removing\" | Out-File -FilePath \"out.txt\""],
    startInfo =>
    {

    });*/