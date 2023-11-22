using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.WinForms.Controls
{
    public class IconLabel : Label
    {
        private FontFamily fontFamily;

        public IconLabel()
        {
            SvcProvContnr = ServiceProviderContainer.Instance.Value;
            SvcProv = SvcProvContnr.Data;

            if (SvcProvContnr.IsRegistered)
            {
                MatUIIconsRetriever = SvcProv.GetRequiredService<IMatUIIconsRetriever>();
                fontFamily = MatUIIconsRetriever.IconsFont.Families[0];

                Font = new Font(
                    FontFamily, 16f,
                    FontStyle.Regular);

                Cursor = Cursors.Hand;
            }
        }

        public FontFamily FontFamily
        {
            get => fontFamily;

            set
            {
                fontFamily = value;

                if (value != null)
                {
                    Font = new Font(
                        FontFamily,
                        Font.Size,
                        Font.Style);
                }

                Invalidate();
            }
        }

        protected ServiceProviderContainer SvcProvContnr { get; }
        protected IServiceProvider SvcProv { get; }
        protected IMatUIIconsRetriever MatUIIconsRetriever { get; }
    }
}
