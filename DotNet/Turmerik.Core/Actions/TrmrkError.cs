using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Turmerik.Core.Actions
{
    public class TrmrkError
    {
        public string? Message { get; set; }
        public string? Code { get; set; }
        public HttpStatusCode? HttpStatusCode { get; set; }
    }
}
