using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.AspNetCore.Controllers
{
    public abstract class ApiRequestDataCoreBase
    {
        public int ClientVersion { get; set; }
    }
}
