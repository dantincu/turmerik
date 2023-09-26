using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Actions;

namespace Turmerik.Actions
{
    public class ActionErrorCatcherFactory : IActionErrorCatcherFactory
    {
        public IActionErrorCatcher Create() => new ActionErrorCatcher();
    }
}
