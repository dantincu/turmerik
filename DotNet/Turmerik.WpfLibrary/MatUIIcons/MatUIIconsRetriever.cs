using System;
using System.Collections.Generic;
using System.Drawing.Text;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WpfLibrary.MatUIIcons
{
    public interface IMatUIIconsRetriever : IDisposable
    {
        string MaterialUIIconsFontFileRelPath { get; }
        PrivateFontCollection IconsFont { get; }
    }

    public class MatUIIconsRetriever : IMatUIIconsRetriever
    {
        public MatUIIconsRetriever()
        {
            IconsFont = new PrivateFontCollection();

            IconsFont.AddFontFile(
                MaterialUIIconsFontFileRelPath);
        }

        public virtual string MaterialUIIconsFontFileRelPath { get; } = Path.Combine(
            "Resources",
            "MaterialIcons-Regular.ttf");

        public PrivateFontCollection IconsFont { get; }

        public void Dispose()
        {
            IconsFont.Dispose();
        }
    }
}
