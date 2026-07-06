using System.Globalization;

namespace Turmerik.VSCodeThemeCreator.MauiApp.Services
{
    public readonly record struct RgbColor(byte R, byte G, byte B)
    {
        public string ToHex() =>
            $"#{R:X2}{G:X2}{B:X2}";

        public string ToHexAlpha(byte alpha) =>
            $"#{R:X2}{G:X2}{B:X2}{alpha:X2}";

        public static RgbColor Parse(string hex)
        {
            if (!TryParse(hex, out var color))
            {
                throw new FormatException($"'{hex}' is not a valid hex color (expected #RGB or #RRGGBB).");
            }

            return color;
        }

        public static bool TryParse(string? hex, out RgbColor color)
        {
            color = default;

            if (string.IsNullOrWhiteSpace(hex))
            {
                return false;
            }

            var span = hex.Trim();

            if (span.StartsWith('#'))
            {
                span = span[1..];
            }

            if (span.Length == 3)
            {
                span = string.Concat(span.Select(c => new string(c, 2)));
            }

            if (span.Length != 6 || !int.TryParse(span, NumberStyles.HexNumber, CultureInfo.InvariantCulture, out var value))
            {
                return false;
            }

            color = new RgbColor(
                (byte)((value >> 16) & 0xFF),
                (byte)((value >> 8) & 0xFF),
                (byte)(value & 0xFF));

            return true;
        }
    }

    public readonly record struct HslColor(double H, double S, double L);

    public static class ColorMath
    {
        public static HslColor ToHsl(RgbColor c)
        {
            double r = c.R / 255d, g = c.G / 255d, b = c.B / 255d;
            double max = Math.Max(r, Math.Max(g, b));
            double min = Math.Min(r, Math.Min(g, b));
            double h = 0, s;
            double l = (max + min) / 2;

            if (max == min)
            {
                s = 0;
            }
            else
            {
                double d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                if (max == r)
                {
                    h = (g - b) / d + (g < b ? 6 : 0);
                }
                else if (max == g)
                {
                    h = (b - r) / d + 2;
                }
                else
                {
                    h = (r - g) / d + 4;
                }

                h *= 60;
            }

            return new HslColor(h, s, l);
        }

        public static RgbColor ToRgb(HslColor hsl)
        {
            double h = ((hsl.H % 360) + 360) % 360 / 360;
            double s = Math.Clamp(hsl.S, 0, 1);
            double l = Math.Clamp(hsl.L, 0, 1);

            double r, g, b;

            if (s == 0)
            {
                r = g = b = l;
            }
            else
            {
                double q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                double p = 2 * l - q;
                r = HueToRgb(p, q, h + 1d / 3);
                g = HueToRgb(p, q, h);
                b = HueToRgb(p, q, h - 1d / 3);
            }

            return new RgbColor(ToByte(r), ToByte(g), ToByte(b));
        }

        private static double HueToRgb(double p, double q, double t)
        {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1d / 6) return p + (q - p) * 6 * t;
            if (t < 1d / 2) return q;
            if (t < 2d / 3) return p + (q - p) * (2d / 3 - t) * 6;
            return p;
        }

        private static byte ToByte(double v) => (byte)Math.Round(Math.Clamp(v, 0, 1) * 255);

        public static RgbColor AdjustLightness(RgbColor c, double delta)
        {
            var hsl = ToHsl(c);
            return ToRgb(hsl with { L = Math.Clamp(hsl.L + delta, 0, 1) });
        }

        public static RgbColor HueRotate(RgbColor c, double degrees)
        {
            var hsl = ToHsl(c);
            return ToRgb(hsl with { H = hsl.H + degrees });
        }

        public static RgbColor Desaturate(RgbColor c, double amount)
        {
            var hsl = ToHsl(c);
            return ToRgb(hsl with { S = Math.Clamp(hsl.S - amount, 0, 1) });
        }

        public static RgbColor Mix(RgbColor a, RgbColor b, double t)
        {
            t = Math.Clamp(t, 0, 1);
            return new RgbColor(
                (byte)Math.Round(a.R + (b.R - a.R) * t),
                (byte)Math.Round(a.G + (b.G - a.G) * t),
                (byte)Math.Round(a.B + (b.B - a.B) * t));
        }

        // WCAG relative luminance, 0 (black) .. 1 (white)
        public static double RelativeLuminance(RgbColor c)
        {
            static double Channel(byte v)
            {
                double s = v / 255d;
                return s <= 0.03928 ? s / 12.92 : Math.Pow((s + 0.055) / 1.055, 2.4);
            }

            return 0.2126 * Channel(c.R) + 0.7152 * Channel(c.G) + 0.0722 * Channel(c.B);
        }

        public static double ContrastRatio(RgbColor a, RgbColor b)
        {
            double la = RelativeLuminance(a) + 0.05;
            double lb = RelativeLuminance(b) + 0.05;
            return la > lb ? la / lb : lb / la;
        }

        /// <summary>Nudges lightness away from <paramref name="background"/> until the contrast ratio meets <paramref name="minRatio"/>.</summary>
        public static RgbColor EnsureContrast(RgbColor c, RgbColor background, double minRatio, bool isDarkTheme)
        {
            var result = c;
            var step = isDarkTheme ? 0.05 : -0.05;
            var attempts = 0;

            while (ContrastRatio(result, background) < minRatio && attempts < 16)
            {
                result = AdjustLightness(result, step);
                attempts++;
            }

            return result;
        }
    }
}
