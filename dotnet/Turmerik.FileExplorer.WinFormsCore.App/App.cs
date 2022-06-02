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
        private readonly object syncRoot;

        private readonly ILambdaExprHelperFactory lambdaExprHelperFactory;
        private readonly ILambdaExprHelper<IMainHub> mainHubLambdaExprHelper;
        private readonly ILambdaExprHelper<IMainHubClient> mainHubClientLambdaExprHelper;

        private readonly string tryRegisterSingleInstanceMethodName;
        private readonly string tryUnregisterSingleInstanceMethodName;
        private readonly string tryPingClientMethodName;
        private readonly string tryReceiveClientPingResponseMethodName;
        private readonly string trySendClientPingResponseAsyncMethodName;

        private volatile int singleInstanceUnregistered;
        private volatile int singleInstanceAlreadyRegistered;

        private HubConnection hubConnection;
        private HubClientIdentifierMtbl hubClientIdentifier;

        public App()
        {
            syncRoot = new object();
            singleInstanceAlreadyRegistered = -1;

            lambdaExprHelperFactory = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<ILambdaExprHelperFactory>();

            mainHubLambdaExprHelper = lambdaExprHelperFactory.GetHelper<IMainHub>();
            mainHubClientLambdaExprHelper = lambdaExprHelperFactory.GetHelper<IMainHubClient>();

            tryRegisterSingleInstanceMethodName = mainHubLambdaExprHelper.MethodName(
                hub => hub.TryRegisterSingleInstanceAsync());

            tryUnregisterSingleInstanceMethodName = mainHubLambdaExprHelper.MethodName(
                hub => hub.TryUnregisterSingleInstanceAsync(null));

            tryPingClientMethodName = mainHubClientLambdaExprHelper.MethodName(
                hub => hub.TryPingClientAsync(null));

            tryReceiveClientPingResponseMethodName = mainHubLambdaExprHelper.MethodName(
                hub => hub.TryReceiveClientPingResponseAsync(null));

            trySendClientPingResponseAsyncMethodName = mainHubClientLambdaExprHelper.MethodName(
                hub => hub.TrySendClientPingResponseAsync(false, null));
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

            hubClientIdentifier = tuple.Item2;

            if (tuple.Item1)
            {
                RunCore(args);
            }
            else
            {
                bool singleInstanceAlreadyRegistered = await WaitForClientPingResponse();

                if (!singleInstanceAlreadyRegistered)
                {
                    RunCore(args);
                }
                else
                {
                    await UnregisterSingleInstanceAsync();
                }
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

            connection.On<HubClientIdentifierMtbl>(
                tryPingClientMethodName,
                async identifier =>
                {
                    if (identifier.Uuid == hubClientIdentifier.Uuid)
                    {
                        await connection.InvokeAsync(
                            tryReceiveClientPingResponseMethodName,
                            hubClientIdentifier);
                    }
                });

            connection.On<bool, HubClientIdentifierMtbl>(
                trySendClientPingResponseAsyncMethodName,
                (alreadyRegistered, identifier) =>
                {
                    lock (syncRoot)
                    {
                        if (alreadyRegistered)
                        {
                            singleInstanceAlreadyRegistered = 1;
                        }
                        else
                        {
                            singleInstanceAlreadyRegistered = 0;
                        }
                    }
                });

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

        private async Task<bool> WaitForClientPingResponse()
        {
            bool singleInstanceAlreadyRegistered = this.singleInstanceAlreadyRegistered == 0;
            bool waitForResponse = this.singleInstanceAlreadyRegistered == -1;

            int waitMillis = HubsH.PING_RESPONSE_WAIT_MILLIS;
            int totalWaitMillis = 0;

            int totalWaitMillisAggMax = HubsH.PING_RESPONSE_WAIT_MILLIS_AGG_MAX;

            while (waitForResponse)
            {
                lock (syncRoot)
                {
                    singleInstanceAlreadyRegistered = this.singleInstanceAlreadyRegistered == 0;
                    waitForResponse = this.singleInstanceAlreadyRegistered == -1;
                }

                if (waitForResponse)
                {
                    await Task.Delay(waitMillis);
                    totalWaitMillis += waitMillis;
                }
            }

            return singleInstanceAlreadyRegistered;
        }
    }
}
