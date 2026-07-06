using Turmerik.VSCodeThemeCreator.MauiApp.Services;

namespace Turmerik.VSCodeThemeCreator.MauiApp.Models
{
    /// <summary>The small set of key colors the user provides; everything else is derived from these.</summary>
    public sealed class ThemeColorInput
    {
        public required string ThemeName { get; init; }
        public required RgbColor Background { get; init; }
        public required RgbColor Foreground { get; init; }
        public required RgbColor Accent { get; init; }
        public required RgbColor Secondary { get; init; }
        public required RgbColor Error { get; init; }
    }
}
