using Markdig;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;
using Turmerik.Html;
using Turmerik.Md;

namespace Turmerik.NetCore.ConsoleApps.MkFsDirPairs
{
    public class PdfCreator
    {
        private readonly object syncLock = new object();

        private readonly INoteMdParser nmdParser;
        private readonly ITimeStampHelper timeStampHelper;
        private readonly IHtmlToPdfConverter htmlToPdfConverter;
        private readonly Opts opts;

        private Thread thread;

        public PdfCreator(
            INoteMdParser nmdParser,
            ITimeStampHelper timeStampHelper,
            IHtmlToPdfConverter htmlToPdfConverter,
            Opts opts)
        {
            this.nmdParser = nmdParser ?? throw new ArgumentNullException(
                nameof(nmdParser));

            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(
                nameof(timeStampHelper));

            this.htmlToPdfConverter = htmlToPdfConverter ?? throw new ArgumentNullException(
                nameof(htmlToPdfConverter));

            this.opts = opts ?? throw new ArgumentNullException(
                nameof(opts));
        }

        public async Task TryCreatePdfIfNotBusy()
        {
            Thread thread;

            lock (syncLock)
            {
                thread = this.thread;
            }

            if (thread != null)
            {
                await Task.Run(() => thread.Join());
            }
            else
            {
                this.thread = thread = new(() =>
                {
                    TryCreatePdf().Wait();
                    this.thread = null;
                });

                thread.Start();
                await Task.Run(() => thread.Join());
            }
        }

        public async Task TryCreatePdf()
        {
            Console.ForegroundColor = ConsoleColor.Cyan;

            Console.WriteLine($"Refreshing pdf file {timeStampHelper.TmStmp(
                null, true, TimeStamp.Ticks, false, false, true)}");

            Console.ResetColor();

            await ConsoleH.TryExecuteAsync(async () =>
            {
                string md = File.ReadAllText(opts.MdFilePath);
                string html = Markdown.ToHtml(md);

                string htmlFileName = string.Join(".", opts.MdFile.Name, "html");
                string pdfFileName = string.Join(".", opts.MdFile.Name, "pdf");

                string htmlFilePath = Path.Combine(
                    opts.ShortNameDir.Idnf,
                    htmlFileName);

                string pdfFilePath = Path.Combine(
                    opts.ShortNameDir.Idnf,
                    pdfFileName);

                File.WriteAllText(htmlFilePath, html);

                await htmlToPdfConverter.ConvertHtmlFileAsync(
                    htmlFilePath,
                    pdfFilePath);

                if (nmdParser.IsTrivialDoc(md))
                {
                    File.Delete(htmlFilePath);
                }
            }, false);

            Console.ForegroundColor = ConsoleColor.Cyan;

            Console.WriteLine($"Pdf file refreshed {timeStampHelper.TmStmp(
                null, true, TimeStamp.Ticks, false, false, true)}");

            Console.ResetColor();
        }

        public class Opts
        {
            public DriveItemX? ShortNameDir { get; init; }
            public string MdFilePath { get; init; }
            public DriveItemX? MdFile { get; init; }
        }
    }

    public class PdfCreatorFactory
    {
        private readonly INoteMdParser nmdParser;
        private readonly ITimeStampHelper timeStampHelper;
        private readonly IHtmlToPdfConverter htmlToPdfConverter;

        public PdfCreatorFactory(
            INoteMdParser nmdParser,
            ITimeStampHelper timeStampHelper,
            IHtmlToPdfConverter htmlToPdfConverter)
        {
            this.nmdParser = nmdParser ?? throw new ArgumentNullException(
                nameof(nmdParser));

            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(
                nameof(timeStampHelper));

            this.htmlToPdfConverter = htmlToPdfConverter ?? throw new ArgumentNullException(
                nameof(htmlToPdfConverter));
        }

        public PdfCreator Creator(
            PdfCreator.Opts opts) => new(
                nmdParser,
                timeStampHelper,
                htmlToPdfConverter,
                opts);
    }
}
