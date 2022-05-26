using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Components
{
    public struct ConsoleColorsAgg
    {
        public ConsoleColor MainForeColor { get; set; }
        public ConsoleColor SecondaryForeColor { get; set; }
        public ConsoleColor HighlightBackColor { get; set; }
    }

    public struct ConsoleTextDelims
    {
        public ConsoleTextDelims(string startDelim, string endDelim)
        {
            StartDelim = startDelim;
            EndDelim = endDelim;
        }

        public string StartDelim { get; set; }
        public string EndDelim { get; set; }
    }

    public static class CmdH
    {
        public static ConsoleTextDelims ToConsoleTextDelims(this string str)
        {
            var delims = new ConsoleTextDelims(
                $"[{str}->", $"<-{str}]");

            return delims;
        }
    }

    public interface IConsoleComponent
    {
        void Write(
            string message,
            bool writeLine = false,
            ConsoleColor? consoleColor = null,
            bool colorIsForeGround = true,
            bool? useBrightColor = null,
            bool resetConsoleAfter = true,
            bool printTimeStamp = false,
            params object[] args);

        void WriteText(
            string text,
            string startText = null,
            string endText = null,
            ConsoleColorsAgg? consoleColors = null,
            bool printTimeStamp = false);

        void WriteMdText(
            string mdText,
            string startText = null,
            string endText = null,
            ConsoleColorsAgg? consoleColors = null,
            bool printTimeStamp = false);

        void WriteJson(
            object obj,
            string startText = null,
            string endText = null,
            ConsoleColorsAgg? consoleColors = null,
            bool printTimeStamp = false);

        void WriteException(
            Exception exc,
            string startText = null,
            string endText = null,
            ConsoleColorsAgg? consoleColors = null,
            bool printTimeStamp = false);

        void WriteLines(
            int count = 1,
            bool resetColorsAfter = false);

        void WriteWithDelims(
            string startDelim,
            string endDelim,
            string text,
            ConsoleColor textColor,
            ConsoleColor delimitersBackColor,
            int newLinesBefore = 0,
            int newLinesAfter = 0,
            bool printTimeStamp = false);
    }

    public class ConsoleComponent : IConsoleComponent
    {
        public static Dictionary<ConsoleColor, ConsoleColor> ConsoleColorsDictnr = new Dictionary<ConsoleColor, ConsoleColor>
        {
            { ConsoleColor.Red, ConsoleColor.DarkRed },
            { ConsoleColor.Green, ConsoleColor.DarkGreen },
            { ConsoleColor.Blue, ConsoleColor.DarkBlue },
            { ConsoleColor.Yellow, ConsoleColor.DarkYellow },
            { ConsoleColor.Cyan, ConsoleColor.DarkCyan },
            { ConsoleColor.Magenta, ConsoleColor.DarkMagenta },
            { ConsoleColor.Gray, ConsoleColor.DarkGray },
        };

        private readonly ITimeStampHelper timeStampHelper;

        public ConsoleComponent(ITimeStampHelper timeStampHelper)
        {
            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(nameof(timeStampHelper));
        }

        public void Write(
            string message,
            bool writeLine = false,
            ConsoleColor? consoleColor = null,
            bool colorIsForeGround = true,
            bool? useBrightColor = null,
            bool resetConsoleAfter = true,
            bool printTimeStamp = false,
            params object[] args)
        {
            Action<string> action;
            var consoleColorVal = consoleColor ?? ConsoleColor.Gray;

            if (writeLine)
            {
                action = Console.WriteLine;
            }
            else
            {
                action = Console.Write;
            }

            if (args.Length > 0)
            {
                message = string.Format(message, args);
            }

            WriteCore(() => action(message), consoleColorVal,
                colorIsForeGround, useBrightColor, resetConsoleAfter, printTimeStamp);
        }

        public void WriteText(
            string text,
            string startText = null,
            string endText = null,
            ConsoleColorsAgg? consoleColors = null,
            bool printTimeStamp = false)
        {
            WriteTextCore(
                text,
                TextDelims.PlainText,
                startText,
                endText,
                consoleColors,
                printTimeStamp);
        }

        public void WriteMdText(
            string mdText,
            string startText = null,
            string endText = null,
            ConsoleColorsAgg? consoleColors = null,
            bool printTimeStamp = false)
        {
            WriteTextCore(
                mdText,
                TextDelims.MdText,
                startText,
                endText,
                consoleColors,
                printTimeStamp);
        }

        public void WriteJson(
            object obj,
            string startText = null,
            string endText = null,
            ConsoleColorsAgg? consoleColors = null,
            bool printTimeStamp = false)
        {
            WriteObjCore(
                colors =>
                {
                    string xml = obj.ToJson();

                    Write(
                        xml,
                        true,
                        colors.MainForeColor,
                        true,
                        null,
                        false,
                        printTimeStamp);
                },
                consoleColors ?? DefaultColors.Data,
                startText,
                endText,
                TextDelims.Json,
                TextDelims.Data);
        }

        public void WriteException(
            Exception exc,
            string startText = null,
            string endText = null,
            ConsoleColorsAgg? consoleColors = null,
            bool printTimeStamp = false)
        {
            WriteObjCore(
                colors =>
                {
                    WriteExceptionCore(
                        exc,
                        colors,
                        0,
                        printTimeStamp);
                },
                consoleColors ?? DefaultColors.Error,
                startText,
                endText,
                TextDelims.Json,
                TextDelims.Data);
        }

        public void WriteLines(
            int count = 1,
            bool resetColorsAfter = false)
        {
            for (int i = 0; i < count; i++)
            {
                Console.WriteLine();
            }

            ResetColorsIfreq(resetColorsAfter);
        }

        public void WriteWithDelims(
            string startDelim,
            string endDelim,
            string text,
            ConsoleColor textColor,
            ConsoleColor delimitersBackColor,
            int newLinesBefore = 0,
            int newLinesAfter = 0,
            bool printTimeStamp = false)
        {
            WriteLines(newLinesBefore);
            WriteWithDelimsCore(startDelim, delimitersBackColor);

            text = PaddTextIfReq(text);

            Write(
                text,
                false,
                textColor,
                true,
                null,
                false,
                printTimeStamp);

            WriteWithDelimsCore(endDelim, delimitersBackColor);
            WriteLines(newLinesAfter);
        }

        private void WriteTextCore(
            string text,
            ConsoleTextDelims outterDelims,
            string startText = null,
            string endText = null,
            ConsoleColorsAgg? consoleColors = null,
            bool printTimeStamp = false)
        {
            WriteObjCore(colors =>
                {
                    Write(
                        text,
                        true,
                        colors.MainForeColor,
                        true,
                        null,
                        false,
                        printTimeStamp);
                },
                consoleColors ?? DefaultColors.Data,
                startText,
                endText,
                TextDelims.Text,
                outterDelims);
        }

        private void WriteExceptionCore(
            Exception exc,
            ConsoleColorsAgg colors,
            int level = 0,
            bool printTimeStamp = false)
        {
            var mainColor = colors.MainForeColor;
            var highlightColor = colors.HighlightBackColor;

            PrintTimeStampIfReq(printTimeStamp);

            if (level > 0)
            {
                WriteWithDelims(
                    "LEVEL",
                    null,
                    level.ToString(),
                    mainColor,
                    highlightColor,
                    0,
                    1);
            }

            WriteWithDelims(
                "MESSAGE",
                null,
                exc.Message,
                mainColor,
                highlightColor,
                0,
                1);

            WriteWithDelims(
                "TYPE",
                null,
                exc.Message,
                mainColor,
                highlightColor,
                0,
                1);

            WriteWithDelims(
                "STACKTRACE",
                null,
                exc.StackTrace,
                mainColor,
                highlightColor,
                0,
                1);

            if (exc.InnerException != null)
            {
                WriteWithDelims(
                    "INNER EXCEPTION",
                    null,
                    level.ToString(),
                    mainColor,
                    highlightColor,
                    0,
                    1);

                WriteExceptionCore(
                    exc.InnerException,
                    colors,
                    level + 1);
            }

            if (exc is AggregateException aggExc)
            {
                WriteWithDelims(
                    "INNER EXCEPTIONS (AGGREGATE)",
                    null,
                    level.ToString(),
                    mainColor,
                    highlightColor,
                    0,
                    1);

                foreach (var innerExc in aggExc.InnerExceptions)
                {
                    WriteWithDelims(
                        "INNER EXCEPTION",
                        null,
                        level.ToString(),
                        mainColor,
                        highlightColor,
                        0,
                        1);

                    WriteExceptionCore(
                        innerExc,
                        colors,
                        level + 1);
                }
            }
        }

        private void WriteObjCore(
            Action<ConsoleColorsAgg> mainAction,
            ConsoleColorsAgg colors,
            string startText,
            string endText,
            ConsoleTextDelims mainDelims,
            ConsoleTextDelims outerDelims,
            bool printTimeStamp = false)
        {
            ConsoleColor textColor = colors.SecondaryForeColor;
            ConsoleColor delimsBackColor = colors.HighlightBackColor;

            PrintTimeStampIfReq(printTimeStamp);

            WriteWithDelims(
                outerDelims.StartDelim,
                null,
                startText,
                textColor,
                delimsBackColor,
                2);

            WriteWithDelims(
                mainDelims.StartDelim,
                null,
                null,
                textColor,
                delimsBackColor,
                1,
                1);

            mainAction(colors);

            WriteWithDelims(
                mainDelims.EndDelim,
                null,
                null,
                textColor,
                delimsBackColor,
                1,
                1);

            WriteWithDelims(
                null,
                outerDelims.EndDelim,
                endText,
                textColor,
                delimsBackColor,
                0,
                2);
        }

        private string PaddTextIfReq(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                text = " ";
            }
            else
            {
                text = PaddStartTextIfReq(text);
                text = PaddEndTextIfReq(text);
            }

            return text;
        }

        private string PaddStartTextIfReq(string text)
        {
            text = PaddTextIfReq(
                text,
                txt => txt.FirstOrDefault(),
                txt => $" {txt}");

            return text;
        }

        private string PaddEndTextIfReq(string text)
        {
            text = PaddTextIfReq(
                text,
                txt => txt.LastOrDefault(),
                txt => $"{txt} ");

            return text;
        }

        private string PaddTextIfReq(
            string text,
            Func<string, char> charFactory,
            Func<string, string> strFactory)
        {
            if (text == null || !char.IsWhiteSpace(
                charFactory(text)))
            {
                text = strFactory(text);
            }

            return text;
        }

        private void WriteWithDelimsCore(
            string delim,
            ConsoleColor delimitersBackColor)
        {
            if (delim != null)
            {
                Write(
                    $" <{delim}> ",
                    false,
                    delimitersBackColor,
                    false,
                    null);
            }
        }

        private void WriteCore(
            Action action,
            ConsoleColor consoleColor,
            bool colorIsForeGround,
            bool? useBrightColor,
            bool resetColorsAfter,
            bool printTimeStamp)
        {
            consoleColor = GetConsoleColor(consoleColor, useBrightColor);

            if (colorIsForeGround)
            {
                Console.ForegroundColor = consoleColor;
                Console.BackgroundColor = ConsoleColor.Black;
            }
            else
            {
                Console.BackgroundColor = consoleColor;
                Console.ForegroundColor = ConsoleColor.Black;
            }

            PrintTimeStampIfReq(printTimeStamp);

            action();
            ResetColorsIfreq(resetColorsAfter);
        }

        private ConsoleColor GetConsoleColor(
            ConsoleColor consoleColor,
            bool? useBrightColor)
        {
            if (useBrightColor.HasValue && consoleColor != ConsoleColor.Black && consoleColor != ConsoleColor.White)
            {
                var matchKvp = ConsoleColorsDictnr.Single(
                    kvp => kvp.Key == consoleColor || kvp.Value == consoleColor);

                if (useBrightColor.Value)
                {
                    consoleColor = matchKvp.Key;
                }
                else
                {
                    consoleColor = matchKvp.Value;
                }
            }

            return consoleColor;
        }

        private void ResetColorsIfreq(bool resetColors)
        {
            if (resetColors)
            {
                Console.ResetColor();
            }
        }

        private void PrintTimeStampIfReq(bool printTimeStamp)
        {
            if (printTimeStamp)
            {
                string timeStamp = timeStampHelper.TmStmp(null, true);
                Console.Write($"# {timeStamp} # ");
            }
        }

        private static class TextDelims
        {
            public static readonly ConsoleTextDelims Text = "TEXT".ToConsoleTextDelims();
            public static readonly ConsoleTextDelims PlainText = "PLAIN-TEXT".ToConsoleTextDelims();
            public static readonly ConsoleTextDelims MdText = "MD-TEXT".ToConsoleTextDelims();
            public static readonly ConsoleTextDelims Json = "JSON".ToConsoleTextDelims();
            public static readonly ConsoleTextDelims Data = "DATA".ToConsoleTextDelims();
            public static readonly ConsoleTextDelims Err = "DATA".ToConsoleTextDelims();
            public static readonly ConsoleTextDelims Exc = "DATA".ToConsoleTextDelims();
        }

        private static class DefaultColors
        {
            public static readonly ConsoleColorsAgg Data = new ConsoleColorsAgg
            {
                MainForeColor = ConsoleColor.Magenta,
                SecondaryForeColor = ConsoleColor.DarkMagenta,
                HighlightBackColor = ConsoleColor.DarkMagenta
            };

            public static readonly ConsoleColorsAgg Error = new ConsoleColorsAgg
            {
                MainForeColor = ConsoleColor.Red,
                SecondaryForeColor = ConsoleColor.DarkRed,
                HighlightBackColor = ConsoleColor.DarkRed
            };
        }
    }
}
