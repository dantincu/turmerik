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

            textBoxJson.Text = json;
            textBoxPropDefs.Text = GetPropDefsStr(json);

            return new Tuple<bool, string>(true, null);
        }

        private string GetPropDefsStr(string json)
        {
            var linesList = json.Split('\n').Skip(1).ToList();
            linesList.RemoveAt(linesList.Count - 1);

            linesList = linesList.Select(GetPropDefLine).ToList();

            string propDefsStr = string.Join(
                Environment.NewLine,
                linesList);

            return propDefsStr;
        }

        private string GetPropDefLine(string jsonLine)
        {
            jsonLine = jsonLine.Trim();

            jsonLine = jsonLine.TrimStart('"');
            int dblQuoteIdx = jsonLine.IndexOf('"');

            string propName = jsonLine.Substring(0, dblQuoteIdx);
            string propValue = jsonLine.Substring(dblQuoteIdx + 2);

            propValue = propValue.TrimEnd(',');

            string propDefStr = string.Concat(propName, " = ", propValue, ";");
            return propDefStr;
        }
    }
}
