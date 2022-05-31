using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.FsExplorer.Background.AspNetCore
{
    public interface IMainHub
    {
        Tuple<bool, IHubClientIdentifier> TryRegisterSingleInstance();

        Tuple<bool, IHubClientIdentifier> TryUnregisterSingleInstance(
            HubClientIdentifierMtbl hubClientIdentifier);

        Tuple<bool, IHubClientIdentifier> TryReceiveClientPingResponse(
            HubClientIdentifierMtbl hubClientIdentifier);

        Task<Tuple<bool, IHubClientIdentifier>> TryPingClientAsync();
    }
}
