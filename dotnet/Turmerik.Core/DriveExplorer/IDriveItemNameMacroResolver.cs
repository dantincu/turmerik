using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using Turmerik.Core.Components;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveItemNameMacroFactoryResolver
    {
        void RegisterMacros(DriveItemNameMacro[] driveItemNameMacrosArr);
        Func<string[], int, string> Resolve(Guid macroUuid);
        Func<string[], int, string> Resolve(DriveItemNameMacro macro);
    }

    public class DriveItemNameMacroFactoryResolver : IDriveItemNameMacroFactoryResolver
    {
        private static readonly int maxDigitsCount = MathH.Int32MaxValueDigitsCount - 1;

        private readonly Dictionary<Guid, DriveItemNameMacro> registeredMacrosList;
        private readonly Dictionary<Guid, Func<string[], int, string>> registeredFactoriesList;

        public DriveItemNameMacroFactoryResolver()
        {
            registeredMacrosList = new Dictionary<Guid, DriveItemNameMacro>();
            registeredFactoriesList = new Dictionary<Guid, Func<string[], int, string>>();
        }

        public void RegisterMacros(DriveItemNameMacro[] driveItemNameMacrosArr)
        {
            foreach (var macro in driveItemNameMacrosArr)
            {
                var uuid = macro.MacroUuid.Value;
                registeredMacrosList.Add(uuid, macro);

                var factory = GetFactory(macro);
                registeredFactoriesList.Add(uuid, factory);
            }
        }

        public Func<string[], int, string> Resolve(Guid macroUuid)
        {
            var retFactory = registeredFactoriesList[macroUuid];
            return retFactory;
        }

        public Func<string[], int, string> Resolve(DriveItemNameMacro macro)
        {
            Func<string[], int, string> retFactory;

            if (macro.MacroUuid.HasValue)
            {
                retFactory = Resolve(macro.MacroUuid.Value);
            }
            else
            {
                retFactory = GetFactory(macro);
            }

            return retFactory;
        }

        private Func<string[], int, string> GetFactory(DriveItemNameMacro macro)
        {
            Func<string[], int, string> factory = null;
            var coreFactory = GetFactoryCore(macro);

            factory = (arr, idx) =>
            {
                string succeedingStr = null;

                if (macro.SucceedingMacro != null)
                {
                    var succeedingFactory = Resolve(macro.SucceedingMacro);
                    succeedingStr = succeedingFactory(arr, idx);
                }
                
                string coreStr = coreFactory(arr, idx);

                string retStr = string.Concat(
                    macro.PreceedingDelimiter,
                    coreStr,
                    macro.SucceedingDelimiter,
                    succeedingStr);

                return retStr;
            };

            return factory;
        }

        private Func<string[], int, string> GetFactoryCore(DriveItemNameMacro macro)
        {
            Func<string[], int, string> coreFactory, factory;
            coreFactory = this.GetCoreFactory(macro);

            factory = (arr, idx) =>
            {
                string coreStr = coreFactory(arr, idx);

                string retStr = string.Concat(
                    macro.PreceedingDelimiter,
                    coreStr,
                    macro.SucceedingDelimiter);

                return retStr;
            };

            return factory;
        }

        private Func<string[], int, string> GetCoreFactory(DriveItemNameMacro macro)
        {
            Func<string[], int, string> coreFactory;
            string name = macro.EntryName ?? macro.ConstName;

            var wrappingChar = macro.SrcNameFirstLetterWrappingChar ?? default;

            if (wrappingChar != default)
            {
                coreFactory = this.GetSrcNameFirstLetterWrappingCharFactory(
                    macro, wrappingChar);
            }
            else if (macro.NumberSeed.HasValue)
            {
                coreFactory = GetPaddedIndexFactory(macro);
            }
            else
            {
                coreFactory = (arr, idx) => name;
            }

            return coreFactory;
        }

        private Func<string[], int, string> GetSrcNameFirstLetterWrappingCharFactory(
            DriveItemNameMacro macro, char wrappingChar)
        {
            Func<string[], int, string> coreFactory = (arr, idx) =>
            {
                string newName;
                char firstChar = macro.SrcName.First();

                if (char.IsLetter(firstChar))
                {
                    newName = firstChar.ToString();
                }
                else
                {
                    newName = string.Empty;
                }

                int number = (macro.NumberSeed ?? 0) + idx;

                if (number > 0)
                {
                    newName = string.Concat(
                        newName,
                        number.ToString());
                }

                newName = $"{wrappingChar}{newName}{wrappingChar}";
                return newName;
            };

            return coreFactory;
        }

        private Func<string[], int, string> GetPaddedIndexFactory(
            DriveItemNameMacro macro)
        {
            int digitsCount = macro.DigitsCount ?? 1;
            int numberSeed = macro.NumberSeed ?? -1;

            bool incrementNumber = macro.IncrementNumber ?? false;
            int minNumber = macro.MinNumber ?? 1;

            int maxAllowedNumber = Convert.ToInt32(Math.Pow(10, digitsCount)) - 1;
            int maxNumber = macro.MaxNumber ?? maxAllowedNumber;

            if (numberSeed < 0)
            {
                if (incrementNumber)
                {
                    numberSeed = minNumber;
                }
                else
                {
                    numberSeed = maxNumber;
                }
            }

            ValidateMacroNumberOptions(
                digitsCount,
                numberSeed,
                minNumber,
                maxNumber,
                maxAllowedNumber);

            Func<string[], int, string> coreFactory = this.GetPaddedIndexFactoryCore(
                macro,
                incrementNumber,
                digitsCount,
                numberSeed,
                minNumber,
                maxNumber);

            return coreFactory;
        }

        private Func<string[], int, string> GetPaddedIndexFactoryCore(
            DriveItemNameMacro macro,
            bool incrementNumber,
            int digitsCount,
            int numberSeed,
            int minNumber,
            int maxNumber)
        {
            Func<string[], int, string> coreFactory = (arr, idx) =>
            {
                int number = numberSeed;

                if (idx > 0)
                {
                    if (incrementNumber)
                    {
                        number += idx;

                        if (number > maxNumber)
                        {
                            throw new InternalAppError(HttpStatusCode.BadRequest);
                        }
                    }
                    else
                    {
                        number -= idx;

                        if (number < minNumber)
                        {
                            throw new InternalAppError(HttpStatusCode.BadRequest);
                        }
                    }
                }

                string newName = number.ToString($"D{digitsCount}");
                return newName;
            };

            return coreFactory;
        }

        private void ValidateMacroNumberOptions(
            int digitsCount,
            int numberSeed,
            int minNumber,
            int maxNumber,
            int maxAllowedNumber)
        {
            ValidateMacroNumber(
                nameof(digitsCount),
                1,
                digitsCount,
                maxDigitsCount);

            ValidateMacroNumber(
                nameof(minNumber),
                1,
                minNumber,
                maxAllowedNumber);

            ValidateMacroNumber(
                nameof(maxNumber),
                minNumber,
                maxNumber,
                maxAllowedNumber);

            ValidateMacroNumber(
                nameof(numberSeed),
                minNumber,
                numberSeed,
                maxNumber);
        }

        private void ValidateMacroNumber(
            string propName,
            int allowedMin,
            int value,
            int allowedMax)
        {
            if (value < allowedMin || value > allowedMax)
            {
                throw new InternalAppError(
                    $"Value {value} for {propName} is outside of valid range [{allowedMin}-{allowedMax}]",
                    HttpStatusCode.BadRequest);
            }
        }
    }
}
