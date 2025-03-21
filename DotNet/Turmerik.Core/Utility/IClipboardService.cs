using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Utility
{
    public interface IClipboardService
    {
        string? GetText();

        void SetText(string text);

        Task<string?> GetTextAsync();

        Task SetTextAsync(string text);
    }
}
