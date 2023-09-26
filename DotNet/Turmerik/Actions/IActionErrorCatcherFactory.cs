using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Actions
{
    public interface IActionErrorCatcherFactory
    {
        IActionErrorCatcher Create();
    }
}
