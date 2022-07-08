namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services
{
    public static class MacrosH
    {
        public const string DESC_IDX = "desc-idx";
        public const string ASC_IDX = "asc-idx";
        public const string H_DESC_IDX = "h-desc-idx";
        public const string H_ASC_IDX = "h-asc-idx";
        public const string CONST = "const";
        public const string PINNED = "pinned";
        public const string ATOMIC_CONST = "atomic-const";
        public const string EXT = "ext";
        public const string MISC = "misc";
        public const string ENTRY_NAME = "EntryName";
        public const string SRC_NAME = "SrcName";
    }

    public static class ConstMacrosH
    {
        public const string E_DOCS = "e-docs";

        public const string IMGS = "imgs";
        public const string PHOTO = "photo";

        public const string INFO = "info";
        public const string DOC = "doc";
        public const string SCAN = "scan";
        public const string RDBL = "rdbl";

        public const string PRINT = "print";
        public const string SCREEN = "screen";
        public const string SNIP = "snip";
        public const string SKETCH = "sketch";

        public const string DWNLDD = "dwnldd";
        public const string UPLDD = "upldd";

        public const string GNRTD = "gnrtd";
        public const string WRTTN = "wrttn";
        public const string MNLL = "mnll";
        public const string SGND = "sgnd";
        public const string ELEC = "elec";
        public const string BY = "by";
        public const string ME = "me";

        public static readonly string PhotoImgs = string.Join("-", PHOTO, IMGS);
        public static readonly string InfoPhotoImgs = string.Join("-", INFO, PHOTO, IMGS);
        public static readonly string DocScanImgs = string.Join("-", DOC, SCAN, IMGS);
        public static readonly string DocRdblPhotoImgs = string.Join("-", DOC, RDBL, PHOTO, IMGS);
        public static readonly string PrintScreenImgs = string.Join("-", PRINT, SCREEN, IMGS);
        public static readonly string SnipSketchImgs = string.Join("-", SNIP, SKETCH, IMGS);
        public static readonly string ScreenSnipSketchImgs = string.Join("-", SCREEN, SNIP, SKETCH, IMGS);
        public static readonly string WrttnByMe = string.Join("-", WRTTN, BY, ME);
        public static readonly string MnllSgndByMe = string.Join("-", MNLL, SGND, BY, ME);
        public static readonly string SgndByMe = string.Join("-", SGND, BY, ME);
        public static readonly string ElecSgndByMe = string.Join("-", ELEC, SGND, BY, ME);
        public static readonly string ElecSgnd = string.Join("-", ELEC, SGND);
    }
}
