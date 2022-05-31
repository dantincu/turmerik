using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FsExplorer.Background.AspNetCore
{
    public interface IHubClientIdentifier
    {
        Guid Uuid { get; }
        string ConnectionId { get; }
    }

    public class HubClientIdentifierImmtbl : IHubClientIdentifier
    {
        public HubClientIdentifierImmtbl(IHubClientIdentifier src)
        {
            Uuid = src.Uuid;
            ConnectionId = src.ConnectionId;
        }

        public Guid Uuid { get; }
        public string ConnectionId { get; }
    }

    public class HubClientIdentifierMtbl : IHubClientIdentifier
    {
        public HubClientIdentifierMtbl()
        {
        }

        public HubClientIdentifierMtbl(IHubClientIdentifier src)
        {
            Uuid = src.Uuid;
            ConnectionId = src.ConnectionId;
        }

        public Guid Uuid { get; set; }
        public string ConnectionId { get; set; }
    }
}
