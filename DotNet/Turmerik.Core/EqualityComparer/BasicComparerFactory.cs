using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.EqualityComparer
{
    public interface IBasicComparerFactory
    {
        BasicComparer<bool?> BoolNllbl();
    }

    public class BasicComparerFactory : IBasicComparerFactory
    {
        public BasicComparer<bool?> BoolNllbl() => new BasicComparer<bool?>(
            (first, second) =>
            {
                int retVal;

                if (first == second)
                {
                    retVal = 0;
                }
                else if (first == true || second == false)
                {
                    retVal = 1;
                }
                else
                {
                    retVal = -1;
                }

                return retVal;
            });
    }
}
