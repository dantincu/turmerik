using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Components;

namespace Turmerik.Core.DriveExplorer
{
    public abstract class DriveExplorerServiceBase
    {
        protected DriveExplorerServiceBase(ITimeStampHelper timeStampHelper)
        {
            this.TimeStampHelper = timeStampHelper ?? throw new ArgumentNullException(nameof(timeStampHelper));
        }

        protected ITimeStampHelper TimeStampHelper { get; }
    }
}
