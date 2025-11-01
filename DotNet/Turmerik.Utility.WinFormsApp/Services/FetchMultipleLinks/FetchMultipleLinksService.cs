using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks
{
    public class FetchMultipleLinksService
    {
        private static readonly Regex urlRegex = new Regex(@"^[a-zA-Z]+://[^/]");

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
                Factory = (url, title) => title
            },
            new()
            {
                Factory = (url, title) => url
            },
            new()
            {
                Factory = (url, title) => $":{url}:{title}"
            },
            new()
            {
                Factory = (url, title) => string.Join(" ",
                    title.Split(['\n', '\r', '\t'], StringSplitOptions.RemoveEmptyEntries)).Replace(
                        "&", "&amp;").Replace(
                        "\\", "\\\\").Replace(
                        "[", "\\[").Replace(
                        "]", "\\]").With(
                    title => $"[{title}]({url})")
            },
            new()
            {
                Factory = (url, title) => string.Join(" ",
                    title.Split(['\n', '\r', '\t'], StringSplitOptions.RemoveEmptyEntries)).Replace(
                        "&", "&&").Replace(
                        "\"", "\"\"").Replace(
                        ":", "::").With(
                    title =>  $"\":url:{url}\" \":t:{title}\"")
            }
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

                        itemsList.Add(new FetchLinkDataTextItemMtbl
                        {
                            IsUrl = false,
                            ItemIdx = itemIdx++,
                            Text = string.Concat(partsList),
                        });

                        partsList.Clear();
                    }

                    itemsList.Add(new FetchLinkDataUrlItemMtbl
                    {
                        ItemIdx = itemIdx++,
                        Text = partStr,
                        Url = partStr,
                    });
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
            var item = jsonConversion.Adapter.Deserialize<FetchLinkDataItemCoreMtbl>(json);

            if (item.IsUrl == false)
            {
                item = jsonConversion.Adapter.Deserialize<FetchLinkDataTextItemMtbl>(json);
            }
            else
            {
                item = jsonConversion.Adapter.Deserialize<FetchLinkDataUrlItemMtbl>(json);
            }

            return item;
        }
    }
}
