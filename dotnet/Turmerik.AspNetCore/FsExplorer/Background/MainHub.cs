using Microsoft.AspNetCore.SignalR;
using Turmerik.Core.FsExplorer.Background.AspNetCore;

namespace Turmerik.AspNetCore.FsExplorer.Background
{
    public class MainHub : Hub<IMainHubClient>, IMainHub
    {
        private readonly ISingleHubClientInstance singleHubClientInstance;

        public MainHub(ISingleHubClientInstance singleHubClientInstance)
        {
            this.singleHubClientInstance = singleHubClientInstance ?? throw new ArgumentNullException(nameof(singleHubClientInstance));
        }

        public async Task<Tuple<bool, HubClientIdentifierMtbl>> TryRegisterSingleInstanceAsync()
        {
            var hubClientIdentifier = new HubClientIdentifierMtbl
            {
                Uuid = Guid.NewGuid(),
                ConnectionId = Context.ConnectionId
            };

            bool retVal = await singleHubClientInstance.TryRegisterSingleInstanceAsync(hubClientIdentifier);

            var retTuple = new Tuple<bool, HubClientIdentifierMtbl>(
                retVal, hubClientIdentifier);

            return retTuple;
        }

        public async Task<Tuple<bool, HubClientIdentifierMtbl>> TryUnregisterSingleInstanceAsync(
            HubClientIdentifierMtbl hubClientIdentifier)
        {
            bool retVal = await singleHubClientInstance.TryUnregisterSingleInstanceAsync(
                hubClientIdentifier);

            var retTuple = new Tuple<bool, HubClientIdentifierMtbl>(
                    retVal, hubClientIdentifier);

            return retTuple;
        }

        public async Task<Tuple<bool, HubClientIdentifierMtbl>> TryReceiveClientPingResponseAsync(
            HubClientIdentifierMtbl hubClientIdentifier)
        {
            bool retVal = await singleHubClientInstance.PingClientRespondedAsync(hubClientIdentifier);
            await Clients.All.TrySendClientPingResponseAsync(retVal, hubClientIdentifier);

            var retTuple = new Tuple<bool, HubClientIdentifierMtbl>(
                    retVal, hubClientIdentifier);

            return retTuple;
        }
    }
}
