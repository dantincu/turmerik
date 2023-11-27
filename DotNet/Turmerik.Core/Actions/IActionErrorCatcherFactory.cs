using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Actions
{
    public interface IActionErrorCatcherFactory
    {
        IActionErrorCatcher Create();
    }
}
