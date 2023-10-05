using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteDirsPairIdx
    {
        public NoteDirsPairIdx()
        {
        }

        public NoteDirsPairIdx(NoteDirsPairIdx src)
        {
            Idx = src.Idx;
            ExistingIdxes = src.ExistingIdxes;
            NoteItem = src.NoteItem;
            NoteBook = src.NoteBook;
        }

        public int Idx { get; set; }
        public HashSet<int> ExistingIdxes { get; set; }
        public IJsonObjectDecorator<NoteItemCore> NoteItem { get; set; }
        public IJsonObjectDecorator<NoteItemCore> NoteBook { get; set; }
    }
}
