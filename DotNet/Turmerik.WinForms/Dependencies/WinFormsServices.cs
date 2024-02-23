using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Controls;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.WinForms.Dependencies
{
    public static class WinFormsServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IMatUIIconsRetriever, MatUIIconsRetriever>();
            services.AddSingleton<IWinFormsActionComponentCreator, WinFormsActionComponentCreator>();
            services.AddSingleton<IControlBlinkTimersManager, ControlBlinkTimersManager>();
            services.AddSingleton<IPropChangedEventAdapterFactory, PropChangedEventAdapterFactory>();
            services.AddSingleton<IToolTipHintsOrchestratorFactory, ToolTipHintsOrchestratorFactory>();
            services.AddSingleton<IRichTextBoxPseudoMarkupRetriever, RichTextBoxPseudoMarkupRetriever>();
            services.AddSingleton<IRichTextBoxPseudoMarkupAdapter, RichTextBoxPseudoMarkupAdapter>();

            return services;
        }
    }
}
