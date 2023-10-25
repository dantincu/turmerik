using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirNamesPairGeneratorFactory
    {
        INoteDirNamesPairGenerator Create(
            NoteDirsPairSettingsMtbl trmrk);
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
            NoteDirsPairSettingsMtbl trmrk) => new NoteDirNamesPairGenerator(
                noteDirsPairGeneratorFactory, trmrk);
    }
}
