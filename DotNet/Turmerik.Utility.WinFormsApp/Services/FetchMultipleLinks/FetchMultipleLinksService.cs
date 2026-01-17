using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextParsing.Md;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks
{
    public class FetchMultipleLinksService
    {
        private static readonly Regex urlRegex = new Regex(@"^[a-zA-Z]+://[^/]");

        private static readonly Regex timeStampStrRegex = new(
            @"^[0-9]{4}\-[0-9]{2}\-[0-9]{2}_[0-9]{2}\-[0-9]{2}(\-[0-9]{2})?(_[0-9]{3})?$");

        private readonly IFetchMultipleLinksDataContainer fetchMultipleLinksDataContainer;
        private readonly IJsonConversion jsonConversion;

        private readonly string fetchMultipleLinksInputTextFilePath;
        private readonly string fetchMultipleLinksItemsDirPath;

        public FetchMultipleLinksService(
            IFetchMultipleLinksDataContainer fetchMultipleLinksDataContainer,
            IJsonConversion jsonConversion)
        {
            this.fetchMultipleLinksDataContainer = fetchMultipleLinksDataContainer ?? throw new ArgumentNullException(
                nameof(fetchMultipleLinksDataContainer));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            fetchMultipleLinksInputTextFilePath = Path.Combine(
                fetchMultipleLinksDataContainer.JsonDirPath,
                FetchMultipleLinksH.INPUT_TEXT_FILE_NAME);

            fetchMultipleLinksItemsDirPath = Path.Combine(
                fetchMultipleLinksDataContainer.JsonDirPath,
                FetchMultipleLinksH.ITEMS_DIR_NAME);
        }

        public ReadOnlyCollection<UrlScript> UrlScripts { get; } = new UrlScript[]
        {
            new()
            {
                IsTimeStampStr = true,
                Factory = (args) => new ([GetTimeStampTextPart(args)])
            },
            new()
            {
                IsText = true,
                Factory = (args) => new ([GetTextTextPart(args)])
            },
            new()
            {
                IsTitle = true,
                Factory = (args) => new ([GetTitleTextPart(args, false)])
            },
            new()
            {
                IsUrl = true,
                Factory = (args) => new ([GetUrlTextPart(args)])
            },
            new()
            {
                Factory = (args) => new ([GetRedirectedUrlTextPart(args)])
            },
            new()
            {
                Factory = (args) => new ([
                        GetSpecialTokensTextPart(":"),
                        GetTimeStampTextPart(args),
                        GetSpecialTokensTextPart(":"),
                        GetUrlTextPart(args),
                        GetSpecialTokensTextPart(":"),
                        GetTitleTextPart(args, false)
                    ])
            },
            new()
            {
                Factory = (args) => new ([
                        GetSpecialTokensTextPart(":"),
                        GetTimeStampTextPart(args),
                        GetSpecialTokensTextPart(":"),
                        GetRedirectedUrlTextPart(args),
                        GetSpecialTokensTextPart(":"),
                        GetTitleTextPart(args, false)
                    ])
            },
            new()
            {
                Factory = (args) => new ([
                    GetSpecialTokensTextPart(@""":t:"),
                    GetTitleTextPart(NormalizeTitle(args, false).Replace(
                        "&", "&&").Replace(
                        "\"", "\"\"").Replace(
                        ":", "::")),
                    GetSpecialTokensTextPart(@""" "":url:"),
                    GetUrlTextPart(args),
                    GetSpecialTokensTextPart(@"""")])
            },
            new()
            {
                Factory = (args) => new ([
                    GetSpecialTokensTextPart(@""":t:"),
                    GetTitleTextPart(NormalizeTitle(args, false).Replace(
                        "&", "&&").Replace(
                        "\"", "\"\"").Replace(
                        ":", "::")),
                    GetSpecialTokensTextPart(@""" "":url:"),
                    GetRedirectedUrlTextPart(args),
                    GetSpecialTokensTextPart(@"""")])
            },
            new()
            {
                Factory = (args) => new (
                    GetSpecialTokensTextPart("[").Arr(
                    GetTitleTextPart(args, true),
                    GetSpecialTokensTextPart("]("),
                    GetUrlTextPart(args),
                    GetSpecialTokensTextPart(")")))
            },
            new()
            {
                Factory = (args) => new (
                    GetSpecialTokensTextPart("[").Arr(
                    GetTitleTextPart(args, true),
                    GetSpecialTokensTextPart("]("),
                    GetRedirectedUrlTextPart(args),
                    GetSpecialTokensTextPart(")")))
            },
            new()
            {
                Factory = (args) => new (
                    GetSpecialTokensTextPart("<").Arr(
                    GetKeyWordTextPart("u"),
                    GetSpecialTokensTextPart(">"),
                    GetTimeStampTextPart(args),
                    GetSpecialTokensTextPart("</"),
                    GetKeyWordTextPart("u"),
                    GetSpecialTokensTextPart(">"),
                    GetTextTextPart(": "),
                    GetSpecialTokensTextPart("["),
                    GetTitleTextPart(args, true),
                    GetSpecialTokensTextPart("]("),
                    GetUrlTextPart(args),
                    GetSpecialTokensTextPart(")")))
            },
            new()
            {
                Factory = (args) => new (
                    GetSpecialTokensTextPart("<").Arr(
                    GetKeyWordTextPart("u"),
                    GetSpecialTokensTextPart(">"),
                    GetTimeStampTextPart(args),
                    GetSpecialTokensTextPart("</"),
                    GetKeyWordTextPart("u"),
                    GetSpecialTokensTextPart(">"),
                    GetTextTextPart(": "),
                    GetSpecialTokensTextPart("["),
                    GetTitleTextPart(args, true),
                    GetSpecialTokensTextPart("]("),
                    GetRedirectedUrlTextPart(args),
                    GetSpecialTokensTextPart(")")))
            },
        }.Select((item, i) => new UrlScript(item)
        {
            Index = i
        }).RdnlC();

        public void DeleteSerializedLinks()
        {
            Directory.CreateDirectory(fetchMultipleLinksItemsDirPath);
            File.Delete(fetchMultipleLinksInputTextFilePath);
            Directory.Delete(fetchMultipleLinksItemsDirPath, true);
            fetchMultipleLinksDataContainer.Delete();
        }

        public void SerializeLinks(string inputText)
        {
            Directory.CreateDirectory(fetchMultipleLinksItemsDirPath);
            File.WriteAllText(fetchMultipleLinksInputTextFilePath, inputText);
            var itemsList = ParseInputText(inputText);

            foreach (var item in itemsList)
            {
                File.WriteAllText(
                    Path.Combine(
                        fetchMultipleLinksItemsDirPath,
                        string.Format(
                            FetchMultipleLinksH.ITEM_FILE_NAME_TPL,
                            item.ItemIdx)),
                    jsonConversion.Adapter.Serialize(item));
            }

            fetchMultipleLinksDataContainer.Update(mtbl => new FetchMultipleLinksDataMtbl
            {
                CurrentItemIdx = itemsList.Last().ItemIdx,
                ItemsCount = itemsList.Count,
                IsSetUp = true
            });
        }

        public List<FetchLinkDataItemCoreMtbl> LoadSerializedLinks()
        {
            string[] jsonFilePathsArr = Directory.GetFiles(fetchMultipleLinksItemsDirPath);
            var retList = jsonFilePathsArr.Select(LoadSerializedLink).ToList();
            return retList;
        }

        public FetchLinkDataItemCoreMtbl LoadSerializedLink(
            FetchLinkDataItemCoreMtbl item) => LoadSerializedLink(
                Path.Combine(
                    fetchMultipleLinksItemsDirPath,
                    string.Format(
                        FetchMultipleLinksH.ITEM_FILE_NAME_TPL,
                        item.ItemIdx)));

        #region Private Static Methods

        private static UrlScriptTextPart GetSpecialTokensTextPart(
            string tokens) => tokens.ToTextPart(
                FontStyle.Bold,
                Color.White,
                Color.Black);

        private static UrlScriptTextPart GetKeyWordTextPart(
            string keyWord) => keyWord.ToTextPart(
                FontStyle.Bold,
                Color.White,
                Color.Blue);

        private static UrlScriptTextPart GetTimeStampTextPart(
            UrlScriptArgs args) => GetTimeStampTextPart(
                args.TimeStampStr ?? string.Empty);

        private static UrlScriptTextPart GetTimeStampTextPart(
            string text) => text.ToTextPart(
                FontStyle.Italic, Color.FromArgb(255, 0, 0, 0), Color.White);

        private static UrlScriptTextPart GetTextTextPart(
            UrlScriptArgs args) => GetTextTextPart(
                args.Text ?? string.Empty);

        private static UrlScriptTextPart GetTextTextPart(
            string text) => text.ToTextPart(
                FontStyle.Regular, Color.FromArgb(255, 0, 0, 0), Color.White);

        private static UrlScriptTextPart GetTitleTextPart(
            UrlScriptArgs args, bool encode) => GetTitleTextPart(NormalizeTitle(args.Title, encode));

        private static UrlScriptTextPart GetTitleTextPart(
            string title) => title.ToTextPart(
                FontStyle.Bold, Color.FromArgb(255, 255, 0, 0), Color.White);

        private static UrlScriptTextPart GetUrlTextPart(
            UrlScriptArgs args) => GetUrlTextPart(args.Url);

        private static UrlScriptTextPart GetUrlTextPart(
            string url) => url.ToTextPart(
                FontStyle.Underline, Color.Blue, Color.White);

        private static UrlScriptTextPart GetRedirectedUrlTextPart(
            UrlScriptArgs args) => GetRedirectedUrlTextPart(args.RedirectedUrl ?? "");

        private static UrlScriptTextPart GetRedirectedUrlTextPart(
            string url) => url.ToTextPart(
                FontStyle.Underline, Color.FromArgb(255, 0, 128, 128), Color.White);

        private static string NormalizeTitle(
            UrlScriptArgs args, bool encode) => NormalizeTitle(
                args.Title, encode);

        private static string NormalizeTitle(
            string title, bool encode) => string.Join(" ",
                (encode ? MdH.EncodeForMd(title) : title).Split(['\n', '\r', '\t', ' '], StringSplitOptions.RemoveEmptyEntries));

        #endregion Private Static Methods

        private List<FetchLinkDataItemCoreMtbl> ParseInputText(string inputText)
        {
            var itemsList = new List<FetchLinkDataItemCoreMtbl>();
            var partsList = new List<string>();
            var part = new List<char>();
            bool prevCharIsWhitespace = true;
            int itemIdx = 1;

            Func<string> onPartEnded = () =>
            {
                var partStr = new string(part.ToArray());
                part.Clear();
                return partStr;
            };

            Action onCharIsWhiteSpace = () => (!prevCharIsWhitespace).ActIf(() =>
            {
                var partStr = onPartEnded();

                if (urlRegex.IsMatch(partStr))
                {
                    if (partsList.Any())
                    {
                        partsList.RemoveAt(partsList.Count - 1);
                    }

                    string? timeStampStr = null;

                    if (partsList.Any())
                    {
                        var lastLine = partsList.Last();

                        if (timeStampStrRegex.IsMatch(
                            lastLine))
                        {
                            timeStampStr = lastLine;
                            partsList.RemoveAt(partsList.Count - 1);
                        }
                    }

                    itemsList.Add(new FetchLinkDataUrlItemMtbl
                    {
                        ItemIdx = itemIdx++,
                        Url = partStr,
                        UrlText = partsList.Any() ? string.Concat(partsList) : null,
                        TimeStampStr = timeStampStr
                    });

                    partsList.Clear();
                }
                else
                {
                    partsList.Add(partStr);
                }
            });

            Action onCharIsNotWhiteSpace = () => prevCharIsWhitespace.ActIf(() =>
            {
                var partStr = onPartEnded();

                if (partsList.Any())
                {
                    partsList.Add(partStr);
                }
            });

            for (int i = 0; i < inputText.Length; i++)
            {
                var chr = inputText[i];

                prevCharIsWhitespace = char.IsWhiteSpace(chr).ActIf(
                    onCharIsWhiteSpace,
                    onCharIsNotWhiteSpace);

                part.Add(chr);
            }

            onCharIsWhiteSpace();
            return itemsList;
        }

        private FetchLinkDataItemCoreMtbl LoadSerializedLink(
            string filePath)
        {
            var json = File.ReadAllText(filePath);
            var item = jsonConversion.Adapter.Deserialize<FetchLinkDataUrlItemMtbl>(json);
            return item;
        }
    }
}
