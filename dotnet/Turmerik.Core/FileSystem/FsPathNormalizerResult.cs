using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public interface IFsPathNormalizerResult
    {
        string NormalizedPath { get; }
        bool IsValid { get; }
        bool IsRooted { get; }
        bool? IsUnixStyle { get; }
        bool? IsAbsUri { get; }
    }

    public class FsPathNormalizerResultImmtbl : IFsPathNormalizerResult
    {
        public FsPathNormalizerResultImmtbl()
        {
        }

        public FsPathNormalizerResultImmtbl(IFsPathNormalizerResult src)
        {
            NormalizedPath = src.NormalizedPath;
            IsValid = src.IsValid;
            IsRooted = src.IsRooted;
            IsUnixStyle = src.IsUnixStyle;
            IsAbsUri = src.IsAbsUri;
        }

        public string NormalizedPath { get; set; }
        public bool IsValid { get; set; }
        public bool IsRooted { get; set; }
        public bool? IsUnixStyle { get; set; }
        public bool? IsAbsUri { get; set; }
    }

    public class FsPathNormalizerResultMtbl : IFsPathNormalizerResult
    {
        public FsPathNormalizerResultMtbl()
        {
        }

        public FsPathNormalizerResultMtbl(IFsPathNormalizerResult src)
        {
            NormalizedPath = src.NormalizedPath;
            IsValid = src.IsValid;
            IsRooted = src.IsRooted;
            IsUnixStyle = src.IsUnixStyle;
            IsAbsUri = src.IsAbsUri;
        }

        public string NormalizedPath { get; set; }
        public bool IsValid { get; set; }
        public bool IsRooted { get; set; }
        public bool? IsUnixStyle { get; set; }
        public bool? IsAbsUri { get; set; }
    }
}
