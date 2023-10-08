using Avalonia.Controls;
using Avalonia.Media;
using Turmerik.Dependencies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkFsBackup.AvaloniaApp
{
    public class AppGlobals : SingletonRegistrarBase<IAppGlobalsData, IAppGlobalsData>
    {
        protected override IAppGlobalsData Convert(
            IAppGlobalsData inputData) => new AppGlobalsData(inputData);
    }

    public interface IAppGlobalsData
    {
        public TopLevel TopLevel { get; }

        public IBrush DefaultOutputTextForeground { get; }
        public IBrush SuccessOutputTextForeground { get; }
        public IBrush ErrorOutputTextForeground { get; }

        public IBrush DefaultMaterialIconsForeground { get; }
    }

    public class AppGlobalsData : IAppGlobalsData
    {
        public AppGlobalsData(IAppGlobalsData src)
        {
            TopLevel = src.TopLevel;
            DefaultOutputTextForeground = src.DefaultOutputTextForeground;
            SuccessOutputTextForeground = src.SuccessOutputTextForeground;
            ErrorOutputTextForeground = src.ErrorOutputTextForeground;
            DefaultMaterialIconsForeground = src.DefaultMaterialIconsForeground;
        }

        public TopLevel TopLevel { get; }

        public IBrush DefaultOutputTextForeground { get; }
        public IBrush SuccessOutputTextForeground { get; }
        public IBrush ErrorOutputTextForeground { get; }

        public IBrush DefaultMaterialIconsForeground { get; }
    }

    public class AppGlobalsMutableData : IAppGlobalsData
    {
        public TopLevel TopLevel { get; set; }

        public IBrush DefaultOutputTextForeground { get; set; }
        public IBrush SuccessOutputTextForeground { get; set; }
        public IBrush ErrorOutputTextForeground { get; set; }

        public IBrush DefaultMaterialIconsForeground { get; set; }
    }
}
