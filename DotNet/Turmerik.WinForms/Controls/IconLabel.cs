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

            if (SvcProvContnr.IsRegistered)
            {
                SvcProv = SvcProvContnr.Data;
                MatUIIconsRetriever = SvcProv.GetRequiredService<IMatUIIconsRetriever>();
                fontFamily = MatUIIconsRetriever.IconsFont.Families[0];

                Font = new Font(
                    fontFamily, 16f,
                    FontStyle.Regular);

                Cursor = Cursors.Hand;
            }
        }

        public FontFamily GetFontFamily() => fontFamily;

        public void SetFontFamily(
            FontFamily value)
        {
            fontFamily = value;

            if (value != null)
            {
                Font = new Font(
                    value,
                    Font.Size,
                    Font.Style);
            }

            Invalidate();
        }

        protected ServiceProviderContainer SvcProvContnr { get; }
        protected IServiceProvider SvcProv { get; }
        protected IMatUIIconsRetriever MatUIIconsRetriever { get; }
    }
}
