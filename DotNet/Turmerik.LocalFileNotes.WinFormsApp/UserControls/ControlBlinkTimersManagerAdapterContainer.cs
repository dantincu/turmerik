using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Dependencies;

namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls
{
    public class ControlBlinkTimersManagerAdapterContainer : SingleInstanceRetrieverBase<ControlBlinkTimersManagerAdapter, ControlBlinkTimersManagerAdapter>
    {
        protected override ControlBlinkTimersManagerAdapter Convert(
            ControlBlinkTimersManagerAdapter inputData) => inputData;
    }
}
