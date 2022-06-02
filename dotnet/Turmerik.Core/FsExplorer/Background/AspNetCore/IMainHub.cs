using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.FsExplorer.Background.AspNetCore
{
    public interface IMainHub
    {
        Task<Tuple<bool, HubClientIdentifierMtbl>> TryRegisterSingleInstanceAsync();

        Task<Tuple<bool, HubClientIdentifierMtbl>> TryUnregisterSingleInstanceAsync(
            HubClientIdentifierMtbl hubClientIdentifier);

        Task<Tuple<bool, HubClientIdentifierMtbl>> TryReceiveClientPingResponseAsync(
            HubClientIdentifierMtbl hubClientIdentifier);
    }

    public interface IMainHubClient
    {
        Task<Tuple<bool, HubClientIdentifierMtbl>> TrySendClientPingResponseAsync(
            bool alreadyRegistered,
            HubClientIdentifierMtbl hubClientIdentifier);

        Task<Tuple<bool, HubClientIdentifierMtbl>> TryPingClientAsync(
            HubClientIdentifierMtbl hubClientIdentifier);
    }
}
