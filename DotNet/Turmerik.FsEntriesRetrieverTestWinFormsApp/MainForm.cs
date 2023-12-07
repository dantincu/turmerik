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
                NodePredicate = args => true
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
