using Microsoft.Extensions.DependencyInjection;
using System.Collections.ObjectModel;
using System.Xml.Linq;
using Turmerik.Core.Actions;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Logging;
using Turmerik.Core.Utility;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.FsEntriesRetrieverTestWinFormsApp
{
    public partial class MainForm : Form
    {
        private static readonly Color editModeForeColor = Color.DarkSlateBlue;

        private static readonly ReadOnlyCollection<char> invalidWilcardFilePathChars = Path.GetInvalidPathChars().Except(['*']).RdnlC();
        private static readonly ReadOnlyCollection<char> invalidWilcardFileNameChars = Path.GetInvalidFileNameChars().Except(['*', ':', ';', '/', '\\']).RdnlC();

        private readonly string[] progArgs;

        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IAppLogger logger;
        private readonly IFsEntriesRetriever fsEntriesRetriever;
        private readonly IStrPartsMatcher strPartsMatcher;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;
        private readonly IWinFormsActionComponentCreator actionComponentCreator;
        private readonly IWinFormsStatusLabelActionComponent actionComponent;
        private readonly FsEntriesTreeViewAdapter fsEntriesTreeViewAdapter;

        private readonly EditableTextBoxAdapter rootFolderPathTextBoxAdapter;
        private readonly EditableTextBoxAdapter includedPathsTextBoxAdapter;
        private readonly EditableTextBoxAdapter excludedPathsTextBoxAdapter;

        private string[][][] includedPaths;
        private string[][][] excludedPaths;

        public MainForm(string[] args)
        {
            progArgs = args;
            svcProvContnr = ServiceProviderContainer.Instance.Value;
            svcProv = svcProvContnr.Data;
            logger = svcProv.GetRequiredService<IAppLoggerCreator>().GetSharedAppLogger(GetType());
            fsEntriesRetriever = svcProv.GetRequiredService<IFsEntriesRetriever>();
            strPartsMatcher = svcProv.GetRequiredService<IStrPartsMatcher>();
            matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
            actionComponentCreator = svcProv.GetRequiredService<IWinFormsActionComponentCreator>();
            actionComponent = actionComponentCreator.StatusLabel(GetType());
            fsEntriesTreeViewAdapter = svcProv.GetRequiredService<FsEntriesTreeViewAdapter>();

            InitializeComponent();

            rootFolderPathTextBoxAdapter = new EditableTextBoxAdapter(new EditableTextBoxAdapterOpts
            {
                TextBox = textBoxRootFolderPath,
                InitialText = Path.GetFullPath(
                    progArgs.FirstOrDefault() ?? Directory.GetCurrentDirectory()),
                EditModeForeColorFactory = color => editModeForeColor
            });

            includedPathsTextBoxAdapter = new EditableTextBoxAdapter(new EditableTextBoxAdapterOpts
            {
                TextBox = textBoxIncludedPaths,
                EditModeForeColorFactory = color => editModeForeColor
            });

            excludedPathsTextBoxAdapter = new EditableTextBoxAdapter(new EditableTextBoxAdapterOpts
            {
                TextBox = textBoxExcludedPaths,
                EditModeForeColorFactory = color => editModeForeColor
            });

            rootFolderPathTextBoxAdapter.TextUpdated += RootFolderPathTextUpdated;
            includedPathsTextBoxAdapter.TextUpdated += IncludedPathsTextUpdated;
            excludedPathsTextBoxAdapter.TextUpdated += ExcludedPathsTextUpdated;

            includedPaths = [];
            excludedPaths = [];

            if (svcProvContnr.IsRegistered)
            {
                actionComponentCreator.DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                {
                    StatusLabel = toolStripStatusLabelMain,
                    DefaultForeColor = Color.Black,
                    WarningForeColor = Color.FromArgb(160, 96, 0),
                    ErrorForeColor = Color.FromArgb(192, 0, 0),
                };
            }
        }

        public MainForm() : this([])
        {
        }

        private void RefreshMainTreeView()
        {
            this.treeViewMain.Nodes.Clear();

            var nodesMap = new Dictionary<FsEntriesRetrieverNodeData, FilteredFsNode>();

            var foldersHcy = fsEntriesRetriever.Retrieve(new FsEntriesRetrieverOptions
            {
                RootDirPath = rootFolderPathTextBoxAdapter.Text,
                FsEntryPredicate = (args, node, idx) =>
                {
                    var parent = args.Current;
                    
                    IEnumerable<string[][]> potentialInlcuders;
                    IEnumerable<string[][]> potentialExcluders;

                    if (parent == null)
                    {
                        potentialInlcuders = includedPaths;
                        potentialExcluders = excludedPaths;
                    }
                    else
                    {
                        var filteredParent = nodesMap[parent.Data.Value];
                        potentialInlcuders = filteredParent.MatchingIncluders;
                        potentialExcluders = filteredParent.MatchingExcluders;
                    }

                    bool matches = true;

                    Func<string[][], bool> filterMatchPredicate = filter => strPartsMatcher.Matches(
                        new StrPartsMatcherOptions
                        {
                            InputStr = node.Name,
                            StringComparison = StringComparison.InvariantCultureIgnoreCase,
                            StrParts = filter[args.LevelIdx]
                        });

                    Func<string[][], bool> filterLevelPredicate;

                    if (node.IsFolder != true)
                    {
                        filterLevelPredicate = filter => filter.Length - args.LevelIdx == 1;
                    }
                    else
                    {
                        filterLevelPredicate = filter => filter.Length - args.LevelIdx >= 1;
                    }

                    Func<string[][], bool> filterPredicate = filter => (
                        filter.Length - args.LevelIdx < 1) || (filterLevelPredicate(
                        filter) && filterMatchPredicate(filter));

                    potentialInlcuders = potentialInlcuders.Where(filterPredicate).ToArray();
                    matches = potentialInlcuders.Any();

                    if (matches)
                    {
                        potentialExcluders = potentialExcluders.Where(filterPredicate).ToArray();
                        matches = potentialExcluders.None();
                    }

                    if (matches)
                    {
                        var filteredFsNode = new FilteredFsNode(node);

                        filteredFsNode.MatchingIncluders.AddRange(potentialInlcuders);
                        filteredFsNode.MatchingExcluders.AddRange(potentialExcluders);

                        nodesMap.Add(node, filteredFsNode);
                    }

                    return matches;
                },
                NodePredicate = args => true,
                OnNodeChildrenIterated = (args, node) =>
                {
                    var treeNode = (args.Next ?? args.Current);
                    bool matches = treeNode.ChildNodes.Any();

                    if (!matches)
                    {
                        var filtered = nodesMap[node.Value];

                        matches = filtered.MatchingIncluders.Any(
                            includer => includer.Length - node.Value.LevelIdx == 1);

                        matches = matches && filtered.MatchingExcluders.None(
                            excluder => excluder.Length - node.Value.LevelIdx == 1);
                    }

                    return matches;
                }
            }).RootNodes;

            fsEntriesTreeViewAdapter.AddTreeViewNodes(
                treeViewMain, foldersHcy);
        }

        private string[][][] GetPathFilter(
            string newPathFilters)
        {
            var newFilter = newPathFilters.Split(';'.Arr(),
                StringSplitOptions.RemoveEmptyEntries).Select(
                    path => path.Split('/'.Arr('\\'),
                        StringSplitOptions.RemoveEmptyEntries).Select(
                            pathSegment => pathSegment.Split(
                                '*')).ToArray()).ToArray();

            var invalidPathCharKvp = newPathFilters.FirstKvp(
                (c, i) => invalidWilcardFileNameChars.Contains(c));

            if (invalidPathCharKvp.Key >= 0)
            {
                throw new InvalidOperationException(
                    $"The path filter cannot contain invalid path chars like {invalidPathCharKvp.Value}");
            }

            return newFilter;
        }

        #region UI Event Handlers

        private void MainForm_Load(object sender, EventArgs e)
        {
            includedPathsTextBoxAdapter.SetText(
                progArgs.Skip(1).FirstOrDefault() ?? "*");
        }

        private void IncludedPathsTextUpdated(
            string newPathFilters) => actionComponent.Execute(
                new WinFormsActionOpts<int>
                {
                    Action = () =>
                    {
                        this.treeViewMain.Nodes.Clear();
                        includedPaths = GetPathFilter(newPathFilters);

                        RefreshMainTreeView();
                        return ActionResultH.Create(0);
                    }
                });

        private void ExcludedPathsTextUpdated(
            string newPathFilters) => actionComponent.Execute(
                new WinFormsActionOpts<int>
                {
                    Action = () =>
                    {
                        this.treeViewMain.Nodes.Clear();
                        excludedPaths = GetPathFilter(newPathFilters);

                        RefreshMainTreeView();
                        return ActionResultH.Create(0);
                    }
                });

        private void RootFolderPathTextUpdated(
            string newRootFolderPath) => actionComponent.Execute(
                new WinFormsActionOpts<int>
                {
                    Action = () =>
                    {
                        this.treeViewMain.Nodes.Clear();

                        RefreshMainTreeView();
                        return ActionResultH.Create(0);
                    }
                });

        #endregion UI Event Handlers
    }
}
