using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FsExplorer.Background.AspNetCore
{
    public static class HubsH
    {
        public const int PING_RESPONSE_WAIT_MILLIS_AGG_MAX = 30 * 1000;

        public const int PING_RESPONSE_WAIT_MILLIS = 1000;

        public const string MAIN_HUB_NAME = "main";
        public const string MAIN_HUB_ADDRESS = "mainHub";
        public const string PING_CLIENT_METHOD_NAME = "PingClient";
    }
}
