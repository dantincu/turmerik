﻿
using Microsoft.Extensions.DependencyInjection;
using Turmerik.DriveExplorer;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.MkNoteDirsPair.ConsoleApp;
using Turmerik.Text;
using Turmerik.Dependencies;

var svcProv = ServiceProviderContainer.Instance.Value.RegisterData(
    new ServiceCollection().AsOpts(svc => svc.AddScoped<DirNamesPairGenerator>()));

ProgH.Run(args, svcProv.GetRequiredService<DirNamesPairGenerator>());
