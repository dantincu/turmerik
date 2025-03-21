using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.NetCore.Utility
{
    public class TrmrkClipboardService : IClipboardService
    {
        public string? GetText() => TextCopy.ClipboardService.GetText();

        public void SetText(string text) => TextCopy.ClipboardService.SetText(text);

        public async Task<string?> GetTextAsync() => await TextCopy.ClipboardService.GetTextAsync();

        public async Task SetTextAsync(string text) => await TextCopy.ClipboardService.SetTextAsync(text);
    }
}
