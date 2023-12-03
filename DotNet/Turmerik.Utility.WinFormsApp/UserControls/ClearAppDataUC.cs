using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.Actions;
using Turmerik.Core.FileSystem;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Logging;
using Turmerik.Core.UIActions;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public partial class ClearAppDataUC : UserControl
    {
        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IAppEnv appEnv;
        private readonly IAppLogger logger;
        private readonly IWinFormsMsgBoxActionComponent actionComponent;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;
        private readonly ToolTip toolTip;

        public ClearAppDataUC()
        {
            svcProvContnr = ServiceProviderContainer.Instance.Value;

            if (svcProvContnr.IsRegistered)
            {
                svcProv = svcProvContnr.Data;
                appEnv = svcProv.GetRequiredService<IAppEnv>();
                logger = svcProv.GetRequiredService<IAppLoggerCreator>().GetSharedAppLogger(GetType());
                actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>().MsgBox(GetType());
                matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
            }

            InitializeComponent();

            toolTip = new ToolTip
            {
                InitialDelay = 1,
                ShowAlways = true,
                IsBalloon = true,
            };

            toolTip.SetToolTip(iconLabelMainAction, string.Join("\n",
                "Click to reset app data"));

            if (svcProvContnr.IsRegistered)
            {
                iconLabelInfoMainAction.Text = Ux.MatUIIconUnicodesH.CommonActions.QUESTION_MARK;
                iconLabelMainAction.Text = Ux.MatUIIconUnicodesH.AudioAndVideo.PLAY_ARROW;
            }
        }

        #region UI Event Handlers

        private void ClearAppDataUC_Load(
            object sender, EventArgs e) => actionComponent?.Execute(new WinFormsActionOpts<int>
            {
                ActionName = nameof(ClearAppDataUC_Load),
                Action = () =>
                {
                    return ActionResultH.Create(0);
                }
            });

        private void IconLabelInfoMainAction_Click(
            object sender, EventArgs e)
        {
            var text = toolTip.GetToolTip(iconLabelInfoMainAction);

            if (string.IsNullOrEmpty(text))
            {
                text = string.Join("\n", "This action will remove all user settings and preferences, which include ",
                    "the checked/unchecked state for checkboxes and selected items for comboboxes across this app");
            }
            else
            {
                text = null;
            }

            toolTip.SetToolTip(iconLabelInfoMainAction, text);
        }

        private void IconLabelMainAction_Click(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            ActionName = nameof(IconLabelInfoMainAction_Click),
            Action = () =>
            {
                foreach (var type in new Type[] { })
                {
                    var dirPath = appEnv.GetTypePath(AppEnvDir.Data, type);
                    Directory.Delete(dirPath, true);
                }

                return ActionResultH.Create(0);
            }
        });

        #endregion UI Event Handlers
    }
}
