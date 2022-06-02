using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.FsExplorer.Background.AspNetCore;
using Turmerik.Core.Helpers;

namespace Turmerik.AspNetCore.FsExplorer.Background
{
    public class SingleHubClientInstance : ISingleHubClientInstance, IDisposable
    {
        private readonly object syncRoot;

        private readonly IHubContext<MainHub, IMainHubClient> mainHubContext;

        private volatile bool isRegistered;
        private volatile bool pingRequestSent;
        private volatile bool registeredInstanceResponded;

        private Thread pingWaitThread;
        private HubClientIdentifierMtbl candidateIdentifier;

        public SingleHubClientInstance(
            IHubContext<MainHub, IMainHubClient> mainHubContext)
        {
            syncRoot = new object();
            this.mainHubContext = mainHubContext ?? throw new ArgumentNullException(nameof(mainHubContext));
        }

        public HubClientIdentifierMtbl RegisteredIdentifier { get; private set; }
        public bool IsRegistered => isRegistered;

        public async Task<bool> TryRegisterSingleInstanceAsync(HubClientIdentifierMtbl identifier)
        {
            bool retVal;

            if (IdentifierIsNullOrEmpty(identifier))
            {
                throw new ArgumentNullException(nameof(identifier));
            }

            bool sendPingRequest;

            lock (syncRoot)
            {
                retVal = !isRegistered;
                sendPingRequest = !retVal;

                if (retVal)
                {
                    isRegistered = true;
                    RegisteredIdentifier = identifier;
                }
                else if (!pingRequestSent)
                {
                    candidateIdentifier = identifier;

                    registeredInstanceResponded = false;
                    pingRequestSent = true;
                }
                else
                {
                    sendPingRequest = false;
                }
            }

            if (sendPingRequest)
            {
                pingWaitThread = new Thread(WaitForPingResponse);
                pingWaitThread.Start(identifier);

                await mainHubContext.Clients.All.TryPingClientAsync(identifier);
            }

            return retVal;
        }

        public async Task<bool> TryUnregisterSingleInstanceAsync(HubClientIdentifierMtbl identifier)
        {
            bool retVal;

            lock (syncRoot)
            {
                retVal = isRegistered && this.IdentifiersAreEqual(
                    identifier,
                    this.RegisteredIdentifier);

                if (retVal)
                {
                    isRegistered = false;
                    this.RegisteredIdentifier = default;
                }
            }

            return retVal;
        }

        public async Task<bool> ClientIsRegisteredAsync(HubClientIdentifierMtbl identifier)
        {
            bool retVal;

            lock (syncRoot)
            {
                retVal = isRegistered && this.IdentifiersAreEqual(
                    identifier,
                    this.RegisteredIdentifier);
            }

            return retVal;
        }

        public async Task<Tuple<bool, HubClientIdentifierMtbl>> GetRegisteredIdentifierAsync()
        {
            Tuple<bool, HubClientIdentifierMtbl> retTuple;

            lock (syncRoot)
            {
                if (isRegistered)
                {
                    retTuple = new Tuple<bool, HubClientIdentifierMtbl>(
                        isRegistered, RegisteredIdentifier);
                }
                else
                {
                    retTuple = new Tuple<bool, HubClientIdentifierMtbl>(false, default);
                }
            }

            return retTuple;
        }

        public virtual bool IdentifiersAreEqual(HubClientIdentifierMtbl trgIdnf, HubClientIdentifierMtbl refIdnf)
        {
            bool bothAreNull = trgIdnf == null && refIdnf == null;
            bool noneAreNull = trgIdnf != null && refIdnf != null;

            bool retVal = bothAreNull || noneAreNull;

            if (retVal && noneAreNull)
            {
                retVal = trgIdnf.Uuid == refIdnf.Uuid;
            }

            return retVal;
        }

        public virtual bool IdentifierIsNullOrEmpty(HubClientIdentifierMtbl identifier)
        {
            bool retVal = identifier == null || identifier.Uuid == Guid.Empty;
            retVal = retVal || string.IsNullOrWhiteSpace(identifier?.ConnectionId);

            return retVal;
        }

        public async Task<bool> PingClientRespondedAsync(HubClientIdentifierMtbl identifier)
        {
            bool retVal;

            if (IdentifierIsNullOrEmpty(identifier))
            {
                throw new ArgumentException(nameof(identifier));
            }

            lock (syncRoot)
            {
                retVal = isRegistered && this.IdentifiersAreEqual(
                    identifier,
                    this.RegisteredIdentifier);

                if (retVal)
                {
                    registeredInstanceResponded = true;
                }
            }

            return retVal;
        }

        public void Dispose()
        {
        }

        private void WaitForPingResponse(object identifier)
        {
            var identifierMtbl = (HubClientIdentifierMtbl)identifier;
            var task = WaitForPingResponseAsync(identifierMtbl);

            task.Wait();
            bool singleInstanceAlreadyRegistered = task.Result;

            Task<Tuple<bool, HubClientIdentifierMtbl>> pingTask;
            var registeredIdentifier = RegisteredIdentifier;

            if (!singleInstanceAlreadyRegistered)
            {
                lock (syncRoot)
                {
                    RegisteredIdentifier = candidateIdentifier;
                    registeredIdentifier = candidateIdentifier;
                }
            }

            registeredInstanceResponded = true;
            pingRequestSent = false;
            candidateIdentifier = null;

            pingTask = mainHubContext.Clients.All.TrySendClientPingResponseAsync(
                singleInstanceAlreadyRegistered, registeredIdentifier);

            pingTask.Wait();
        }

        private async Task<bool> WaitForPingResponseAsync(HubClientIdentifierMtbl identifier)
        {
            bool singleInstanceAlreadyRegistered = this.isRegistered;
            bool waitForResponse = !this.registeredInstanceResponded;

            int waitMillis = HubsH.PING_RESPONSE_WAIT_MILLIS;
            int totalWaitMillis = 0;

            int totalWaitMillisAggMax = HubsH.PING_RESPONSE_WAIT_MILLIS_AGG_MAX;

            while (waitForResponse && (
                totalWaitMillis < totalWaitMillisAggMax))
            {
                lock (syncRoot)
                {
                    waitForResponse = !this.registeredInstanceResponded;
                    singleInstanceAlreadyRegistered = this.isRegistered;

                    isRegistered = true;
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
