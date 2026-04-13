using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Turmerik.GenHtml.WebApp.Pages
{
    public class DocScanImgsModel : PageModel
    {
        public string[] DocScanImgUrls { get; set; } = [];

        public void OnGet()
        {
        }

        public async Task OnPost()
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();

            DocScanImgUrls = body
                .Split('\n')
                .Select(line => line.Trim())
                .Where(line => line.Length > 0)
                .ToArray();
        }
    }
}
