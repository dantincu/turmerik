using Acornima;
using HtmlAgilityPack;
using Jint;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Jint.Behavior;
using Turmerik.Jint.ConsoleApps;

namespace Turmerik.ScrapeWebPages.ConsoleApp
{
    public class ProgramComponent : IDisposable
    {
        private const string PROFILE_NAME_OPT_NAME = "pf";
        private const string HTML_DIR_NAME = "html";
        private const string OUTPUT_DIR_NAME = "out";

        private readonly IProgramBehaviorRetriever programBehaviorRetriever;
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly IAppEnv appEnv;
        private readonly HttpClient httpClient;

        public ProgramComponent(
            IProgramBehaviorRetriever programBehaviorRetriever,
            IConsoleArgsParser consoleArgsParser,
            IAppEnv appEnv)
        {
            this.programBehaviorRetriever = programBehaviorRetriever ?? throw new ArgumentNullException(
                nameof(programBehaviorRetriever));

            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.appEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            httpClient = new();
        }

        public void Dispose()
        {
            httpClient.Dispose();
        }

        public async Task RunAsync(string[] args)
        {
            var pgArgs = this.ParseArgs(args);
            var pgCfgWrppr = this.programBehaviorRetriever.LoadProgramConfigWrapper();

            var profile = pgCfgWrppr.Config.Profiles.Single(
                prof => prof.ProfileName == pgArgs.ProfileName);

            var jintAdapter = pgCfgWrppr.JintAdaptersMap[pgArgs.ProfileName];

            NormalizeProfile(profile);

            string componentDirPath = appEnv.GetTypePath(
                AppEnvDir.Temp, GetType());

            string outputFilePath = Path.Combine(
                componentDirPath, OUTPUT_DIR_NAME, profile.OutputFileRelPath!);

            string htmlDirPath = Path.Combine(
                componentDirPath, HTML_DIR_NAME, profile.HtmlDirRelPath!);

            foreach (var section in profile.Sections)
            {
                await LoadSectionIfReqAsync(
                    htmlDirPath, profile.BaseUrl, section);
            }

            var sectionsArr = profile.Sections.Select(
                (section, i) => new KeyValuePair<string, string>(
                    section.SectionName ?? section.BaseUrl,
                    ScrapeSection(
                        jintAdapter,
                        htmlDirPath,
                        profile.BaseUrl,
                        section,
                        [i]))).ToArray();

            string retJson = jintAdapter.Evaluate<string>(
                profile.SectionsAggFuncPath!,
                [ new ProgramBehavior.SectionsAggFuncArgs {
                        HcyPath = [],
                        SectionsArr = sectionsArr
                    } ]);

            Directory.CreateDirectory(
                Path.GetDirectoryName(
                    outputFilePath)!);

            File.WriteAllText(outputFilePath, retJson);
        }

        private ProgramComponentArgs ParseArgs(string[] rawArgs)
        {
            var pgArgs = consoleArgsParser.Parse(
                new ConsoleArgsParserOpts<ProgramComponentArgs>(rawArgs)
                {
                    ArgsBuilder = data => consoleArgsParser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<ProgramComponentArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = [],
                            FlagHandlersArr = [
                                consoleArgsParser.ArgsFlagOpts(data, [PROFILE_NAME_OPT_NAME],
                                    data => data.Args.ProfileName = data.ArgFlagValue!.Single()),
                            ]
                        })
                }).Args;

            return pgArgs;
        }

        private void NormalizeProfile(
            ProgramConfig.Profile profile)
        {
            profile.HtmlDirRelPath ??= profile.ProfileName;
            profile.OutputFileExtn ??= "json";

            profile.OutputFileRelPath ??= string.Join(
                ".", profile.ProfileName, profile.OutputFileExtn);

            foreach (var section in profile.Sections)
            {
                section.HtmlDirRelPath ??= section.SectionName ?? GetPathFromUrl(section.BaseUrl);
                section.DfSelectorsFactoryFuncPath ??= profile.DfSelectorsFactoryFuncPath;
                section.DfAggregateFuncPath ??= profile.DfAggregateFuncPath;
                section.PagesAggFuncPath ??= profile.DfPagesAggFuncPath;
                section.SubSectionsAggFuncPath ??= profile.SectionsAggFuncPath;

                NormalizeProfileSection(section);
            }
        }

        private void NormalizeProfileSection(
            ProgramConfig.Section parentSection,
            ProgramConfig.Section section)
        {
            section.HtmlDirRelPath ??= section.SectionName ?? GetPathFromUrl(section.BaseUrl);
            section.DfSelectorsFactoryFuncPath ??= parentSection.DfSelectorsFactoryFuncPath;
            section.DfAggregateFuncPath ??= parentSection.DfAggregateFuncPath;
            section.PagesAggFuncPath ??= parentSection.PagesAggFuncPath;
            section.SubSectionsAggFuncPath ??= parentSection.SubSectionsAggFuncPath;

            NormalizeProfileSection(section);
        }

        private void NormalizeProfileSection(
            ProgramConfig.Section section)
        {
            if (section.SubSections != null)
            {
                foreach (var subSection in section.SubSections)
                {
                    NormalizeProfileSection(section, subSection);
                }
            }

            foreach (var page in section.Pages)
            {
                NormalizeProfilePage(section, page);
            }
        }

        private void NormalizeProfilePage(
            ProgramConfig.Section section,
            ProgramConfig.Page page)
        {
            page.HtmlFileRelPath ??= GetDefaultHtmlFileRelPath(page);
            page.SelectorsFactoryFuncPath ??= section.DfSelectorsFactoryFuncPath;
            page.AggregateFuncPath ??= section.DfAggregateFuncPath;
        }

        private string GetDefaultHtmlFileRelPath(
            ProgramConfig.Page page)
        {
            string htmlFileRelPath = GetPathFromUrl(page.Url);

            htmlFileRelPath = Path.Combine(
                htmlFileRelPath,
                "page.html");

            return htmlFileRelPath;
        }

        private string GetPathFromUrl(
            string url)
        {
            string retUrl = url;

            try
            {
                retUrl = new Uri(url).LocalPath;
            }
            catch
            {
                retUrl = url.Split("://").Last().Split(['?', '#']).First();
            }

            return retUrl;
        }

        private string CombineUrlsIfReq(
            string? baseUrl,
            string? url)
        {
            string retUrl;

            if (baseUrl != null && url != null)
            {
                retUrl = string.Join("/", baseUrl, url);
            }
            else
            {
                retUrl = baseUrl ?? url!;
            }

            return retUrl;
        }

        private async Task LoadSectionIfReqAsync(
            string prHtmlDirPath,
            string? prBaseUrl,
            ProgramConfig.Section section)
        {
            string htmlDirPath = Path.Combine(
                prHtmlDirPath, section.HtmlDirRelPath);

            string baseUrl = CombineUrlsIfReq(
                prBaseUrl, section.BaseUrl);

            foreach (var page in section.Pages)
            {
                await LoadPageIfReqAsync(
                    htmlDirPath,
                    baseUrl,
                    page);
            }

            if (section.SubSections != null)
            {
                foreach (var subSection in section.SubSections)
                {
                    await LoadSectionIfReqAsync(
                        htmlDirPath,
                        baseUrl,
                        subSection);
                }
            }
        }

        private async Task LoadPageIfReqAsync(
            string prHtmlDirPath,
            string? prBaseUrl,
            ProgramConfig.Page page)
        {
            string htmlFilePath = Path.Combine(
                prHtmlDirPath,
                page.HtmlFileRelPath);

            string url = CombineUrlsIfReq(
                prBaseUrl, page.Url);

            Directory.CreateDirectory(
                Path.GetDirectoryName(htmlFilePath));

            if (!File.Exists(htmlFilePath))
            {
                Console.ForegroundColor = ConsoleColor.DarkCyan;
                Console.WriteLine("Fetching url:");
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.Write(url);
                Console.ResetColor();
                Console.WriteLine();
                Console.WriteLine();

                var response = await httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    string responseContent = await response.Content.ReadAsStringAsync();
                    File.WriteAllText(htmlFilePath, responseContent);
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.Write("Error fetching ");
                    Console.ForegroundColor = ConsoleColor.Cyan;
                    Console.WriteLine(url);
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.Write("STATUS CODE: ");
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.Write(response.StatusCode);
                    Console.ResetColor();
                    Console.WriteLine();
                    Console.WriteLine();

                    string errorContent = $"STATUS CODE: {response.StatusCode}";
                    File.WriteAllText(htmlFilePath, errorContent);
                }
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.DarkCyan;
                Console.WriteLine("Html file already exists:");
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.Write(htmlFilePath);
                Console.ResetColor();
                Console.WriteLine();
                Console.WriteLine();
            }
        }

        private string ScrapeSection(
            ITrmrkJintAdapter jintAdapter,
            string prHtmlDirPath,
            string? prBaseUrl,
            ProgramConfig.Section section,
            int[] hcyPath)
        {
            string htmlDirPath = Path.Combine(
                prHtmlDirPath, section.HtmlDirRelPath);

            string baseUrl = CombineUrlsIfReq(
                prBaseUrl, section.BaseUrl);

            var pagesArr = section.Pages.Select(
                (page, i) =>  new KeyValuePair<string, string>(
                    page.Url,
                    ScrapePage(
                        jintAdapter,
                        htmlDirPath,
                        baseUrl,
                        page,
                        hcyPath.AppendToArr(i)))).ToArray();

            var retJson = jintAdapter.Evaluate<string>(
                section.PagesAggFuncPath!,
                [ new ProgramBehavior.PagesAggFuncArgs {
                    HcyPath = hcyPath,
                    PagesArr = pagesArr
                } ]);

            if (section.SubSections != null)
            {
                var sectionsArr = section.SubSections.Select(
                    (subSection, i) => new KeyValuePair<string, string>(
                        subSection.SectionName ?? subSection.BaseUrl,
                        ScrapeSection(
                            jintAdapter,
                            htmlDirPath,
                            baseUrl,
                            subSection,
                            hcyPath.AppendToArr(i))));

                retJson = jintAdapter.Evaluate<string>(
                    section.SubSectionsAggFuncPath!,
                    [ new ProgramBehavior.SectionsAggFuncArgs {
                        HcyPath = hcyPath,
                        SectionsArr = [new (string.Empty, retJson), ..sectionsArr]
                    } ]);
            }

            return retJson;
        }

        private string ScrapePage(
            ITrmrkJintAdapter jintAdapter,
            string prHtmlDirPath,
            string? prBaseUrl,
            ProgramConfig.Page page,
            int[] hcyPath)
        {
            string htmlFilePath = Path.Combine(
                prHtmlDirPath,
                page.HtmlFileRelPath);

            string url = CombineUrlsIfReq(
                prBaseUrl, page.Url);

            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.WriteLine("Scraping html file:");
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write(htmlFilePath);
            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine();

            string html = File.ReadAllText(htmlFilePath);
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var selectorsArr = jintAdapter.Evaluate<string[]>(
                page.SelectorsFactoryFuncPath!,
                [ new ProgramBehavior.SelectorsFactoryArgs {
                    Url = url,
                    HcyPath = hcyPath
                } ]);

            KeyValuePair<string, string[]>[] selectedArr = selectorsArr!.Select(
                selector =>
                {
                    var nodeColl = doc.DocumentNode.SelectNodes(selector);
                    string[]? extractedArr = null;

                    if (nodeColl != null)
                    {
                        extractedArr = nodeColl.Select(
                            node => node.InnerText).ToArray();
                    }
                    
                    return new KeyValuePair<string, string[]?>(
                        selector, extractedArr);
                }).Where(kvp => kvp.Value != null).ToArray()!;

            var jsonStr = jintAdapter.Evaluate<string>(
                page.AggregateFuncPath!,
                [ new  ProgramBehavior.AggregateFuncArgs {
                    Url = url,
                    HcyPath = hcyPath,
                    SelectedArr = selectedArr
                } ]);

            return jsonStr;
        }
    }
}
