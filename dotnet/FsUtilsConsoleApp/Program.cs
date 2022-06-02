// See https://aka.ms/new-console-template for more information
using FsUtilsConsoleApp;

Console.WriteLine("Running FS Utils Console App");
Console.WriteLine();

var parser = new ProgramComponentArgsParser();
var parsedArgs = parser.Parse(args);

var component = new ProgramComponent();
component.Run(parsedArgs);