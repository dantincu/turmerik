using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.Notes
{
    public interface INoteJsonDeserializer
    {
        Tuple<NoteItemCore, bool> TryDeserialize(
            string fileContents);
    }

    public class NoteJsonDeserializer : INoteJsonDeserializer
    {
        private readonly IJsonConversion jsonConversion;

        public NoteJsonDeserializer(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
        }

        public Tuple<NoteItemCore, bool> TryDeserialize(
            string fileContents)
        {
            NoteItemCore item;
            bool isValid;

            try
            {
                item = jsonConversion.Adapter.Deserialize<NoteItemCore>(
                    fileContents);

                isValid = item.TrmrkGuid == Trmrk.TrmrkGuid;
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
