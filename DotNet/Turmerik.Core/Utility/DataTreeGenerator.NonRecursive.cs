using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public class NonRecursiveDataTreeGenerator : DataTreeGeneratorBase
    {
        protected override void GetNodes<TData, TNode, TOpts, TArgs>(TArgs args)
        {
            throw new NotImplementedException();
        }
    }
}
