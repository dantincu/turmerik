using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairIdxRetrieverFactory
    {
        NoteDirsPairIdxRetriever Create(
            NoteDirsPairSettings.DirNamesT opts);
    }

    public class NoteDirsPairIdxRetrieverFactory : INoteDirsPairIdxRetrieverFactory
    {
        private readonly IJsonConversion jsonConversion;

        public NoteDirsPairIdxRetrieverFactory(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
        }

        public NoteDirsPairIdxRetriever Create(
            NoteDirsPairSettings.DirNamesT opts) => new NoteDirsPairIdxRetriever(
                jsonConversion, opts);
    }
}
