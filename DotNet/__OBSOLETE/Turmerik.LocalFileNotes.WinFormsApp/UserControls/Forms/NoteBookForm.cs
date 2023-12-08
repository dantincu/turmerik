using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Actions;
using Turmerik.LocalFileNotes.WinFormsApp.ViewModels;
using Turmerik.Core.UIActions;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.Helpers;
using Turmerik.WinForms.MatUIIcons;
using Turmerik.Notes.Core;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public partial class NoteBookForm : Form
    {
        private readonly IServiceProvider svcProv;
        private readonly INoteBookFormVM viewModel;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private NoteBookFormOpts opts;
        private NoteBook noteBook;

        private Action<NoteBookFormOpts> noteBookMinimized;

        public NoteBookForm()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            viewModel = svcProv.GetRequiredService<INoteBookFormVM>();
            matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();

            InitializeComponent();
        }

        public event Action<NoteBookFormOpts> NoteBookMinimized
        {
            add => noteBookMinimized += value;
            remove => noteBookMinimized -= value;
        }

        public void SetOpts(NoteBookFormOpts opts)
        {
            this.opts = opts;
            noteBook = opts.NoteBook;
            this.Text = $"Turmerik Local File Notes - {noteBook.Title}";
        }

        #region UI Event Handlers

        private void NoteBookForm_Load(object sender, EventArgs e)
        {
            svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                ).DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                {
                    StatusLabel = toolStripStatusLabelMain,
                    // DefaultForeColor = toolStripStatusLabelMain.ForeColor,
                    DefaultForeColor = Color.DarkSlateBlue,
                    WarningForeColor = Color.FromArgb(160, 96, 0),
                    ErrorForeColor = Color.DarkRed,
                };

            viewModel.OnFormLoaded();
        }

        #endregion UI Event Handlers
    }
}
