using System;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.Notes.Core;

namespace Turmerik.Notes
{
    public interface INoteJsonDeserializer
    {
        Tuple<TNoteItem, bool> TryDeserialize<TNoteItem>(
            string fileContents,
            bool requireTrmrkGuid = true)
            where TNoteItem : NoteItemCoreBase;
    }

    public class NoteJsonDeserializer : INoteJsonDeserializer
    {
        private readonly IJsonConversion jsonConversion;

        public NoteJsonDeserializer(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
        }

        public Tuple<TNoteItem?, bool> TryDeserialize<TNoteItem>(
            string fileContents,
            bool requireTrmrkGuid = true)
            where TNoteItem : NoteItemCoreBase
        {
            TNoteItem? item;
            bool isValid;

            try
            {
                item = jsonConversion.Adapter.Deserialize<TNoteItem>(
                    fileContents);

                isValid = !requireTrmrkGuid || item.TrmrkGuid == Trmrk.TrmrkGuid;
            }
            catch
            {
                item = null;
                isValid = false;
            }

            return Tuple.Create(item, isValid);
        }
    }
}
