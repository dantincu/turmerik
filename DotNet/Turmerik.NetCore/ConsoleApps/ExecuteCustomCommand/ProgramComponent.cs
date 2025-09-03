using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Services.Description;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.NetCore.ConsoleApps.ExecuteCustomCommand.Executors;

namespace Turmerik.NetCore.ConsoleApps.ExecuteCustomCommand
{
    public class ProgramComponent
    {
        public const string CFG_FILE_NAME = "trmrk-custom-commands-config.json";
        public const string EXECUTOR_NAME_SUFFIX = "CommandExecutor";

        public static readonly string ExecutorNamespace = typeof(QuitCommandExecutor).Namespace!;
        public static readonly Type ExecutorInterfaceType = typeof(ICustomCommandExecutor);

        public static readonly ReadOnlyCollection<Type> ExecutorTypes = Assembly.GetExecutingAssembly(
            ).GetTypes().Where(ExecutorInterfaceType.IsAssignableFrom).RdnlC();

        private readonly IServiceProvider svcProv;
        private readonly IJsonConversion jsonConversion;
        private readonly ProgramConfig programConfig;

        public ProgramComponent(
            IServiceProvider svcProv,
            IJsonConversion jsonConversion)
        {
            this.svcProv = svcProv ?? throw new ArgumentNullException(nameof(svcProv));
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));

            programConfig = jsonConversion.Adapter.Deserialize<ProgramConfig>(
                File.ReadAllText(Path.Combine(ProgramH.ExecutingAssemmblyPath, CFG_FILE_NAME)));

            foreach (var executor in programConfig.Commands)
            {
                executor.RegexObj = new(executor.Regex);
            }
        }

        public async Task RunAsync(string[] args)
        {
            if (args.Length == 0)
            {
                bool exit = false;

                while (!exit)
                {
                    PrintMessage("Type a custom command");
                    string command = Console.ReadLine();
                    Console.WriteLine();

                    var executor = GetCommandExecutor(command);

                    if (executor != null)
                    {
                        string executorName = executor.GetType().Name;
                        PrintMessage($"Executing: {executorName}");
                        exit = await executor.ExecuteAsync(command);
                        PrintMessage($"Executed: {executorName}");
                    }
                    else
                    {
                        PrintMessage("The provided command does not match any executor", ConsoleColor.Red);
                    }

                    if (exit)
                    {
                        PrintMessage("Exiting the program");
                    }
                }
            }
            else
            {
                string command = args[0];
                var executor = GetCommandExecutor(command);

                string executorName = executor.GetType().Name;
                PrintMessage($"Executing: {executorName}");
                await executor.ExecuteAsync(command);
                PrintMessage($"Executed: {executorName}");
            }
        }

        private ICustomCommandExecutor? GetCommandExecutor(string command)
        {
            ICustomCommandExecutor? executorObj = null;

            var executor = programConfig.Commands.FirstOrDefault(
                exec => exec.RegexObj.IsMatch(command));

            if (executor != null)
            {
                string executorFullName = string.Concat(
                    ExecutorNamespace,
                    ".",
                    executor.ExecutorName,
                    EXECUTOR_NAME_SUFFIX);

                var executorType = ExecutorTypes.FirstOrDefault(
                    type => type.FullName == executorFullName);

                if (executorType != null)
                {
                    executorObj = svcProv.GetRequiredService(executorType) as ICustomCommandExecutor;
                }
            }

            return executorObj;
        }

        private void PrintMessage(
            string message,
            ConsoleColor foregroundColor = ConsoleColor.DarkYellow)
        {
            Console.ForegroundColor = foregroundColor;
            Console.WriteLine(message);
            Console.ResetColor();
            Console.WriteLine();
        }
    }
}
