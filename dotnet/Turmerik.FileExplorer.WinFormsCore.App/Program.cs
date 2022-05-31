using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.FsExplorer.Background.AspNetCore;
using Turmerik.Core.Infrastucture;
using Turmerik.FileExplorer.WinFormsCore.App.Properties;
using Turmerik.FileExplorer.WinFormsCore.App;
using Microsoft.AspNetCore.SignalR.Client;
using Turmerik.Core.Components;

namespace Turmerik.FileExplorer.WinFormsCore.App
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            new AppLauncher().Launch(args).Wait();
        }
    }
}
