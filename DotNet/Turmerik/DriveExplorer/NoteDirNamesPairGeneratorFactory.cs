using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirNamesPairGeneratorFactory
    {
        INoteDirNamesPairGenerator Create(
            NoteDirsPairSettings trmrk);
    }

    public class NoteDirNamesPairGeneratorFactory : INoteDirNamesPairGeneratorFactory
    {
        private readonly INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory;

        public NoteDirNamesPairGeneratorFactory(
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory)
        {
            this.noteDirsPairGeneratorFactory = noteDirsPairGeneratorFactory ?? throw new ArgumentNullException(nameof(noteDirsPairGeneratorFactory));
        }

        public INoteDirNamesPairGenerator Create(
            NoteDirsPairSettings trmrk) => new NoteDirNamesPairGenerator(
                noteDirsPairGeneratorFactory, trmrk);
    }
}
