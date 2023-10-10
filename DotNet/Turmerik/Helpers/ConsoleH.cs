using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Turmerik.Helpers
{
    public static class ConsoleH
    {
        public static void WithColors(
            this TextWriter writer,
            Action callback,
            ConsoleColor? forecolor = null,
            ConsoleColor? backcolor = null)
        {
            SetColors(forecolor, backcolor);

            try
            {
                callback();
            }
            finally
            {
                Console.ResetColor();
            }
        }

        public static void SetColors(
            Func<ConsoleColor> forecolor,
            Func<ConsoleColor> backcolor,
            bool setForecolor,
            bool setBackcolor)
        {
            if (setForecolor)
            {
                Console.ForegroundColor = forecolor();
            }

            if (setBackcolor)
            {
                Console.BackgroundColor = backcolor();
            }
        }

        public static void SetColors(
            ConsoleColor? forecolor,
            ConsoleColor? backcolor) => SetColors(
                () => forecolor.Value,
                () => backcolor.Value,
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
                () =>
                {
                    msgFactory = msgFactory.FirstNotNull(
                        ex => string.Join(": ",
                            ex.GetType().FullName,
                            ex.Message));

                    var msg = msgFactory(exc);
                    Console.Error.WriteLine(msg);
                },
                forecolor ?? ConsoleColor.Red,
                backcolor);
        }
    }
}
