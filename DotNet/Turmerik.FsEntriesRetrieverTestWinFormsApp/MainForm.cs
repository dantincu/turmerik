using Microsoft.Extensions.DependencyInjection;
using System.Collections.ObjectModel;
using Turmerik.Core.Actions;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Logging;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.FsEntriesRetrieverTestWinFormsApp
{
    public partial class MainForm : Form
    {
        private static readonly Color editModeForeColor = Color.DarkSlateBlue;

        private static readonly ReadOnlyCollection<char> invalidWilcardFilePathChars = Path.GetInvalidPathChars().Except(['*']).RdnlC();
        private static readonly ReadOnlyCollection<char> invalidWilcardFileNameChars = Path.GetInvalidFileNameChars().Except(['*', '/', '\\']).RdnlC();

        private readonly string[] progArgs;

        private readonly ServiceProviderContainer svcProvContnr;
        private readonly IServiceProvider svcProv;
        private readonly IAppLogger logger;
        private readonly IFsEntriesRetriever fsEntriesRetriever;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;
        private readonly IWinFormsActionComponentCreator actionComponentCreator;
        private readonly IWinFormsStatusLabelActionComponent actionComponent;
        private readonly FsEntriesTreeViewAdapter fsEntriesTreeViewAdapter;

        private readonly EditableTextBoxAdapter rootFolderPathTextBoxAdapter;
        private readonly EditableTextBoxAdapter pathFiltersTextBoxAdapter;

        private string[][] pathFilters;

        public MainForm(string[] args)
        {
            progArgs = args;
            svcProvContnr = ServiceProviderContainer.Instance.Value;
            svcProv = svcProvContnr.Data;
            logger = svcProv.GetRequiredService<IAppLoggerCreator>().GetSharedAppLogger(GetType());
            fsEntriesRetriever = svcProv.GetRequiredService<IFsEntriesRetriever>();
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

            pathFiltersTextBoxAdapter = new EditableTextBoxAdapter(new EditableTextBoxAdapterOpts
            {
                TextBox = textBoxPathFilters,
                EditModeForeColorFactory = color => editModeForeColor
            });

            rootFolderPathTextBoxAdapter.TextUpdated += RootFolderPathTextUpdated;
            pathFiltersTextBoxAdapter.TextUpdated += PathFiltersTextUpdated;

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

            var foldersHcy = fsEntriesRetriever.Retrieve(new FsEntriesRetrieverOptions
            {
                RootDirPath = rootFolderPathTextBoxAdapter.Text,
            }).RootNodes;

            fsEntriesTreeViewAdapter.AddTreeViewNodes(
                treeViewMain, foldersHcy);
        }

        #region UI Event Handlers

        private void MainForm_Load(object sender, EventArgs e) => actionComponent.Execute(new WinFormsActionOpts<int>
        {
            Action = () =>
            {
                RefreshMainTreeView();
                return ActionResultH.Create(0);
            }
        });

        private void PathFiltersTextUpdated(
            string newPathFilters) => actionComponent.Execute(
                new WinFormsActionOpts<int>
                {
                    Action = () =>
                    {
                        this.treeViewMain.Nodes.Clear();

                        pathFilters = newPathFilters.Split(
                            '/'.Arr('\\'), StringSplitOptions.RemoveEmptyEntries).Select(
                                pathSegment => pathSegment.Split('*')).ToArray();

                        var invalidPathCharKvp = newPathFilters.FirstKvp(
                            (c, i) => invalidWilcardFileNameChars.Contains(c));

                        if (invalidPathCharKvp.Key >= 0)
                        {
                            throw new InvalidOperationException(
                                $"The path filter cannot contain invalid path chars like {invalidPathCharKvp.Value}");
                        }

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
