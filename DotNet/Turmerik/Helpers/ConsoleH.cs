using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Helpers
{
    public static class ConsoleH
    {
        public static void WithColors(
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
            Exception exc,
            Func<Exception, string> msgFactory = null,
            ConsoleColor? forecolor = null,
            ConsoleColor? backcolor = null) => WithColors(
                () =>
                {
                    msgFactory = msgFactory.FirstNotNull(
                        ex => string.Join(": ",
                            ex.GetType().FullName,
                            ex.Message));

                    var msg = msgFactory(exc);
                    Console.Out.WriteLine(msg);
                },
                forecolor ?? ConsoleColor.Red,
                backcolor ?? ConsoleColor.Black);

        public static void TryExecute(
            Action action,
            bool rethrow = true,
            Func<Exception, string> msgFactory = null)
        {
            try
            {
                action();
            }
            catch (Exception exc)
            {
                WithExcp(exc, msgFactory);

                if (rethrow)
                {
                    throw;
                }
            }
        }

        public static async Task TryExecuteAsync(
            Func<Task> action,
            bool rethrow = true,
            Func<Exception, string> msgFactory = null)
        {
            try
            {
                await action();
            }
            catch (Exception exc)
            {
                WithExcp(exc, msgFactory);

                if (rethrow)
                {
                    throw;
                }
            }
        }
    }
}
