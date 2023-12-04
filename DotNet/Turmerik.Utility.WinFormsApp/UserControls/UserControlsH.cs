using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.WinForms.Actions;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.WinForms.Controls;
using Turmerik.Utility.WinFormsApp.Settings;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public static class UserControlsH
    {
        public static IActionResult<string?> CopyTextToClipboard(
            this IWinFormsStatusLabelActionComponent actionComponent,
            ControlBlinkTimersManagerAdapter controlBlinkTimersManagerAdapter,
            IconLabel iconLabel,
            string? text) => text.Nullify(true).With(text => actionComponent.Execute(new WinFormsActionOpts<string?>
            {
                OnBeforeExecution = () => WinFormsMessageTuple.WithOnly(
                    text != null ? " " : null),
                Action = () =>
                {
                    text?.ActWith(title =>
                    {
                        Clipboard.SetText(title);
                    });

                    return ActionResultH.Create(text);
                }
            }).ActWith(result => controlBlinkTimersManagerAdapter.BlinkControl(
                iconLabel,
                result,
                result.Value != null)));

        public static void UpdateAppSettings(
            this IWinFormsStatusLabelActionComponent actionComponent,
            IAppSettings appSettings,
            Action<AppSettingsDataMtbl> updateAction) => actionComponent.Execute(new WinFormsActionOpts<int>
            {
                Action = () =>
                {
                    appSettings.Update(updateAction);
                    return ActionResultH.Create(0);
                }
            });
    }
}
