using Turmerik.VSCodeThemeCreator.MauiApp.Services;

namespace Turmerik.VSCodeThemeCreator.MauiApp.Models
{
    /// <summary>Full set of UI + syntax colors derived from a <see cref="ThemeColorInput"/>.</summary>
    public sealed class ThemePalette
    {
        public required string ThemeName { get; init; }
        public required bool IsDark { get; init; }

        public required RgbColor Background { get; init; }
        public required RgbColor Foreground { get; init; }
        public required RgbColor Accent { get; init; }
        public required RgbColor Secondary { get; init; }
        public required RgbColor Error { get; init; }

        // Surfaces
        public required RgbColor BackgroundElevated { get; init; }
        public required RgbColor BackgroundSunken { get; init; }
        public required RgbColor Border { get; init; }
        public required RgbColor LineHighlight { get; init; }
        public required RgbColor Selection { get; init; }
        public required RgbColor LineNumber { get; init; }
        public required RgbColor LineNumberActive { get; init; }

        // Semantic
        public required RgbColor Warning { get; init; }
        public required RgbColor Success { get; init; }
        public required RgbColor Info { get; init; }

        // Syntax
        public required RgbColor Comment { get; init; }
        public required RgbColor Keyword { get; init; }
        public required RgbColor ControlKeyword { get; init; }
        public required RgbColor StringColor { get; init; }
        public required RgbColor NumberColor { get; init; }
        public required RgbColor FunctionColor { get; init; }
        public required RgbColor TypeColor { get; init; }
        public required RgbColor VariableColor { get; init; }
        public required RgbColor OperatorColor { get; init; }
        public required RgbColor ConstantColor { get; init; }

        public static ThemePalette FromInput(ThemeColorInput input)
        {
            bool isDark = ColorMath.RelativeLuminance(input.Background) < 0.5;
            double dir = isDark ? 1 : -1;

            RgbColor Step(RgbColor c, double amount) => ColorMath.AdjustLightness(c, dir * amount);
            RgbColor Contrast(RgbColor c) => ColorMath.EnsureContrast(c, input.Background, 3.0, isDark);

            var comment = Contrast(ColorMath.Desaturate(ColorMath.Mix(input.Foreground, input.Background, 0.45), 0.25));
            var lineNumber = ColorMath.Mix(input.Foreground, input.Background, 0.55);

            return new ThemePalette
            {
                ThemeName = input.ThemeName,
                IsDark = isDark,
                Background = input.Background,
                Foreground = input.Foreground,
                Accent = input.Accent,
                Secondary = input.Secondary,
                Error = input.Error,

                BackgroundElevated = Step(input.Background, 0.04),
                BackgroundSunken = Step(input.Background, -0.03),
                Border = Step(input.Background, 0.14),
                LineHighlight = Step(input.Background, 0.06),
                Selection = Step(input.Background, 0.18),
                LineNumber = lineNumber,
                LineNumberActive = Contrast(ColorMath.Mix(input.Foreground, input.Background, 0.2)),

                Warning = Contrast(ColorMath.HueRotate(input.Error, 40)),
                Success = Contrast(ColorMath.HueRotate(input.Error, 130)),
                Info = Contrast(input.Accent),

                Comment = comment,
                Keyword = Contrast(input.Secondary),
                ControlKeyword = Contrast(ColorMath.HueRotate(input.Secondary, -20)),
                StringColor = Contrast(ColorMath.HueRotate(input.Accent, -100)),
                NumberColor = Contrast(ColorMath.HueRotate(input.Accent, 80)),
                FunctionColor = Contrast(input.Accent),
                TypeColor = Contrast(ColorMath.HueRotate(input.Secondary, 40)),
                VariableColor = input.Foreground,
                OperatorColor = ColorMath.Mix(input.Foreground, input.Background, 0.25),
                ConstantColor = Contrast(ColorMath.HueRotate(input.Accent, 140)),
            };
        }
    }
}
