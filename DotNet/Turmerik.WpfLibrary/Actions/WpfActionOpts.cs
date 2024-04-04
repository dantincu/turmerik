using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.Core.UIActions;

namespace Turmerik.WpfLibrary.Actions
{
    public interface IWpfActionOptsCore<T> : IUIActionOptsCore<T, IWpfMessageTuple>
    {
    }

    public interface IWpfActionOpts<T> : IWpfActionOptsCore<T>, IUIActionOpts<T, IWpfMessageTuple>
    {
    }

    public interface IWpfAsyncActionOpts<T> : IWpfActionOptsCore<T>, IUIAsyncActionOpts<T, IWpfMessageTuple>
    {
    }

    public class WpfActionOpts<T> : UIActionOpts<T, IWpfMessageTuple>, IWpfActionOpts<T>
    {
        public WpfActionOpts()
        {
        }

        public WpfActionOpts(Func<IActionResult<T>> action)
        {
            Action = action;
        }
    }

    public class WpfAsyncActionOpts<T> : UIAsyncActionOpts<T, IWpfMessageTuple>, IWpfAsyncActionOpts<T>
    {
        public WpfAsyncActionOpts()
        {
        }

        public WpfAsyncActionOpts(Func<Task<IActionResult<T>>> action)
        {
            Action = action;
        }
    }
}
