using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Reflection.Wrappers
{
    public class ConstructorInfoWrapper : MethodBaseWrapper<ConstructorInfo>
    {
        public ConstructorInfoWrapper(ConstructorInfo data) : base(data)
        {
            Parameters = new Lazy<ReadOnlyCollection<ParameterInfoWrapper>>(
                () => data.GetParameters().Select(
                    param => new ParameterInfoWrapper(param)).RdnlC());
        }

        public readonly Lazy<ReadOnlyCollection<ParameterInfoWrapper>> Parameters;
    }
}
