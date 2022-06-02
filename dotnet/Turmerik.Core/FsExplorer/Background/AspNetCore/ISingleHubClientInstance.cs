using System;
using System.Threading.Tasks;

namespace Turmerik.Core.FsExplorer.Background.AspNetCore
{
    public interface ISingleHubClientInstance
    {
        HubClientIdentifierMtbl RegisteredIdentifier { get; }
        Task<bool> TryRegisterSingleInstanceAsync(HubClientIdentifierMtbl identifier);
        Task<bool> TryUnregisterSingleInstanceAsync(HubClientIdentifierMtbl identifier);
        Task<bool> ClientIsRegisteredAsync(HubClientIdentifierMtbl identifier);
        Task<Tuple<bool, HubClientIdentifierMtbl>> GetRegisteredIdentifierAsync();
        Task<bool> PingClientRespondedAsync(HubClientIdentifierMtbl identifier);
    }
}
