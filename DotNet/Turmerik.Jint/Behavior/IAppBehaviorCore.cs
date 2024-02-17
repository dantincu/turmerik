using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Jint.Behavior
{
    public interface IAppBehaviorCore<TExportedMembersImmtbl, TExportedMembersSrlzbl>
    {
        public ITrmrkJintAdapter Behavior { get; }
        public TExportedMembersImmtbl ExportedMembers { get; }
    }
}
