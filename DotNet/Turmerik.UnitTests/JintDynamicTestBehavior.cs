using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;
using Turmerik.Jint.Behavior;

namespace Turmerik.UnitTests
{
    public class JintDynamicTestBehavior : AppDynamicBehaviorCoreBase<JintDynamicTestBehaviorMembersImmtbl, JintDynamicTestBehaviorMembersMtbl>
    {
        public JintDynamicTestBehavior(
            IJsonConversion jsonConversion,
            IAppEnv appEnv,
            AppBehaviorSetupAdapterFactory appBehaviorSetupAdapterFactory) : base(
                jsonConversion,
                appEnv,
                appBehaviorSetupAdapterFactory)
        {
        }

        protected override JintDynamicTestBehaviorMembersImmtbl NormalizeExportedMembers(
            JintDynamicTestBehaviorMembersMtbl members)
        {
            members.AddMethodName = members.AddMethodName ?? throw new InvalidOperationException(
                $"The method name should be present in the config file");

            return new JintDynamicTestBehaviorMembersImmtbl(members);
        }
    }
}
