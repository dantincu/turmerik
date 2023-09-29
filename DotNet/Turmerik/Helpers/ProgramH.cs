using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Helpers
{
    public static class ProgramH
    {
        public static void Run(
            Action program)
        {
            try
            {
                program();
            }
            catch (Exception ex)
            {
                Console.Error.WithExcp(ex);
            }
        }
    }
}
