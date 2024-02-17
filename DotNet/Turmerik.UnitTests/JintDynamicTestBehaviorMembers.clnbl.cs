using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.UnitTests
{
    public interface IJintDynamicTestBehaviorMembers
    {
        string AddMethodName { get; }
    }

    public static class JintDynamicTestBehaviorMembers
    {
        public static JintDynamicTestBehaviorMembersImmtbl ToImmtbl(
            this IJintDynamicTestBehaviorMembers src) => new JintDynamicTestBehaviorMembersImmtbl(src);

        public static JintDynamicTestBehaviorMembersMtbl ToMtbl(
            this IJintDynamicTestBehaviorMembers src) => new JintDynamicTestBehaviorMembersMtbl(src);
    }

    public class JintDynamicTestBehaviorMembersImmtbl : IJintDynamicTestBehaviorMembers
    {
        public JintDynamicTestBehaviorMembersImmtbl(
            IJintDynamicTestBehaviorMembers src)
        {
            AddMethodName = src.AddMethodName;
        }

        public string AddMethodName { get; }
    }

    public class JintDynamicTestBehaviorMembersMtbl : IJintDynamicTestBehaviorMembers
    {
        public JintDynamicTestBehaviorMembersMtbl()
        {
        }

        public JintDynamicTestBehaviorMembersMtbl(
            IJintDynamicTestBehaviorMembers src)
        {
            AddMethodName = src.AddMethodName;
        }

        public string AddMethodName { get; set; }
    }
}
