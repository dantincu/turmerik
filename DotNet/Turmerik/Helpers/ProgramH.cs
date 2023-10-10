using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Helpers
{
    public static class ProgramH
    {
        public static void Run(
            Action program,
            bool rethrow = false)
        {
            try
            {
                program();
            }
            catch (Exception ex)
            {
                Console.Error.WithExcp(ex);

                if (rethrow)
                {
                    throw;
                }
            }
        }
    }
}
