using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class FsEntryOptionsForm : Form
    {
        private FsExplorerViewModel currentFolderViewModel;
        private FsExplorerViewModel parentFolderViewModel;

        public FsEntryOptionsForm()
        {
            InitializeComponent();
            CommandsList = new List<IFsEntryOptionsCommand>();
        }

        public bool IsFolder { get; private set; }
        public bool? IsCurrentFolder => currentFolderViewModel != null;
        public string EntryName { get; private set; }

        private List<IFsEntryOptionsCommand> CommandsList { get; }

        public void SetParentFolderViewModel(FsExplorerViewModel viewModel)
        {
            this.parentFolderViewModel = viewModel;
        }

        public void SetCurrentFolderViewModel(FsExplorerViewModel viewModel)
        {
            this.currentFolderViewModel = viewModel;
            IsFolder = true;

            groupBoxSelectedFsEntryName.Text = "Current folder name";
            SetEntryName(viewModel.CurrentDirName);
        }

        public void SetIsFolder(bool isFolder)
        {
            IsFolder = isFolder;

            if (isFolder)
            {
                groupBoxSelectedFsEntryName.Text = "Selected folder name";
            }
            else
            {
                groupBoxSelectedFsEntryName.Text = "Selected file name";
            }
        }

        public void SetEntryName(string entryName)
        {
            EntryName = entryName;
            textBoxSelectedFsEntryName.Text = entryName;
        }

        public void SetCommands(List<IFsEntryOptionsCommand> commandsList = null)
        {
            CommandsList.Clear();

            if (commandsList != null)
            {
                AddCommands(commandsList.ToArray());
            }
        }

        public void AddCommands(params IFsEntryOptionsCommand[] commandsArr)
        {
            foreach (var command in commandsArr)
            {
                AddCommand(command);
            }
        }

        public void AddCommands(params FsEntryOptionsCommandMtbl[] commandsArr)
        {
            foreach (var commandMtbl in commandsArr)
            {
                var command = new FsEntryOptionsCommandImmtbl(commandMtbl);
                AddCommand(command);
            }
        }

        public void AddCommand(
            string commandName,
            Action action)
        {
            var command = new FsEntryOptionsCommandMtbl
            {
                CommandName = commandName,
                Action = action
            };

            AddCommand(command);
        }

        public void AddCommand(FsEntryOptionsCommandMtbl commandMtbl)
        {
            var command = new FsEntryOptionsCommandImmtbl(commandMtbl);
            AddCommand(command);
        }

        public void AddCommand(IFsEntryOptionsCommand command)
        {
            var button = new Button();
            button.Name = command.CommandName;

            var viewModel = currentFolderViewModel ?? parentFolderViewModel ?? throw new InvalidOperationException(
                $"Either {nameof(currentFolderViewModel)} or {nameof(parentFolderViewModel)} must be set");

            button.Click += (obj, args) =>
            {
                command.Action();
            };

            CommandsList.Add(command);
            commandsTableLayoutPanel.Controls.Add(button);
        }

        private void ButtonCopySelectedFsEntryNameToClipboard_Click(object sender, EventArgs e)
        {
            if (!parentFolderViewModel.IsRootFolder && !string.IsNullOrEmpty(textBoxSelectedFsEntryName.Text))
            {
                parentFolderViewModel.TryExecute(FsExplorerViewModel.ActionNames.CopySelectedFsEntryNameToClipboard,
                    () =>
                    {
                        Clipboard.SetText(textBoxSelectedFsEntryName.Text);
                        return new Tuple<bool, string>(true, null);
                    },
                    false);
            }
        }
    }
}
