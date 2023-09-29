using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Turmerik.MkFsDirsPair.Lib
{
    public static class ConsoleH
    {
        public static void WithColors(
            this TextWriter writer,
            Action<TextWriter> callback,
            ConsoleColor? forecolor = null,
            ConsoleColor? backcolor = null)
        {
            ConsoleColor prevForecolor = Console.ForegroundColor;
            ConsoleColor prevBackcolor = Console.BackgroundColor;

            SetColors(forecolor, backcolor);

            try
            {
                callback(writer);
            }
            finally
            {
                SetColors(prevForecolor, prevBackcolor,
                    forecolor.HasValue, backcolor.HasValue);
            }
        }

        public static void SetColors(
            ConsoleColor forecolor,
            ConsoleColor backcolor,
            bool setForecolor,
            bool setBackcolor)
        {
            if (setForecolor)
            {
                Console.ForegroundColor = forecolor;
            }

            if (setBackcolor)
            {
                Console.BackgroundColor = backcolor;
            }
        }

        public static void SetColors(
            ConsoleColor? forecolor,
            ConsoleColor? backcolor) => SetColors(
                forecolor ?? default,
                backcolor ?? default,
                forecolor.HasValue,
                backcolor.HasValue);

        public static void WithExcp(
            this TextWriter writer,
            Exception exc,
            Func<Exception, string> msgFactory = null,
            ConsoleColor? forecolor = null,
            ConsoleColor? backcolor = null)
        {
            writer.WithColors(
                wr =>
                {
                    msgFactory = msgFactory.FirstNotNull(
                        ex => string.Join(": ",
                            ex.GetType().FullName,
                            ex.Message));

                    var msg = msgFactory(exc);
                    wr.WriteLine(msg);
                },
                forecolor ?? ConsoleColor.Red,
                backcolor);
        }
    }
}
