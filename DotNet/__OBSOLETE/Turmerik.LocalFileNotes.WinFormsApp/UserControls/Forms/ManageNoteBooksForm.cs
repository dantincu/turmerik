using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.LocalFileNotes.WinFormsApp.ViewModels;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.MatUIIcons;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public partial class ManageNoteBooksForm : Form
    {
        private readonly IServiceProvider svcProv;
        private readonly IManageNoteBooksFormVM viewModel;
        private readonly IMatUIIconsRetriever matUIIconsRetriever;

        private AppOptionsImmtbl appOpts;

        private Action<NoteBookFormOpts> noteBookChosen;

        public ManageNoteBooksForm()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            viewModel = svcProv.GetRequiredService<IManageNoteBooksFormVM>();
            matUIIconsRetriever = svcProv.GetRequiredService<IMatUIIconsRetriever>();
            appOpts = svcProv.GetRequiredService<AppOptionsRetriever>().Data;

            InitializeComponent();
        }

        public event Action<NoteBookFormOpts> NoteBookChosen
        {
            add => noteBookChosen += value;
            remove => noteBookChosen -= value;
        }

        #region UI Event Handlers

        private void ManageNoteBooksForm_Load(object sender, EventArgs e)
        {
            svcProv.GetRequiredService<IWinFormsActionComponentCreator>(
                ).DefaultStatusLabelOpts = new WinFormsStatusLabelActionComponentOpts
                {
                    StatusLabel = null,
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
