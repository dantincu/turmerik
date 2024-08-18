using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.Core.Utility
{
    public static class Trmrk
    {
        public static readonly string TrmrkPfx = nameof(Trmrk);
        public static readonly string TrmrkGuidStr;
        public static readonly string TrmrkGuidStrNoDash;
        public static readonly Guid TrmrkGuid;

        public static readonly string TurmerikPfx;
        public static readonly string TurmerikNsPfx;

        public static readonly string TurmerikCorePfx;
        public static readonly string TurmerikCoreNsPfx;

        static Trmrk()
        {
            var trmrkType = typeof(Trmrk);
            var trmrkNsParts = trmrkType.Namespace.Split('.');

            TrmrkGuidStr = "f1131f3d-a28f-444e-b816-82a2fd94b1a6";
            TrmrkGuidStrNoDash = TrmrkGuidStr.Split('-').JoinNotNullStr(null, false);
            TrmrkGuid = Guid.Parse(TrmrkGuidStr);
            TurmerikPfx = trmrkNsParts[0];
            TurmerikNsPfx = $"{TurmerikPfx}.";

            TurmerikCorePfx = trmrkNsParts.Take(
                2).ToArray().JoinStr(".");

            TurmerikCoreNsPfx = $"{TurmerikCorePfx}.";
        }

        public static TTrmrkObj Obj<TTrmrkObj>(
            Action<TTrmrkObj> buildAction = null) where TTrmrkObj : TrmrkObj
        {
            var obj = Activator.CreateInstance<TTrmrkObj>();
            obj.TrmrkGuid = TrmrkGuid;

            buildAction?.Invoke(obj);
            return obj;
        }

        public static bool IsTurmerikType(
            this Type type) => type.FullName.StartsWith(TurmerikNsPfx);

        public static bool IsTurmerikAssembly(
            this Assembly assembly) => assembly.GetName().Name.With(name =>
            {
                bool isTrmrkAsmb = name == TurmerikPfx;
                isTrmrkAsmb = isTrmrkAsmb || name.StartsWith(TurmerikNsPfx);

                return isTrmrkAsmb;
            });

        public static class Repo
        {
            public static class DotNet
            {
                public static readonly string DirName = nameof(DotNet);
            }
        }
    }
}
