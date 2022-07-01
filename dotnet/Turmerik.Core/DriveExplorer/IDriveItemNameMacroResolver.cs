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
        Func<string[], int, string, string> Resolve(Guid macroUuid);
        Func<string[], int, string, string> Resolve(DriveItemNameMacro macro);
    }

    public class DriveItemNameMacroFactoryResolver : IDriveItemNameMacroFactoryResolver
    {
        private static readonly int maxDigitsCount = MathH.Int32MaxValueDigitsCount - 1;
        private static readonly int maxAllowedNumber = Convert.ToInt32(Math.Pow(10, maxDigitsCount)) - 1;

        private readonly Dictionary<Guid, DriveItemNameMacro> registeredMacrosList;
        private readonly Dictionary<Guid, Func<string[], int, string, string>> registeredFactoriesList;

        public DriveItemNameMacroFactoryResolver()
        {
            registeredMacrosList = new Dictionary<Guid, DriveItemNameMacro>();
            registeredFactoriesList = new Dictionary<Guid, Func<string[], int, string, string>>();
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

        public Func<string[], int, string, string> Resolve(Guid macroUuid)
        {
            var retFactory = registeredFactoriesList[macroUuid];
            return retFactory;
        }

        public Func<string[], int, string, string> Resolve(DriveItemNameMacro macro)
        {
            Func<string[], int, string, string> retFactory;

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

        private Func<string[], int, string, string> GetFactory(DriveItemNameMacro macro)
        {
            Func<string[], int, string, string> factory = null;
            var coreFactory = GetFactoryCore(macro);

            bool hasPreceeding = macro.PreceedingMacro != null;
            bool hasSucceeding = macro.PreceedingMacro != null;

            if (!hasPreceeding && !hasSucceeding)
            {
                factory = coreFactory;
            }
            else if (hasPreceeding && hasSucceeding)
            {
                factory = (arr, idx, srcName) =>
                {
                    var preceedingFactory = Resolve(macro.PreceedingMacro);
                    var succeedingFactory = Resolve(macro.SucceedingMacro);

                    string preceedingStr = preceedingFactory(arr, idx, srcName);
                    string succeedingStr = succeedingFactory(arr, idx, srcName);

                    string coreStr = coreFactory(arr, idx, srcName);

                    string retStr = string.Concat(
                        preceedingStr,
                        coreStr,
                        succeedingStr);

                    return retStr;
                };
            }
            else if (hasPreceeding)
            {
                factory = (arr, idx, srcName) =>
                {
                    var preceedingFactory = Resolve(macro.PreceedingMacro);
                    string preceedingStr = preceedingFactory(arr, idx, srcName);

                    string coreStr = coreFactory(arr, idx, srcName);

                    string retStr = string.Concat(
                        preceedingStr,
                        coreStr);

                    return retStr;
                };
            }
            else if (hasSucceeding)
            {
                factory = (arr, idx, srcName) =>
                {
                    var succeedingFactory = Resolve(macro.SucceedingMacro);
                    string succeedingStr = succeedingFactory(arr, idx, srcName);

                    string coreStr = coreFactory(arr, idx, srcName);

                    string retStr = string.Concat(
                        coreStr,
                        succeedingStr);

                    return retStr;
                };
            }
            else
            {
                throw new InternalAppError(HttpStatusCode.InternalServerError);
            }

            return factory;
        }

        private Func<string[], int, string, string> GetFactoryCore(DriveItemNameMacro macro)
        {
            Func<string[], int, string, string> coreFactory, factory;
            string name = macro.EntryName ?? macro.ConstName;

            if (name != null)
            {
                coreFactory = (arr, idx, srcName) => name;
            }
            else if (macro.SrcNameFirstLetterWrappingChar.HasValue)
            {
                var wrappingChar = macro.SrcNameFirstLetterWrappingChar.Value;

                coreFactory = (arr, idx, srcName) =>
                {
                    string newName;
                    char firstChar = srcName.First();
                    
                    if (char.IsLetter(firstChar))
                    {
                        newName = firstChar.ToString();
                    }
                    else
                    {
                        newName = string.Empty;
                    }

                    if (idx > 0)
                    {
                        newName = string.Concat(
                            newName,
                            idx.ToString());
                    }

                    newName = $"{wrappingChar}{newName}{wrappingChar}";
                    return newName;
                };
            }
            else if (macro.NumberSeed.HasValue)
            {
                int digitsCount = macro.DigitsCount ?? 1;
                int numberSeed = macro.NumberSeed.Value;

                bool incrementNumber = macro.IncrementNumber ?? false;
                int minNumber = macro.MinNumber ?? 0;

                int maxNumber = macro.MaxNumber ?? maxAllowedNumber;

                ValidateMacroNumberOptions(
                    digitsCount,
                    numberSeed,
                    minNumber,
                    maxNumber);

                coreFactory = (arr, idx, srcName) =>
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

                    string newName = number.ToString();

                    if (newName.Length < digitsCount)
                    {
                        string padding = new string(Enumerable.Range(
                            0, digitsCount - newName.Length).Select(
                            i => ' ').ToArray());

                        newName = string.Concat(padding, newName);
                    }

                    return newName;
                };
            }
            else
            {
                throw new InternalAppError(HttpStatusCode.BadRequest);
            }

            factory = (arr, idx, srcName) =>
            {
                string coreStr = coreFactory(arr, idx, srcName);

                string retStr = string.Concat(
                    macro.PreceedingDelimiter,
                    coreStr,
                    macro.SucceedingDelimiter);

                return retStr;
            };

            return factory;
        }

        private void ValidateMacroNumberOptions(
            int digitsCount,
            int numberSeed,
            int minNumber,
            int maxNumber)
        {
            ValidateMacroNumber(
                nameof(digitsCount),
                1,
                digitsCount,
                maxDigitsCount);

            ValidateMacroNumber(
                nameof(minNumber),
                0,
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
                    $"Value {propName} outside of valid range [{allowedMin}-{allowedMax}]",
                    HttpStatusCode.BadRequest);
            }
        }
    }
}
