using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public interface ITextTransformBehaviorData
    {
        IEnumerable<ITextTransformNode> GetTransformers();
    }

    public interface ITextTransformNode
    {
        string Name { get; }
        string Description { get; }

        IEnumerable<ITextTransformItem> GetItems();
        IEnumerable<ITextTransformNode> GetChildNodes();
    }

    public interface ITextTransformItem
    {
        string Name { get; }
        string Description { get; }

        string JsMethod { get; }
        bool IsValidCSharpCode { get; }
    }

    public static class TextTransformBehaviorData
    {
        public static TextTransformBehaviorDataImmtbl ToImmtbl(
            this ITextTransformBehaviorData src) => new TextTransformBehaviorDataImmtbl(src);

        public static TextTransformBehaviorDataMtbl ToMtbl(
            this ITextTransformBehaviorData src) => new TextTransformBehaviorDataMtbl(src);

        public static TextTransformNodeImmtbl ToImmtbl(
            this ITextTransformNode src) => new TextTransformNodeImmtbl(src);

        public static TextTransformNodeMtbl ToMtbl(
            this ITextTransformNode src) => new TextTransformNodeMtbl(src);

        public static ReadOnlyCollection<TextTransformNodeImmtbl> ToImmtblRdnlC(
            this IEnumerable<ITextTransformNode> src) => src.Select(
                value => value?.ToImmtbl()).RdnlC()!;

        public static List<TextTransformNodeMtbl> ToMtblList(
            this IEnumerable<ITextTransformNode> src) => src.Select(
                value => value?.ToMtbl()).ToList()!;

        public static TextTransformItemImmtbl ToImmtbl(
            this ITextTransformItem src) => new TextTransformItemImmtbl(src);

        public static TextTransformItemMtbl ToMtbl(
            this ITextTransformItem src) => new TextTransformItemMtbl(src);

        public static ReadOnlyCollection<TextTransformItemImmtbl> ToImmtblRdnlC(
            this IEnumerable<ITextTransformItem> src) => src.Select(
                value => value?.ToImmtbl()).RdnlC()!;

        public static List<TextTransformItemMtbl> ToMtblList(
            this IEnumerable<ITextTransformItem> src) => src.Select(
                value => value?.ToMtbl()).ToList()!;
    }

    public class TextTransformBehaviorDataImmtbl : ITextTransformBehaviorData
    {
        public TextTransformBehaviorDataImmtbl(
            ITextTransformBehaviorData src)
        {
            Transformers = src.GetTransformers()?.ToImmtblRdnlC()!;
        }

        public ReadOnlyCollection<TextTransformNodeImmtbl> Transformers { get; }

        public IEnumerable<ITextTransformNode> GetTransformers() => Transformers;
    }

    public class TextTransformBehaviorDataMtbl : ITextTransformBehaviorData
    {
        public TextTransformBehaviorDataMtbl()
        {
        }

        public TextTransformBehaviorDataMtbl(
            ITextTransformBehaviorData src)
        {
            Transformers = src.GetTransformers()?.ToMtblList()!;
        }

        public List<TextTransformNodeMtbl> Transformers { get; set; }

        public IEnumerable<ITextTransformNode> GetTransformers() => Transformers;
    }

    public class TextTransformNodeImmtbl : ITextTransformNode
    {
        public TextTransformNodeImmtbl(
            ITextTransformNode src)
        {
            Name = src.Name;
            Description = src.Description;
            Items = src.GetItems()?.ToImmtblRdnlC()!;
            ChildNodes = src.GetChildNodes()?.ToImmtblRdnlC()!;
        }

        public string Name { get; }
        public string Description { get; }

        public ReadOnlyCollection<TextTransformItemImmtbl> Items { get; }
        public ReadOnlyCollection<TextTransformNodeImmtbl> ChildNodes { get; }

        public IEnumerable<ITextTransformItem> GetItems() => Items;
        public IEnumerable<ITextTransformNode> GetChildNodes() => ChildNodes;
    }

    public class TextTransformNodeMtbl : ITextTransformNode
    {
        public TextTransformNodeMtbl(
            ITextTransformNode src)
        {
            Name = src.Name;
            Description = src.Description;
            Items = src.GetItems()?.ToMtblList()!;
            ChildNodes = src.GetChildNodes()?.ToMtblList()!;
        }

        public TextTransformNodeMtbl()
        {
        }

        public string Name { get; set; }
        public string Description { get; set; }

        public List<TextTransformItemMtbl> Items { get; set; }
        public List<TextTransformNodeMtbl> ChildNodes { get; set; }

        public IEnumerable<ITextTransformItem> GetItems() => Items;
        public IEnumerable<ITextTransformNode> GetChildNodes() => ChildNodes;
    }

    public class TextTransformItemImmtbl : ITextTransformItem
    {
        public TextTransformItemImmtbl(
            ITextTransformItem src)
        {
            Name = src.Name;
            Description = src.Description;
            JsMethod = src.JsMethod;
            IsValidCSharpCode = src.IsValidCSharpCode;
        }

        public string Name { get; }
        public string Description { get; }
        public string JsMethod { get; }
        public bool IsValidCSharpCode { get; }
    }

    public class TextTransformItemMtbl : ITextTransformItem
    {
        public TextTransformItemMtbl()
        {
        }

        public TextTransformItemMtbl(
            ITextTransformItem src)
        {
            Name = src.Name;
            Description = src.Description;
            JsMethod = src.JsMethod;
            IsValidCSharpCode = src.IsValidCSharpCode;
        }

        public string Name { get; set; }
        public string Description { get; set; }
        public string JsMethod { get; set; }
        public bool IsValidCSharpCode { get; set; }
    }
}
