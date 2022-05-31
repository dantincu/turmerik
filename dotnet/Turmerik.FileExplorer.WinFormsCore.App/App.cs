using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.FsExplorer.Background.AspNetCore;
using Turmerik.FileExplorer.WinFormsCore.App.Properties;

namespace Turmerik.FileExplorer.WinFormsCore.App
{
    public class App : IAsyncDisposable
    {
        private readonly ILambdaExprHelperFactory lambdaExprHelperFactory;
        private readonly ILambdaExprHelper<IMainHub> mainHubLambdaExprHelper;

        private readonly string tryRegisterSingleInstanceMethodName;
        private readonly string tryUnregisterSingleInstanceMethodName;
        private readonly string tryPingClientMethodName;
        private readonly string tryReceiveClientPingResponseMethodName;

        private volatile int singleInstanceUnregistered;
        private bool singleInstanceRegistered;

        private HubConnection hubConnection;
        private IHubClientIdentifier hubClientIdentifier;

        public App()
        {
            lambdaExprHelperFactory = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<ILambdaExprHelperFactory>();
            mainHubLambdaExprHelper = lambdaExprHelperFactory.GetHelper<IMainHub>();

            tryRegisterSingleInstanceMethodName = mainHubLambdaExprHelper.MethodName(
                hub => hub.TryRegisterSingleInstance());

            tryUnregisterSingleInstanceMethodName = mainHubLambdaExprHelper.MethodName(
                hub => hub.TryUnregisterSingleInstance(null));

            tryPingClientMethodName = mainHubLambdaExprHelper.MethodName(
                hub => hub.TryPingClientAsync());

            tryReceiveClientPingResponseMethodName = mainHubLambdaExprHelper.MethodName(
                hub => hub.TryReceiveClientPingResponse(null));
        }

        public void Run(IProgramArgs args)
        {
            if (args.IsSingleInstance)
            {
                RunAsSingleInstanceAsync(args).Wait();
            }
            else
            {
                RunCore(args);
            }
        }

        private async Task RunAsSingleInstanceAsync(IProgramArgs args)
        {
            string url = string.Join('/',
                Settings.Default.BackgroundAspNetCoreAppBaseUri,
                HubsH.MAIN_HUB_ADDRESS);

            hubConnection = new HubConnectionBuilder()
                .WithUrl(url)
                .Build();

            InitHubConnection(hubConnection);
            await RunAsSingleInstanceCoreAsync(args);

            await UnregisterSingleInstanceAsync();
        }

        private async Task RunAsSingleInstanceCoreAsync(IProgramArgs args)
        {
            var tuple = await hubConnection.InvokeAsync<Tuple<bool, HubClientIdentifierMtbl>>(
                tryRegisterSingleInstanceMethodName);

            if (tuple.Item1)
            {
                hubClientIdentifier = tuple.Item2;
                singleInstanceRegistered = true;

                RunCore(args);
            }
            else
            {

            }
        }

        private void RunCore(IProgramArgs args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            Application.ApplicationExit += Application_ApplicationExit;
            Application.Run(new MainForm());
        }

        private void Application_ApplicationExit(object? sender, EventArgs e)
        {
            UnregisterSingleInstanceAsync();
        }

        private void InitHubConnection(HubConnection connection)
        {
            connection.Closed += async (error) =>
            {
                await Task.Delay(new Random().Next(0, 5) * 1000);
                await connection.StartAsync();
            };

            connection.On<IHubClientIdentifier>(
                tryPingClientMethodName,
                async identifier => await connection.InvokeAsync(
                    tryReceiveClientPingResponseMethodName,
                    hubClientIdentifier));

            connection.StartAsync().Wait();
        }

        public ValueTask DisposeAsync()
        {
            ValueTask valueTask = UnregisterSingleInstanceAsync();
            return valueTask;
        }

        private ValueTask UnregisterSingleInstanceAsync()
        {
            ValueTask valueTask;

            if (Interlocked.CompareExchange(ref singleInstanceUnregistered, 1, 0) == 0)
            {
                valueTask = UnregisterSingleInstanceCoreAsync();
            }
            else
            {
                valueTask = ValueTask.CompletedTask;
            }

            return valueTask;
        }

        private ValueTask UnregisterSingleInstanceCoreAsync()
        {
            ValueTask valueTask;

            if (hubConnection != null)
            {
                hubConnection.InvokeAsync(
                    tryUnregisterSingleInstanceMethodName,
                    hubClientIdentifier).Wait();

                valueTask = hubConnection.DisposeAsync();
            }
            else
            {
                valueTask = ValueTask.CompletedTask;
            }
            
            return valueTask;
        }
    }
}
