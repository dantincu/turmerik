using Microsoft.AspNetCore.SignalR;
using Turmerik.Core.FsExplorer.Background.AspNetCore;

namespace Turmerik.FsExplorer.Background.AspNetCore.App.Hubs
{
    public class MainHub : Hub
    {
        private readonly ISingleHubClientInstance singleHubClientInstance;

        public MainHub(ISingleHubClientInstance singleHubClientInstance)
        {
            this.singleHubClientInstance = singleHubClientInstance ?? throw new ArgumentNullException(nameof(singleHubClientInstance));
        }

        public Tuple<bool, IHubClientIdentifier> TryRegisterSingleInstance()
        {
            var hubClientIdentifier = new HubClientIdentifierImmtbl(
                new HubClientIdentifierMtbl
                {
                    Uuid = Guid.NewGuid(),
                    ConnectionId = Context.ConnectionId
                });

            bool retVal = singleHubClientInstance.TryRegisterSingleInstance(
                () => hubClientIdentifier);

            Tuple<bool, IHubClientIdentifier> retTuple;

            if (retVal)
            {
                retTuple = new Tuple<bool, IHubClientIdentifier>(
                    retVal, hubClientIdentifier);
            }
            else
            {
                retTuple = new Tuple<bool, IHubClientIdentifier>(
                    retVal, null);
            }

            return retTuple;
        }

        public Tuple<bool, IHubClientIdentifier> TryUnregisterSingleInstance(
            IHubClientIdentifier hubClientIdentifier)
        {
            bool retVal = singleHubClientInstance.TryUnregisterSingleInstance(
                hubClientIdentifier);

            var retTuple = new Tuple<bool, IHubClientIdentifier>(
                    retVal, hubClientIdentifier);

            return retTuple;
        }

        public Tuple<bool, IHubClientIdentifier> TryReceiveClientPingResponse(IHubClientIdentifier hubClientIdentifier)
        {
            bool retVal = singleHubClientInstance.ClientIsRegistered(hubClientIdentifier);

            var retTuple = new Tuple<bool, IHubClientIdentifier>(
                    retVal, hubClientIdentifier);

            return retTuple;
        }

        public async Task<Tuple<bool, IHubClientIdentifier>> TryPingClientAsync()
        {
            var retTuple = singleHubClientInstance.GetRegisteredIdentifier();

            if (retTuple.Item1)
            {
                await Clients.Client(retTuple.Item2.ConnectionId).SendAsync(
                    HubsH.PING_CLIENT_METHOD_NAME);
            }

            return retTuple;
        }
    }
}
