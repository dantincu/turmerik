using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Threading;
using Turmerik.Core.Utility;

namespace Turmerik.WinForms.Controls
{
    public class PropChangedEventAdapterOpts<TPropVal, TEventArgs>
    {
        public ISynchronizedValueAdapter<bool> SynchronizedValueAdapter { get; set; }
        public Func<TPropVal> PropValGetter { get; set; }
        public Action<object, TEventArgs, TPropVal> EnabledHandler { get; set; }
        public Action<object, TEventArgs, TPropVal> DisabledHandler { get; set; }
        public Action<object, TEventArgs, TPropVal, bool> BeforeHandler { get; set; }
        public Action<object, TEventArgs, TPropVal, bool> AfterHandler { get; set; }
    }
}
