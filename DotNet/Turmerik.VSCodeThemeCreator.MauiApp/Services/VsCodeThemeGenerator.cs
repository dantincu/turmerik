using System.Text.Json;
using System.Text.Json.Nodes;
using Turmerik.VSCodeThemeCreator.MauiApp.Models;

namespace Turmerik.VSCodeThemeCreator.MauiApp.Services
{
    public static class VsCodeThemeGenerator
    {
        public static string Generate(ThemePalette p)
        {
            var colors = new JsonObject
            {
                ["editor.background"] = p.Background.ToHex(),
                ["editor.foreground"] = p.Foreground.ToHex(),
                ["editorLineNumber.foreground"] = p.LineNumber.ToHex(),
                ["editorLineNumber.activeForeground"] = p.LineNumberActive.ToHex(),
                ["editor.lineHighlightBackground"] = p.LineHighlight.ToHex(),
                ["editor.selectionBackground"] = p.Selection.ToHexAlpha(0x80),
                ["editorCursor.foreground"] = p.Accent.ToHex(),
                ["editorIndentGuide.background1"] = p.Border.ToHex(),
                ["editorWhitespace.foreground"] = p.Border.ToHex(),
                ["editorWidget.background"] = p.BackgroundElevated.ToHex(),
                ["editorWidget.border"] = p.Border.ToHex(),
                ["editorGroup.border"] = p.Border.ToHex(),
                ["editorGroupHeader.tabsBackground"] = p.BackgroundSunken.ToHex(),
                ["editorError.foreground"] = p.Error.ToHex(),
                ["editorWarning.foreground"] = p.Warning.ToHex(),
                ["editorInfo.foreground"] = p.Info.ToHex(),
                ["errorForeground"] = p.Error.ToHex(),

                ["activityBar.background"] = p.BackgroundSunken.ToHex(),
                ["activityBar.foreground"] = p.Foreground.ToHex(),
                ["activityBarBadge.background"] = p.Accent.ToHex(),
                ["activityBarBadge.foreground"] = p.Background.ToHex(),

                ["sideBar.background"] = p.BackgroundSunken.ToHex(),
                ["sideBar.foreground"] = p.Foreground.ToHex(),
                ["sideBarTitle.foreground"] = p.Foreground.ToHex(),
                ["sideBar.border"] = p.Border.ToHex(),

                ["statusBar.background"] = p.BackgroundSunken.ToHex(),
                ["statusBar.foreground"] = p.Foreground.ToHex(),
                ["statusBarItem.hoverBackground"] = p.BackgroundElevated.ToHex(),

                ["titleBar.activeBackground"] = p.BackgroundSunken.ToHex(),
                ["titleBar.activeForeground"] = p.Foreground.ToHex(),
                ["titleBar.inactiveBackground"] = p.BackgroundSunken.ToHex(),
                ["titleBar.inactiveForeground"] = p.LineNumber.ToHex(),

                ["tab.activeBackground"] = p.Background.ToHex(),
                ["tab.activeForeground"] = p.Foreground.ToHex(),
                ["tab.inactiveBackground"] = p.BackgroundSunken.ToHex(),
                ["tab.inactiveForeground"] = p.LineNumber.ToHex(),
                ["tab.border"] = p.Border.ToHex(),

                ["button.background"] = p.Accent.ToHex(),
                ["button.foreground"] = p.Background.ToHex(),
                ["button.hoverBackground"] = ColorMath.AdjustLightness(p.Accent, p.IsDark ? 0.08 : -0.08).ToHex(),

                ["input.background"] = p.BackgroundSunken.ToHex(),
                ["input.foreground"] = p.Foreground.ToHex(),
                ["input.border"] = p.Border.ToHex(),
                ["focusBorder"] = p.Accent.ToHex(),

                ["list.activeSelectionBackground"] = p.Selection.ToHex(),
                ["list.activeSelectionForeground"] = p.Foreground.ToHex(),
                ["list.hoverBackground"] = p.BackgroundElevated.ToHex(),

                ["badge.background"] = p.Accent.ToHex(),
                ["badge.foreground"] = p.Background.ToHex(),
                ["progressBar.background"] = p.Accent.ToHex(),
                ["textLink.foreground"] = p.Accent.ToHex(),
                ["textLink.activeForeground"] = p.Secondary.ToHex(),
            };

            var tokenColors = new JsonArray
            {
                TokenRule("Comment", ["comment"], p.Comment, italic: true),
                TokenRule("String", ["string"], p.StringColor),
                TokenRule("Number, Boolean", ["constant.numeric", "constant.language.boolean"], p.NumberColor),
                TokenRule("Other Constants", ["constant.language", "constant.character", "constant.other"], p.ConstantColor),
                TokenRule("Keyword", ["keyword", "storage.type", "storage.modifier"], p.Keyword),
                TokenRule("Control Keyword", ["keyword.control"], p.ControlKeyword),
                TokenRule("Operator", ["keyword.operator"], p.OperatorColor),
                TokenRule("Function, Method", ["entity.name.function", "support.function"], p.FunctionColor),
                TokenRule("Type, Class", ["entity.name.type", "entity.name.class", "support.type", "support.class"], p.TypeColor),
                TokenRule("Variable, Parameter", ["variable", "variable.parameter"], p.VariableColor),
                TokenRule("Tag / Property", ["entity.name.tag", "entity.other.attribute-name"], p.Keyword),
                TokenRule("Punctuation", ["punctuation"], p.OperatorColor),
            };

            var root = new JsonObject
            {
                ["$schema"] = "vscode://schemas/color-theme",
                ["name"] = p.ThemeName,
                ["type"] = p.IsDark ? "dark" : "light",
                ["colors"] = colors,
                ["tokenColors"] = tokenColors,
            };

            return root.ToJsonString(new JsonSerializerOptions { WriteIndented = true });
        }

        private static JsonObject TokenRule(string name, string[] scopes, RgbColor color, bool italic = false)
        {
            var settings = new JsonObject { ["foreground"] = color.ToHex() };

            if (italic)
            {
                settings["fontStyle"] = "italic";
            }

            var scopeArray = new JsonArray();

            foreach (var scope in scopes)
            {
                scopeArray.Add(scope);
            }

            return new JsonObject
            {
                ["name"] = name,
                ["scope"] = scopeArray,
                ["settings"] = settings,
            };
        }
    }
}
