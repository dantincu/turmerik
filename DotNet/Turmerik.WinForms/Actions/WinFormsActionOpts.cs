using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.Core.UIActions;

namespace Turmerik.WinForms.Actions
{
    public interface IWinFormsActionOptsCore<T> : IUIActionOptsCore<T, IWinFormsMessageTuple>
    {
    }

    public interface IWinFormsActionOpts<T> : IWinFormsActionOptsCore<T>, IUIActionOpts<T, IWinFormsMessageTuple>
    {
    }

    public interface IWinFormsAsyncActionOpts<T> : IWinFormsActionOptsCore<T>, IUIAsyncActionOpts<T, IWinFormsMessageTuple>
    {
    }

    public class WinFormsActionOpts<T> : UIActionOpts<T, IWinFormsMessageTuple>, IWinFormsActionOpts<T>
    {
        public WinFormsActionOpts()
        {
        }

        public WinFormsActionOpts(Func<IActionResult<T>> action)
        {
            Action = action;
        }
    }

    public class WinFormsAsyncActionOpts<T> : UIAsyncActionOpts<T, IWinFormsMessageTuple>, IWinFormsAsyncActionOpts<T>
    {
        public WinFormsAsyncActionOpts()
        {
        }

        public WinFormsAsyncActionOpts(Func<Task<IActionResult<T>>> action)
        {
            Action = action;
        }
    }
}
