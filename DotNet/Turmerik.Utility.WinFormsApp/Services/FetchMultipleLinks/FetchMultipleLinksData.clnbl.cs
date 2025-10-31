using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.WinForms.Controls;
using Turmerik.Core.Helpers;

namespace Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks
{
    public interface IFetchMultipleLinksData
    {
        bool IsSetUp { get; }
        int CurrentItemIdx { get; }
        int ItemsCount { get; }
    }

    public interface IFetchLinkDataItemCore
    {
        int ItemIdx { get; }
        bool? IsUrl { get; }
        string? Text { get; }
    }

    public interface IFetchLinkDataTextItem : IFetchLinkDataItemCore
    {
    }

    public interface IFetchLinkDataUrlItem : IFetchLinkDataItemCore
    {
        string Url { get; }
        DateTime? LastLoadedAt { get; }
        DateTime? LastVisitedAt { get; }
        string? Title { get; }
        string? MdLink { get; }

        IEnumerable<string>? GetScripts();
    }

    public static class FetchMultipleLinksData
    {
        public static FetchMultipleLinksDataImmtbl ToImmtbl(
            this IFetchMultipleLinksData src) => new FetchMultipleLinksDataImmtbl(src);

        public static FetchMultipleLinksDataMtbl ToMtbl(
            this IFetchMultipleLinksData src) => new FetchMultipleLinksDataMtbl(src);
    }

    public class FetchMultipleLinksDataImmtbl : IFetchMultipleLinksData
    {
        public FetchMultipleLinksDataImmtbl(IFetchMultipleLinksData src)
        {
            IsSetUp = src.IsSetUp;
            CurrentItemIdx = src.CurrentItemIdx;
            ItemsCount = src.ItemsCount;
        }

        public bool IsSetUp { get; init; }
        public int CurrentItemIdx { get; init; }
        public int ItemsCount { get; init; }
    }

    public class FetchMultipleLinksDataMtbl : IFetchMultipleLinksData
    {
        public FetchMultipleLinksDataMtbl()
        {
        }

        public FetchMultipleLinksDataMtbl(IFetchMultipleLinksData src)
        {
            IsSetUp = src.IsSetUp;
            CurrentItemIdx = src.CurrentItemIdx;
            ItemsCount = src.ItemsCount;
        }

        public bool IsSetUp { get; set; }
        public int CurrentItemIdx { get; set; }
        public int ItemsCount { get; set; }
    }

    public class FetchLinkDataItemCoreImmtbl : IFetchLinkDataItemCore
    {
        public FetchLinkDataItemCoreImmtbl(IFetchLinkDataItemCore src)
        {
            ItemIdx = src.ItemIdx;
            IsUrl = src.IsUrl;
            Text = src.Text;
        }

        public int ItemIdx { get; init; }
        public bool? IsUrl { get; init; }
        public string? Text { get; init; }
    }

    public class FetchLinkDataItemCoreMtbl : IFetchLinkDataItemCore
    {
        public FetchLinkDataItemCoreMtbl()
        {
        }

        public FetchLinkDataItemCoreMtbl(IFetchLinkDataItemCore src)
        {
            ItemIdx = src.ItemIdx;
            IsUrl = src.IsUrl;
            Text = src.Text;
        }

        public int ItemIdx { get; set; }
        public bool? IsUrl { get; set; }
        public string? Text { get; set; }
    }

    public class FetchLinkDataTextItemImmtbl : FetchLinkDataItemCoreImmtbl, IFetchLinkDataTextItem
    {
        public FetchLinkDataTextItemImmtbl(IFetchLinkDataTextItem src) : base(src)
        {
        }
    }

    public class FetchLinkDataTextItemMtbl : FetchLinkDataItemCoreMtbl, IFetchLinkDataTextItem
    {
        public FetchLinkDataTextItemMtbl()
        {
        }

        public FetchLinkDataTextItemMtbl(IFetchLinkDataTextItem src) : base(src)
        {
        }
    }

    public class FetchLinkDataUrlItemImmtbl : FetchLinkDataItemCoreImmtbl, IFetchLinkDataUrlItem
    {
        public FetchLinkDataUrlItemImmtbl(IFetchLinkDataUrlItem src) : base(src)
        {
            Url = src.Url;
            LastLoadedAt = src.LastLoadedAt;
            LastVisitedAt = src.LastVisitedAt;
            Title = src.Title;
            MdLink = src.MdLink;
            Scripts = src.GetScripts()?.RdnlC();
        }

        public string Url { get; init; }
        public DateTime? LastLoadedAt { get; init; }
        public DateTime? LastVisitedAt { get; init; }
        public string? Title { get; init; }
        public string? MdLink { get; init; }
        public ReadOnlyCollection<string>? Scripts { get; init; }

        public IEnumerable<string>? GetScripts() => Scripts;
    }

    public class FetchLinkDataUrlItemMtbl : FetchLinkDataItemCoreMtbl, IFetchLinkDataUrlItem
    {
        public FetchLinkDataUrlItemMtbl()
        {
        }

        public FetchLinkDataUrlItemMtbl(IFetchLinkDataUrlItem src) : base(src)
        {
            Url = src.Url;
            LastLoadedAt = src.LastLoadedAt;
            LastVisitedAt = src.LastVisitedAt;
            Title = src.Title;
            MdLink = src.MdLink;
            Scripts = src.GetScripts()?.ToList();
        }

        public string Url { get; set; }
        public DateTime? LastLoadedAt { get; set; }
        public DateTime? LastVisitedAt { get; set; }
        public string? Title { get; set; }
        public string? MdLink { get; set; }
        public List<string>? Scripts { get; set; }

        public IEnumerable<string>? GetScripts() => Scripts;
    }
}
