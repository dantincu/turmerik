using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.Notes
{
    public class NoteTupleCore<TItem>
        where TItem : NoteItemCoreBase
    {
        public string? FileIdnf { get; set; }
        public DriveItem? File { get; set; }
        public string? RawContent { get; set; }
        public TItem? Item { get; set; }
        public bool TrmrkGuidIsValid { get; set; }
    }
}
