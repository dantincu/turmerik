using System.Xml.Linq;
using Turmerik.VSCodeThemeCreator.MauiApp.Models;

namespace Turmerik.VSCodeThemeCreator.MauiApp.Services
{
    /// <summary>
    /// Generates a Visual Studio "Fonts and Colors" .vssettings file (Tools &gt; Import/Export Settings)
    /// covering the Text Editor category. This is the real, importable subset of VS theming;
    /// it does not attempt the full IDE-chrome ColorTheme/pkgdef/VSIX mechanism.
    /// </summary>
    public static class VsSettingsThemeGenerator
    {
        // Well-known Fonts and Colors category GUIDs used by Visual Studio.
        private const string PrinterCategoryGuid = "{6BB65C5A-2F31-4BDE-9F48-8A38DC0C63E7}";
        private const string PlainTextCategoryGuid = "{9973EFDF-317D-431C-8BC1-5E88CBFD4F7F}";
        private const string TextEditorCategoryGuid = "{A27B4E24-A735-4D1D-B8E7-9716E1E3D8E0}";

        public static string Generate(ThemePalette p)
        {
            string Color(RgbColor c) => $"0x00{c.B:X2}{c.G:X2}{c.R:X2}";
            const string Auto = "0x02000000";

            var plainTextItem = new XElement("Item",
                new XAttribute("Name", "Plain Text"),
                new XAttribute("Foreground", Color(p.Foreground)),
                new XAttribute("Background", Color(p.Background)),
                new XAttribute("BoldFont", "No"));

            var textEditorItems = new[]
            {
                Item("Plain Text", p.Foreground, p.Background),
                Item("Selected Text", p.Foreground, p.Selection),
                Item("Inactive Selected Text", p.Foreground, p.BackgroundElevated),
                Item("Indicator Margin", p.Background, p.BackgroundSunken),
                Item("Line Numbers", p.LineNumber, p.Background),
                Item("Brace Matching (Rectangle)", p.Foreground, p.BackgroundElevated),
                Item("Collapsible Text", p.LineNumber, background: null),
                Item("Comment", p.Comment, background: null),
                Item("Compiler Error", p.Error, background: null),
                Item("Current Statement", p.Background, p.Accent),
                Item("Excluded Code", p.LineNumber, background: null),
                Item("Keyword", p.Keyword, background: null),
                Item("Number", p.NumberColor, background: null),
                Item("Operator", p.OperatorColor, background: null),
                Item("Preprocessor Keyword", p.ConstantColor, background: null),
                Item("String", p.StringColor, background: null),
                Item("Syntax Error", p.Error, background: null),
                Item("User Types", p.TypeColor, background: null),
                Item("User Types(Delegates)", p.TypeColor, background: null),
                Item("User Types(Enums)", p.TypeColor, background: null),
                Item("User Types(Interfaces)", p.TypeColor, background: null),
                Item("User Types(Value types)", p.TypeColor, background: null),
                Item("Warning", p.Warning, background: null),

                Item("CSS Comment", p.Comment, background: null),
                Item("CSS Keyword", p.Keyword, background: null),
                Item("CSS Property Name", p.TypeColor, background: null),
                Item("CSS Property Value", p.StringColor, background: null),
                Item("CSS Selector", p.FunctionColor, background: null),
                Item("CSS String Value", p.StringColor, background: null),

                Item("HTML Attribute", p.TypeColor, background: null),
                Item("HTML Attribute Value", p.StringColor, background: null),
                Item("HTML Comment", p.Comment, background: null),
                Item("HTML Element Name", p.Keyword, background: null),
                Item("HTML Entity", p.ConstantColor, background: null),
                Item("HTML Operator", p.OperatorColor, background: null),
                Item("HTML Server-Side Script", p.FunctionColor, background: null),

                Item("XML Attribute", p.TypeColor, background: null),
                Item("XML Attribute Value", p.StringColor, background: null),
                Item("XML Comment", p.Comment, background: null),
                Item("XML Name", p.Keyword, background: null),
                Item("XML Text", p.Foreground, background: null),
                Item("XML Doc Comment", p.Comment, background: null),
                Item("XML Doc Tag", p.LineNumber, background: null),

                Item("XAML Attribute", p.TypeColor, background: null),
                Item("XAML Attribute Value", p.StringColor, background: null),
                Item("XAML Comment", p.Comment, background: null),
                Item("XAML Markup Extension Class", p.FunctionColor, background: null),
                Item("XAML Markup Extension Parameter Name", p.TypeColor, background: null),
                Item("XAML Markup Extension Parameter Value", p.StringColor, background: null),
                Item("XAML Name", p.Keyword, background: null),
            };

            XElement Item(string name, RgbColor fg, RgbColor? background)
            {
                var attrs = new List<object>
                {
                    new XAttribute("Name", name),
                    new XAttribute("Foreground", Color(fg)),
                    new XAttribute("Background", background.HasValue ? Color(background.Value) : Auto),
                    new XAttribute("BoldFont", "No"),
                };

                return new XElement("Item", attrs);
            }

            var doc = new XDocument(
                new XElement("UserSettings",
                    new XElement("ApplicationIdentity", new XAttribute("version", "10.0")),
                    new XElement("ToolsOptions",
                        new XElement("ToolsOptionsCategory",
                            new XAttribute("name", "Environment"),
                            new XAttribute("RegisteredName", "Environment"))),
                    new XElement("Category",
                        new XAttribute("name", "Environment_Group"),
                        new XAttribute("RegisteredName", "Environment_Group"),
                        new XElement("Category",
                            new XAttribute("name", "Environment_FontsAndColors"),
                            new XAttribute("Category", "{1EDA5DD4-927A-43a7-810E-7FD247D0DA1D}"),
                            new XAttribute("Package", "{DA9FB551-C724-11d0-AE1F-00A0C90FFFC3}"),
                            new XAttribute("RegisteredName", "Environment_FontsAndColors"),
                            new XAttribute("PackageName", "Visual Studio Environment Package"),
                            new XElement("PropertyValue", new XAttribute("name", "Version"), "2"),
                            new XElement("FontsAndColors",
                                new XAttribute("Version", "2.0"),
                                new XElement("Categories",
                                    new XElement("Category",
                                        new XAttribute("GUID", PrinterCategoryGuid),
                                        new XAttribute("FontIsDefault", "Yes"),
                                        new XElement("Items", plainTextItem)),
                                    new XElement("Category",
                                        new XAttribute("GUID", PlainTextCategoryGuid),
                                        new XAttribute("FontIsDefault", "Yes"),
                                        new XElement("Items", new XElement(plainTextItem))),
                                    new XElement("Category",
                                        new XAttribute("GUID", TextEditorCategoryGuid),
                                        new XAttribute("FontIsDefault", "Yes"),
                                        new XElement("Items", textEditorItems))))))));

            using var writer = new StringWriter();
            doc.Save(writer);
            return writer.ToString();
        }
    }
}
