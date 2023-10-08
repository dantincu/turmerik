using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Actions
{
    public class UserMsgTuple
    {
        public UserMsgTuple(string message, bool? isSuccess)
        {
            Message = message;
            IsSuccess = isSuccess;
        }

        public string Message { get; }
        public bool? IsSuccess { get; }
    }
}
