using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Actions
{
    public class ActionErrorCatcherFactory : IActionErrorCatcherFactory
    {
        public IActionErrorCatcher Create() => new ActionErrorCatcher();
    }
}
