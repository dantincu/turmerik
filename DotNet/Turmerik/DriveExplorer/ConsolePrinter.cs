using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.DriveExplorer
{
    public interface IConsolePrinter
    {
        void PrintHeader(
            string caption,
            string content,
            string template = null,
            ConsoleColor? backColor = null);

        void PrintWithHeaderAndFooter(
            Action<TextWriter> action,
            string startCaption,
            string endCaption,
            string content,
            string template = null,
            ConsoleColor? backColor = null);

        void PrintFsEntries(
            string[] fsEntryNamesArr,
            string startCaption,
            string endCaption,
            string content,
            string template = null,
            ConsoleColor? backColor = null,
            Action<TextWriter> beforeCallback = null);

        void PrintDataWithColors(
            string title,
            string joinStr,
            string content,
            ConsoleColor titleColor,
            ConsoleColor joinStrBackColor,
            ConsoleColor contentColor);

        void PrintDataWithColors<TData>(
            IEnumerable<TData> nmrbl,
            Func<TData, Tuple<string, string, string>> strPartsFactory,
            string caption,
            ConsoleColor lightColor,
            ConsoleColor darkColor);

        void PrintDataWithColors<TData>(
            IEnumerable<TData> nmrbl,
            Func<TData, string> strFactory,
            string caption,
            ConsoleColor lightColor,
            ConsoleColor darkColor);
    }

    public class ConsolePrinter : IConsolePrinter
    {
        public const string HEADER_TEMPLATE = "\n <<<< <<<< <<<< <<<< \n{0} <<<< {1}\n <<<< <<<< <<<< <<<< ";

        public void PrintHeader(
            string caption,
            string content,
            string template = null,
            ConsoleColor? backColor = null)
        {
            template ??= HEADER_TEMPLATE;

            string text = string.Format(
                template,
                caption,
                content);

            string[] textLines = text.Split('\n');

            Console.Out.WithColors(
                () =>
                {
                    int maxIdx = textLines.Length - 1;

                    for (int i = 0; i <= maxIdx; i++)
                    {
                        var line = textLines[i];
                        Console.Write(line);

                        if (i < maxIdx)
                        {
                            Console.WriteLine();
                        }
                    }
                },
                ConsoleColor.Black,
                backColor ?? ConsoleColor.White);

            Console.Out.WriteLine();
        }

        public void PrintWithHeaderAndFooter(
            Action<TextWriter> action,
            string startCaption,
            string endCaption,
            string content,
            string template = null,
            ConsoleColor? backColor = null)
        {
            PrintHeader(startCaption, content, template, backColor);
            action(Console.Out);
            PrintHeader(endCaption, content, template, backColor);
        }

        public void PrintFsEntries(
            string[] fsEntryNamesArr,
            string startCaption,
            string endCaption,
            string content,
            string template = null,
            ConsoleColor? backColor = null,
            Action<TextWriter> beforeCallback = null)
        {
            PrintWithHeaderAndFooter(wr =>
            {
                beforeCallback?.Invoke(wr);

                foreach (string fsEntryName in fsEntryNamesArr)
                {
                    wr.WriteLine(fsEntryName);
                }
            },
                startCaption,
                endCaption,
                content,
                template,
                backColor);

            Console.WriteLine();
            Console.WriteLine();
        }

        public void PrintDataWithColors<TData>(
            IEnumerable<TData> nmrbl,
            Func<TData, Tuple<string, string, string>> strPartsFactory,
            string caption,
            ConsoleColor lightColor,
            ConsoleColor darkColor)
        {
            Console.WriteLine();

            Console.Out.WithColors(
                () => Console.Write(caption),
                ConsoleColor.Black,
                lightColor);

            Console.WriteLine();
            Console.WriteLine();

            foreach (var item in nmrbl)
            {
                (var prefix, var joinStr, var title) = strPartsFactory(item);

                PrintDataWithColors(
                    prefix,
                    joinStr,
                    title,
                    lightColor,
                    darkColor,
                    darkColor);
            }
        }

        public void PrintDataWithColors<TData>(
            IEnumerable<TData> nmrbl,
            Func<TData, string> strFactory,
            string caption,
            ConsoleColor captionColor,
            ConsoleColor contentColor)
        {
            Console.WriteLine();

            Console.Out.WithColors(
                () => Console.WriteLine(caption),
                ConsoleColor.Black,
                captionColor);

            Console.WriteLine();
            
            Console.Out.WithColors(() =>
            {
                foreach (var data in nmrbl)
                {
                    Console.WriteLine(strFactory(data));
                }
            },
                contentColor);
        }

        public void PrintDataWithColors(
            string title,
            string joinStr,
            string content,
            ConsoleColor titleColor,
            ConsoleColor joinStrBackColor,
            ConsoleColor contentColor)
        {
            Console.Out.WithColors(
                () => Console.Write(
                    title),
                titleColor);

            Console.Out.WithColors(
                () => Console.Write(
                    joinStr),
                ConsoleColor.Black,
                joinStrBackColor);

            Console.Out.WithColors(
                () => Console.WriteLine(
                    content),
                contentColor);
        }
    }
}
