using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.UIActions;

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
    }

    public class WinFormsAsyncActionOpts<T> : UIAsyncActionOpts<T, IWinFormsMessageTuple>, IWinFormsAsyncActionOpts<T>
    {
    }
}
