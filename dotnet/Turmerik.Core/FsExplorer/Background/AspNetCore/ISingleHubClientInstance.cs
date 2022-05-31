using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Turmerik.Core.FsExplorer.Background.AspNetCore
{
    public interface ISingleHubClientInstance<TIdnf>
        where TIdnf : IHubClientIdentifier
    {
        TIdnf RegisteredIdentifier { get; }
        bool TryRegisterSingleInstance(Func<TIdnf> identifierFactory);
        bool TryUnregisterSingleInstance(TIdnf identifier);
        bool ClientIsRegistered(TIdnf identifier);
        Tuple<bool, TIdnf> GetRegisteredIdentifier();
    }

    public interface ISingleHubClientInstance : ISingleHubClientInstance<IHubClientIdentifier>
    {
    }

    public class SingleHubClientInstance<TIdnf> : ISingleHubClientInstance<TIdnf>
        where TIdnf : IHubClientIdentifier
    {
        private readonly object syncRoot;
        private volatile bool isRegistered;

        public SingleHubClientInstance()
        {
            syncRoot = new object();
        }

        public TIdnf RegisteredIdentifier { get; private set; }
        public bool IsRegistered => isRegistered;

        public bool TryRegisterSingleInstance(Func<TIdnf> identifierFactory)
        {
            bool retVal;

            lock (syncRoot)
            {
                retVal = !isRegistered;

                if (retVal)
                {
                    var connectedIdentifier = identifierFactory();

                    if (IdentifierIsNullOrEmpty(connectedIdentifier))
                    {
                        throw new ArgumentException(nameof(identifierFactory));
                    }
                    else
                    {
                        isRegistered = true;
                        RegisteredIdentifier = connectedIdentifier;
                    }
                }
            }

            return retVal;
        }

        public bool TryUnregisterSingleInstance(TIdnf identifier)
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

        public bool ClientIsRegistered(TIdnf identifier)
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

        public Tuple<bool, TIdnf> GetRegisteredIdentifier()
        {
            Tuple<bool, TIdnf> retTuple;

            lock (syncRoot)
            {
                if (isRegistered)
                {
                    retTuple = new Tuple<bool, TIdnf>(
                        isRegistered, RegisteredIdentifier);
                }
                else
                {
                    retTuple = new Tuple<bool, TIdnf>(false, default);
                }
            }

            return retTuple;
        }

        public virtual bool IdentifiersAreEqual(TIdnf trgIdnf, TIdnf refIdnf)
        {
            bool bothAreNull = trgIdnf == null && refIdnf == null;
            bool noneAreNull = trgIdnf != null && refIdnf != null;

            bool retVal = bothAreNull || noneAreNull;

            if (retVal && noneAreNull)
            {
                retVal = trgIdnf.Uuid == refIdnf.Uuid;
                retVal = retVal && trgIdnf.ConnectionId == refIdnf.ConnectionId;
            }

            return retVal;
        }

        public virtual bool IdentifierIsNullOrEmpty(TIdnf identifier)
        {
            bool retVal = identifier == null || identifier.Uuid == Guid.Empty;
            retVal = retVal || string.IsNullOrWhiteSpace(identifier.ConnectionId);

            return retVal;
        }
    }

    public class SingleHubClientInstance : SingleHubClientInstance<IHubClientIdentifier>, ISingleHubClientInstance
    {
    }
}
