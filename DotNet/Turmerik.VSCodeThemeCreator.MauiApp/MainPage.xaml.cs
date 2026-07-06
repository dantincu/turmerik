using Turmerik.VSCodeThemeCreator.MauiApp.Models;
using Turmerik.VSCodeThemeCreator.MauiApp.Services;

namespace Turmerik.VSCodeThemeCreator.MauiApp
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
            PreviewOperator1.Text = "{";
            PreviewCloseBrace.Text = "}";
            UpdatePreview();
        }

        private void OnAnyInputChanged(object? sender, TextChangedEventArgs e) => UpdatePreview();

        private bool TryBuildPalette(out ThemePalette palette, out string error)
        {
            palette = null!;
            error = string.Empty;

            (string label, string hex)[] fields =
            [
                ("Background", BackgroundEntry.Text),
                ("Foreground", ForegroundEntry.Text),
                ("Accent", AccentEntry.Text),
                ("Secondary", SecondaryEntry.Text),
                ("Error", ErrorEntry.Text),
            ];

            foreach (var (label, hex) in fields)
            {
                if (!RgbColor.TryParse(hex, out _))
                {
                    error = $"{label} is not a valid hex color.";
                    return false;
                }
            }

            var input = new ThemeColorInput
            {
                ThemeName = string.IsNullOrWhiteSpace(ThemeNameEntry.Text) ? "My Custom Theme" : ThemeNameEntry.Text.Trim(),
                Background = RgbColor.Parse(BackgroundEntry.Text),
                Foreground = RgbColor.Parse(ForegroundEntry.Text),
                Accent = RgbColor.Parse(AccentEntry.Text),
                Secondary = RgbColor.Parse(SecondaryEntry.Text),
                Error = RgbColor.Parse(ErrorEntry.Text),
            };

            palette = ThemePalette.FromInput(input);
            return true;
        }

        private void UpdatePreview()
        {
            if (!TryBuildPalette(out var p, out var error))
            {
                StatusLabel.Text = error;
                StatusLabel.IsVisible = true;
                return;
            }

            StatusLabel.IsVisible = false;

            BackgroundSwatch.Color = Color.FromArgb(p.Background.ToHex());
            ForegroundSwatch.Color = Color.FromArgb(p.Foreground.ToHex());
            AccentSwatch.Color = Color.FromArgb(p.Accent.ToHex());
            SecondarySwatch.Color = Color.FromArgb(p.Secondary.ToHex());
            ErrorSwatch.Color = Color.FromArgb(p.Error.ToHex());

            PreviewFrame.BackgroundColor = Color.FromArgb(p.Background.ToHex());
            PreviewFrame.Stroke = new SolidColorBrush(Color.FromArgb(p.Border.ToHex()));

            PreviewComment.TextColor = Color.FromArgb(p.Comment.ToHex());

            PreviewKeyword1.TextColor = PreviewKeyword2.TextColor = Color.FromArgb(p.Keyword.ToHex());
            PreviewControl1.TextColor = Color.FromArgb(p.ControlKeyword.ToHex());
            PreviewType1.TextColor = PreviewType2.TextColor = Color.FromArgb(p.TypeColor.ToHex());
            PreviewVariable1.TextColor = PreviewVariable2.TextColor = Color.FromArgb(p.VariableColor.ToHex());
            PreviewFunction1.TextColor = Color.FromArgb(p.FunctionColor.ToHex());
            PreviewNumber1.TextColor = Color.FromArgb(p.NumberColor.ToHex());
            PreviewString1.TextColor = Color.FromArgb(p.StringColor.ToHex());

            var operatorColor = Color.FromArgb(p.OperatorColor.ToHex());
            PreviewOperator1.TextColor = operatorColor;
            PreviewOperator2.TextColor = operatorColor;
            PreviewOperator3.TextColor = operatorColor;
            PreviewOperator4.TextColor = operatorColor;
            PreviewOperator5.TextColor = operatorColor;
            PreviewCloseBrace.TextColor = operatorColor;
        }

        private async void OnExportVsCodeClicked(object? sender, EventArgs e)
        {
            if (!TryBuildPalette(out var palette, out var error))
            {
                await DisplayAlert("Invalid colors", error, "OK");
                return;
            }

            var json = VsCodeThemeGenerator.Generate(palette);
            var fileName = $"{SafeFileName(palette.ThemeName)}-color-theme.json";
            var (success, path, saveError) = await ThemeExportService.ExportAsync(fileName, json);

            if (success)
            {
                await DisplayAlert("Saved", $"VS Code theme saved to:\n{path}", "OK");
            }
            else if (saveError is not null)
            {
                await DisplayAlert("Save failed", saveError, "OK");
            }
        }

        private async void OnExportVsSettingsClicked(object? sender, EventArgs e)
        {
            if (!TryBuildPalette(out var palette, out var error))
            {
                await DisplayAlert("Invalid colors", error, "OK");
                return;
            }

            var xml = VsSettingsThemeGenerator.Generate(palette);
            var fileName = $"{SafeFileName(palette.ThemeName)}.vssettings";
            var (success, path, saveError) = await ThemeExportService.ExportAsync(fileName, xml);

            if (success)
            {
                await DisplayAlert("Saved", $"Visual Studio theme saved to:\n{path}", "OK");
            }
            else if (saveError is not null)
            {
                await DisplayAlert("Save failed", saveError, "OK");
            }
        }

        private static string SafeFileName(string name)
        {
            var invalid = Path.GetInvalidFileNameChars();
            var chars = name.Select(c => invalid.Contains(c) ? '-' : c).ToArray();
            return new string(chars).Replace(' ', '-');
        }
    }
}
