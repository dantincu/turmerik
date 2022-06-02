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
using Turmerik.Core.Helpers;
using Turmerik.WinForms.Core.Components;

namespace Turmerik.CsTypeToJson.WinForms.App
{
    public partial class TypeConvertForm : Form
    {
        private readonly ActionComponent actionComponent;

        private Type type;

        public TypeConvertForm()
        {
            InitializeComponent();

            var actionComponentFactory = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<ActionComponentFactory>();
            actionComponent = actionComponentFactory.GetActionComponent(toolStripStatusLabel);
        }

        public void SetType(Type type)
        {
            this.type = type;
            GenerateJson();
        }

        private void ButtonGenerate_Click(object sender, EventArgs e)
        {
            GenerateJson();
        }

        private void GenerateJson()
        {
            actionComponent.TryExecute(
                () => GenerateJsonCore(),
                nameof(GenerateJson));
        }

        private Tuple<bool, string> GenerateJsonCore()
        {
            object obj = Activator.CreateInstance(type);
            string json = JsonSrlzH.ToJson(obj);

            textBoxTypeJson.Text = json;
            return new Tuple<bool, string>(true, null);
        }
    }
}
