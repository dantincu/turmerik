using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Helpers
{
    public static class ConsoleH
    {
        public static ConsoleColorsTuple Tuple(
            this ConsoleColor foreColor,
            ConsoleColor? backColor = null) => new ConsoleColorsTuple(
                foreColor, backColor);

        public static ConsoleColorsTuple Tuple(
            this ConsoleColor? foreColor,
            ConsoleColor? backColor = null) => new ConsoleColorsTuple(
                foreColor, backColor);

        public static void WithColors(
            Action callback,
            ConsoleColorsTuple colors)
        {
            SetColors(colors);

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

        public static void SetColors(
            ConsoleColorsTuple colors) => SetColors(
                colors.ForeColor,
                colors.BackColor);

        public static void WithExcp(
            Exception exc,
            Func<Exception, string> msgFactory = null,
            ConsoleColorsTuple colors = default,
            string msgCaption = null) => WithColors(
                () =>
                {
                    msgFactory = msgFactory.FirstNotNull(
                        ex => string.Join(": ",
                            msgCaption.Arr(
                            ex.GetType().FullName,
                            ex.Message).NotNull()));

                    var msg = msgFactory(exc);
                    Console.Out.WriteLine(msg);
                },
                (colors.ForeColor ?? ConsoleColor.Red).Tuple(
                    colors.BackColor ?? ConsoleColor.Black));

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
            finally
            {
                Console.ResetColor();
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
            finally
            {
                Console.ResetColor();
            }
        }

        public static void Print(
            this ConsoleMessage[] messagesArr,
            bool resetColors = true)
        {
            foreach (var message in messagesArr)
            {
                Print(message, false);
            }

            if (resetColors)
            {
                Console.ResetColor();
            }
        }

        public static void Print(
            this ConsoleMessage message,
            bool resetColors = true)
        {
            PrintNwLines(message.NwLnsBefore);
            SetColors(message.Colors);

            Console.Write(message.Message);

            if (resetColors)
            {
                Console.ResetColor();
            }

            PrintNwLines(message.NwLnsAfter);
        }

        public static void PrintNwLines(int count)
        {
            for (int i = 0; i < count; i++)
            {
                Console.WriteLine();
            }
        }
    }
}
