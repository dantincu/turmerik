using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Code.Core;
using Turmerik.Core.TextSerialization;

namespace Turmerik.ScrapeMatIconPage.ConsoleApp
{
    public class ProgramComponent
    {
        private const string INPUT_HTML_FILE_NAME = "Material Symbols and Icons - Google Fonts - freeformatter-out.html";
        private const string OUTPUT_JSON_FILE_NAME = "Material Symbols and Icons - Google Fonts - output.json";
        private const string OUTPUT_CS_FILE_NAME = "Material Symbols and Icons - Google Fonts - output.cs";
        private const string TAB = "    ";

        private static readonly string nwLn = Environment.NewLine;

        private readonly IJsonConversion jsonConversion;
        private readonly INameToIdnfConverter nameToIdnfConverter;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            INameToIdnfConverter nameToIdnfConverter)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.nameToIdnfConverter = nameToIdnfConverter ?? throw new ArgumentNullException(
                nameof(nameToIdnfConverter));
        }

        public void Run(string[] args)
        {
            var doc = new HtmlDocument();
            doc.Load(INPUT_HTML_FILE_NAME);

            var data = new MatIconsContainer
            {
                GroupsList = new List<MatIconsGroup>()
            };

            string xpath = string.Join("/",
                "//gf-root",
                "div[@class='has-secondary-nav']",
                "mat-sidenav-container",
                "mat-sidenav-content",
                "div[@class='gf-full-page']",
                "div[@class='router-outlet-container ng-star-inserted']",
                "gf-icons",
                "main",
                "icons-page",
                "icons-group");

            var htmlNodes = doc.DocumentNode.SelectNodes(xpath);

            foreach (var node in htmlNodes)
            {
                var iconGroup = GetIconsGroup(node);

                if (iconGroup != null)
                {
                    data.GroupsList.Add(iconGroup);
                }
            }

            string json = jsonConversion.Adapter.Serialize(data);
            File.WriteAllText(OUTPUT_JSON_FILE_NAME, json);

            string csCode = GenerateCsCode(data);
            File.WriteAllText(OUTPUT_CS_FILE_NAME, csCode);
        }

        private MatIconsGroup GetIconsGroup(HtmlNode htmlNode)
        {
            MatIconsGroup matIconsGroup = null;

            var h2Node = htmlNode.DescendantNodes().SingleOrDefault(
                node => node.Name == "h2");

            if (h2Node != null)
            {
                matIconsGroup = new MatIconsGroup
                {
                    GroupName = h2Node.InnerText,
                    IconsList = new List<MatIcon>()
                };

                string xpath = string.Join("/",
                    "div[@class='icons-container']",
                    "button[@_nghost-ng-c3185801507]");

                var iconNodes = htmlNode.SelectNodes(xpath);

                foreach (var node in  iconNodes)
                {
                    var icon = GetIcon(node);

                    if (icon != null)
                    {
                        matIconsGroup.IconsList.Add(icon);
                    }
                }
            }

            return matIconsGroup;
        }

        private MatIcon GetIcon(HtmlNode htmlNode)
        {
            MatIcon icon = null;

            var arialLabelAttr = htmlNode.Attributes.SingleOrDefault(
                attr => attr.Name == "aria-label");

            if (arialLabelAttr != null)
            {
                string suffix = " Icon";

                if (arialLabelAttr.Value.EndsWith(suffix))
                {
                    icon = new MatIcon
                    {
                        IconName = arialLabelAttr.Value.Substring(
                            0, arialLabelAttr.Value.Length - suffix.Length)
                    };
                }
            }

            return icon;
        }

        private string GenerateCsCode(
            MatIconsContainer matIconsData)
        {
            string @namespace = "Turmerik.Ux";
            string parentClassName = "MatUIIconUnicodesH";

            string[] classesArr = matIconsData.GroupsList.Select(
                GenerateCsCode).ToArray();

            string csCode = string.Join($"{nwLn}{nwLn}", classesArr);

            string fileCsCode = string.Join(nwLn,
                $"namespace {@namespace}",
                $"{{",
                $"{TAB}public static class {parentClassName}",
                $"{TAB}{{",
                csCode,
                $"{TAB}}}",
                $"}}");

            return fileCsCode;
        }

        private string GenerateCsCode(
            MatIconsGroup matIconsGroup)
        {
            string className = GenerateCsClassName(
                matIconsGroup);

            string[] lines = matIconsGroup.IconsList.Select(
                GenerateCsCode).ToArray();

            string csCode = string.Join(nwLn, lines);

            string csClassDef = string.Join(nwLn,
                $"{TAB}{TAB}public static class {className}",
                $"{TAB}{TAB}{{",
                csCode,
                $"{TAB}{TAB}}}");

            return csClassDef;
        }

        private string GenerateCsCode(
            MatIcon matIcon)
        {
            string csLiteralFieldName = GenerateCsLiteralFieldName(matIcon);
            string csLine = $"{TAB}{TAB}{TAB}public const string {csLiteralFieldName} = null;";

            return csLine;
        }

        private string GenerateCsClassName(
            MatIconsGroup iconsGroup) => string.Concat(
                iconsGroup.GroupName.Split(' ').Select(
                    word => NormalizeIdnf(word)).ToArray());

        private string GenerateCsLiteralFieldName(
            MatIcon matIcon) => string.Join("_",
                matIcon.IconName.Split(' ').Select(
                    word => NormalizeIdnf(word).ToUpper()));

        private string NormalizeIdnf(string idnf) => nameToIdnfConverter.Convert(
            new NameToIdnfConverterOpts
            {
                InputIdentifier = idnf,
            });
    }
}
