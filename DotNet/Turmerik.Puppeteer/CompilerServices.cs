using System.ComponentModel;

namespace System.Runtime.CompilerServices
{
    /// <summary>
    /// Created this class after reading https://stackoverflow.com/questions/62648189/testing-c-sharp-9-0-in-vs2019-cs0518-isexternalinit-is-not-defined-or-imported <br /> <br />
    /// I got on that page after encountering C# compiler error saying "Predefined type 'System.Runtime.CompilerServices.IsExternalInit' is not defined or imported"
    /// when replacing the setters with init accessors for some properties of type <see cref="Turmerik.Notes.Md.MdObjectsRetrieverArgs{TObj}"/> <br /> <br />
    /// And just like the answers on that stackoverflow page say, the compiler error vanished after me creating this class under this namespace
    /// </summary>
    [EditorBrowsable(EditorBrowsableState.Never)]
    internal static class IsExternalInit { }
}