using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.Components;
using Turmerik.Core.Helpers;
using Turmerik.WinForms.Core.Components;

namespace Turmerik.CsTypeToJson.WinForms.App
{
    public partial class MainForm : Form
    {
        private static readonly ReadOnlyCollection<string> assemblyExtensions = new string[]
        {
            ".dll", ".exe"
        }.RdnlC();

        private readonly ActionComponent actionComponent;
        private readonly ITypesStaticDataCache typesStaticDataCache;

        private Assembly assembly;

        private List<Type> allAssemblyTypes;
        private List<Type> filteredAssemblyTypes;

        public MainForm()
        {
            InitializeComponent();
            toolStripStatusLabel.Text = string.Empty;

            var actionComponentFactory = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<ActionComponentFactory>();
            actionComponent = actionComponentFactory.GetActionComponent(toolStripStatusLabel);

            typesStaticDataCache = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<ITypesStaticDataCache>();
        }

        private void textBoxAssemblyPath_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                LoadAssembly();
            }
        }

        private void buttonLoadAssembly_Click(object sender, EventArgs e)
        {
            LoadAssembly();
        }

        private void ButtonBrowseAssemblyPath_Click(object sender, EventArgs e)
        {
            if (openFileDialog.ShowDialog() == DialogResult.OK)
            {
                textBoxAssemblyPath.Text = openFileDialog.FileName;
            }
        }

        private void DataGridViewAssemblyTypes_CellMouseDoubleClick(
            object sender,
            DataGridViewCellMouseEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                OpenTypeConvertForm(e.RowIndex);
            }
        }

        private void DataGridViewAssemblyTypes_Sorted(object sender, EventArgs e)
        {
            RefreshFilteredAssemblyTypes();
        }

        private void textBoxAssemblyTypesSearch_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                string searchText = textBoxAssemblyTypesSearch.Text;

                filteredAssemblyTypes = allAssemblyTypes.Where(
                    type => type.FullName.Contains(searchText)).ToList();

                RefreshDataGridViewAssemblyTypesRowsCore();
            }
        }

        private void LoadAssembly()
        {
            actionComponent.TryExecute(() =>
            {
                string assemblyPath = textBoxAssemblyPath.Text;
                bool execute = false;
                string errorMessage = null;

                if (string.IsNullOrWhiteSpace(assemblyPath))
                {
                    errorMessage = "Path cannot be empty";
                }
                else if (!assemblyExtensions.Contains(Path.GetExtension(assemblyPath)))
                {
                    errorMessage = "Path must end with an assembly extension";
                }
                else if (!File.Exists(assemblyPath))
                {
                    errorMessage = "Path must point towards an existing file";
                }
                else
                {
                    execute = true;
                }

                if (execute)
                {
                    assembly = Assembly.LoadFrom(assemblyPath);

                    allAssemblyTypes = assembly.ExportedTypes.Select(
                        type => typesStaticDataCache.Get(type)).Where(
                        type => !type.Data.IsAbstract && type.AllConstructors.Value.Any(
                            c => c.Data.IsPublic && !c.Data.IsStatic && c.Parameters.Value.None())).Select(
                        type => type.Data).ToList();

                    allAssemblyTypes.Sort((t1, t2) => t1.FullName.CompareTo(t2.FullName));
                    filteredAssemblyTypes = allAssemblyTypes.ToList();

                    RefreshDataGridViewAssemblyTypesRowsCore();
                }

                return new Tuple<bool, string>(
                    execute, errorMessage);
            }, nameof(LoadAssembly));
        }

        private void RefreshDataGridViewAssemblyTypesRows()
        {
            actionComponent.TryExecute(
                () => RefreshDataGridViewAssemblyTypesRowsCore(),
                nameof(RefreshDataGridViewAssemblyTypesRows));
        }

        private Tuple<bool, string> RefreshDataGridViewAssemblyTypesRowsCore()
        {
            var rowsArr = filteredAssemblyTypes.Select(
                type =>
                {
                    var row = new DataGridViewRow();

                    var cell = new DataGridViewTextBoxCell
                    {
                        Value = type.FullName
                    };

                    row.Cells.Add(cell);
                    return row;
                }).ToArray();

            dataGridViewAssemblyTypes.Rows.Clear();
            dataGridViewAssemblyTypes.Rows.AddRange(rowsArr);

            return new Tuple<bool, string>(true, null);
        }

        private void RefreshFilteredAssemblyTypes()
        {
            actionComponent.TryExecute(
                () => RefreshFilteredAssemblyTypesCore(),
                nameof(RefreshFilteredAssemblyTypes),
                true, null, true);
        }

        private Tuple<bool, string> RefreshFilteredAssemblyTypesCore()
        {
            filteredAssemblyTypes = new List<Type>();

            foreach (DataGridViewRow row in dataGridViewAssemblyTypes.Rows)
            {
                string fullTypeName = row.Cells[0].Value.ToString();
                Type type = allAssemblyTypes.Single(t => t.FullName == fullTypeName);

                filteredAssemblyTypes.Add(type);
            }

            return new Tuple<bool, string>(true, null);
        }

        private void OpenTypeConvertForm(int idx)
        {
            actionComponent.TryExecute(
                () => OpenTypeConvertFormCore(idx),
                nameof(OpenTypeConvertForm));
        }

        private void OpenTypeConvertForm(Type type)
        {
            actionComponent.TryExecute(
                () => OpenTypeConvertFormCore(type),
                nameof(OpenTypeConvertForm));
        }

        private Tuple<bool, string> OpenTypeConvertFormCore(int idx)
        {
            Type type = filteredAssemblyTypes[idx];
            var retTuple = OpenTypeConvertFormCore(type);

            return retTuple;
        }

        private Tuple<bool, string> OpenTypeConvertFormCore(Type type)
        {
            var form = new TypeConvertForm();
            form.SetType(type);

            form.ShowDialog();
            return new Tuple<bool, string>(true, null);
        }
    }
}
