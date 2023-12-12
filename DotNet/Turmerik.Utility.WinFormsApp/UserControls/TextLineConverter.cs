using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public abstract class TextLineConverterBase
    {
        public TextLineConverterBase(
            string name,
            Action onSelected,
            Func<bool> isSelectedValRetriever)
        {
            Name = name ?? throw new ArgumentNullException(
                nameof(name));

            OnSelected = onSelected ?? throw new ArgumentNullException(
                nameof(onSelected));

            IsSelectedValRetriever = isSelectedValRetriever ?? throw new ArgumentNullException(
                nameof(isSelectedValRetriever));
        }

        public string Name { get; }
        public Action OnSelected { get; }
        public Func<bool> IsSelectedValRetriever { get; }

        public abstract Control GetControl();
    }

    public class TextLineConverter<TControl> : TextLineConverterBase
        where TControl : Control
    {
        public TextLineConverter(
            Lazy<TControl> control,
            string name,
            Action onSelected,
            Func<bool> isSelectedValRetriever) : base(
                name, onSelected, isSelectedValRetriever)
        {
            Control = control ?? throw new ArgumentNullException(
                nameof(control));
        }

        public Lazy<TControl> Control { get; }

        public override Control GetControl() => Control.Value;
    }
}
