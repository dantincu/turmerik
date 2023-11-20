using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Helpers
{
    public static class WinFormsH
    {
        public static void InvokeIfReq(
            this Control control,
            Action action)
        {
            if (control.InvokeRequired)
            {
                control.Invoke(action);
            }
            else
            {
                action();
            }
        }

        public static T InvokeIfReq<T>(
            this Control control,
            Func<T> action)
        {
            T retVal;

            if (control.InvokeRequired)
            {
                retVal = default;

                control.Invoke(
                    () => retVal = action());
            }
            else
            {
                retVal = action();
            }

            return retVal;
        }
    }
}
