using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Turmerik.Helpers
{
    public static class ProgramH
    {
        public static readonly string ExecutingAssemmblyPath = AppDomain.CurrentDomain.BaseDirectory;

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
                ConsoleH.WithExcp(ex);
                Console.ResetColor();

                if (rethrow)
                {
                    throw;
                }
            }
        }
    }
}
