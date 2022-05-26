using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Helpers
{
    public static class PathH
    {
        public static readonly ReadOnlyCollection<char> InvalidPathChars;
        public static readonly ReadOnlyCollection<char> InvalidFileNameChars;

        static PathH()
        {
            InvalidPathChars = Path.GetInvalidPathChars().RdnlC();
            InvalidFileNameChars = Path.GetInvalidFileNameChars().RdnlC();
        }

        public static bool ContainsInvalidPathChars(
            this string path,
            bool isFileName = false,
            bool throwIfInvalid = false)
        {
            var invalidPathChars = GetInvalidPathChars(isFileName);
            bool retVal = path.ContainsAny(invalidPathChars);

            if (!retVal && throwIfInvalid)
            {
                char[] contained = path.GetContained(invalidPathChars);
                string containedStr = string.Join(", ", contained);

                throw new ArgumentException(
                    $"Provided path {path} contains the following invalid path chars: {containedStr}");
            }

            return retVal;
        }

        public static string ReplaceInvalidPathChars(
            this string path,
            bool isFileName = false,
            Func<char, char> replaceFactory = null)
        {
            var invalidPathChars = GetInvalidPathChars(isFileName);

            string retPath = path.ReplaceChars(
                replaceFactory,
                invalidPathChars);

            return retPath;
        }

        public static ReadOnlyCollection<char> GetInvalidPathChars(
            bool isFileName)
        {
            ReadOnlyCollection<char> invalidPathChars;

            if (isFileName)
            {
                invalidPathChars = InvalidPathChars;
            }
            else
            {
                invalidPathChars = InvalidFileNameChars;
            }

            return invalidPathChars;
        }
    }
}
