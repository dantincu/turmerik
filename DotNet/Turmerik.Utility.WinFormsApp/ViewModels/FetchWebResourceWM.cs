using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.Utility.WinFormsApp.Settings;

namespace Turmerik.Utility.WinFormsApp.ViewModels
{
    public interface IFetchWebResourceWM
    {
        string ResourceUrl { get; }
        string ResourceTitle { get; }
        string ResourceMdLink { get; }
        bool AutoCopyResourceTitleToClipboard { get; }
        bool AutoCopyResourceMdLinkToClipboard { get; }

        Task<IActionResult> FetchResourceAsync(
            string url);

        IActionResult CopyResourceTitleToClipboard(
            string title);

        IActionResult CopyResourceMdLinkToClipboard(
            string mdLink);

        IActionResult SetAutoCopyResourceTitleToClipboard(
            bool enabled);

        IActionResult SetAutoCopyResourceMdLinkToClipboard(
            bool enabled);
    }

    public class FetchWebResourceWM : ViewModelBase, IFetchWebResourceWM
    {
        public FetchWebResourceWM(
            IAppSettings appSettings) : base(appSettings)
        {
        }

        public string ResourceUrl { get; private set; }
        public string ResourceTitle { get; private set; }
        public string ResourceMdLink { get; private set; }
        public bool AutoCopyResourceTitleToClipboard { get; private set; }
        public bool AutoCopyResourceMdLinkToClipboard { get; private set; }

        public async Task<IActionResult> FetchResourceAsync(
            string url)
        {
            ResourceUrl = url;
            return new ActionResult();
        }

        public IActionResult CopyResourceTitleToClipboard(
            string title)
        {
            throw new NotImplementedException();
        }

        public IActionResult CopyResourceMdLinkToClipboard(
            string mdLink)
        {
            throw new NotImplementedException();
        }

        public IActionResult SetAutoCopyResourceTitleToClipboard(
            bool enabled)
        {
            throw new NotImplementedException();
        }

        public IActionResult SetAutoCopyResourceMdLinkToClipboard(
            bool enabled)
        {
            throw new NotImplementedException();
        }
    }
}
