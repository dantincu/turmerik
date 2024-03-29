﻿using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.Dependencies;
using Turmerik.Core.Dependencies;
using Turmerik.Dependencies;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Notes.Dependencies;

namespace Turmerik.Notes.AspNetCore.Dependencies
{
    public static class NotesAspNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            TrmrkCoreServices.RegisterAll(services);
            TrmrkServices.RegisterAll(services);
            AspNetCoreServices.RegisterAll(services);
            TrmrkNoteServices.RegisterAll(services);

            return services;
        }
    }
}
