using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public class ConsoleMessage
    {
        public ConsoleMessage(
            string message,
            int nwLnsBefore = 0,
            int nwLnsAfter = 0,
            ConsoleColorsTuple colors = default)
        {
            Message = message;
            NwLnsBefore = nwLnsBefore;
            NwLnsAfter = nwLnsAfter;
            Colors = colors;
        }

        public string Message { get; set; }
        public int NwLnsBefore { get; set; }
        public int NwLnsAfter { get; set; }
        public ConsoleColorsTuple Colors { get; set; }
    }

    public readonly struct ConsoleColorsTuple
    {
        public ConsoleColorsTuple(
            ConsoleColor? foreColor,
            ConsoleColor? backColor)
        {
            ForeColor = foreColor;
            BackColor = backColor;
        }

        public ConsoleColor? ForeColor { get; init; }
        public ConsoleColor? BackColor { get; init; }
    }
}
