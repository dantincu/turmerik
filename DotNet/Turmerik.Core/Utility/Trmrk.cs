using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Turmerik.Core.Text;

namespace Turmerik.Core.Utility
{
    public static class Trmrk
    {
        public static readonly string TrmrkPfx = nameof(Trmrk);
        public static readonly string TrmrkGuidStr;
        public static readonly string TrmrkGuidStrNoDash;
        public static readonly Guid TrmrkGuid;

        public static string TurmerikPfx;
        public static string TurmerikNsPfx;

        static Trmrk()
        {
            TrmrkGuidStr = "f1131f3d-a28f-444e-b816-82a2fd94b1a6";
            TrmrkGuidStrNoDash = TrmrkGuidStr.Split('-').JoinNotNullStr(null, false);
            TrmrkGuid = Guid.Parse(TrmrkGuidStr);
            TurmerikPfx = typeof(Trmrk).FullName.Split('.')[0];
            TurmerikNsPfx = $"{TurmerikPfx}.";
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
            this Assembly assembly) => assembly.FullName.StartsWith(TurmerikNsPfx);
    }
}
