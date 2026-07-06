using System.Text;
using CommunityToolkit.Maui.Storage;

namespace Turmerik.VSCodeThemeCreator.MauiApp.Services
{
    public static class ThemeExportService
    {
        public static async Task<(bool Success, string? Path, string? Error)> ExportAsync(string fileName, string content)
        {
            using var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            var result = await FileSaver.Default.SaveAsync(fileName, stream);

            return result.IsSuccessful
                ? (true, result.FilePath, null)
                : (false, null, result.Exception?.Message ?? "Save was cancelled.");
        }
    }
}
