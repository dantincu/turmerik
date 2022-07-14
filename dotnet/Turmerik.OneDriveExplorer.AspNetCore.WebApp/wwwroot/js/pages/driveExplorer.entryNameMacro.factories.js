import { trmrk } from '../common/main.js';
export class DriveItemNameMacroFactoryResolver {
    getName(existingEntriesArr, macro, recursive = false) {
        const factory = this.resolve(macro, recursive);
        let idx = 0;

        if (existingEntries.lenght > 0) {
            existingEntries = existingEntries.map(
                entry => entry.toLowerCase()
            );
        }

        let entryName = factory(existingEntries, idx);
        let entryNameToLower = entryName.toLowerCase();

        while (existingEntriesArr.indexOf(entryNameToLower)) {
            idx++;

            entryName = factory(existingEntries, idx);
            let newEntryNameToLower = entryName.toLowerCase();

            if (newEntryNameToLower === entryNameToLower) {
                throw "Same entry name returned for 2 different uniquifier indexes: " + entryName;
            } else {
                entryNameToLower = newEntryNameToLower;
            }
        }

        return entryName;
    }

    resolve(macro, recursive = false) {
        let factory;

        if (recursive) {
            factory = this.resolveRecursive(macro);
        } else {
            factory = this.resolveThis(macro);
        }

        return factory;
    }

    resolveRecursive(macro) {
        let factory = null;
        var coreFactory = this.resolveThis(macro);

        factory = (arr, idx) =>
        {
            let succeedingStr = "";

            if (macro.succeedingMacro != null)
            {
                var succeedingFactory = this.resolveRecursive(macro.succeedingMacro);
                succeedingStr = succeedingFactory(arr, idx);
            }
            
            const coreStr = coreFactory(arr, idx);

            const retStr = this.concatParts(
                macro, coreStr, succeedingStr);

            return retStr;
        };

        return factory;
    }

    resolveThis(macro) {
        let coreFactory;

        let name = macro.entryName ?? macro.constName ?? "";
        var wrappingChar = macro.srcNameFirstLetterWrappingChar;
        
        if (trmrk.core.isNonEmptyString(
            wrappingChar) && trmrk.core.isNonEmptyString(
                macro.srcName
            )) {
            coreFactory = this.getSrcNameFirstLetterWrappingCharFactory(
                macro, wrappingChar
            );
        } else if (trmrk.core.isNotNaNNumber(macro.numberSeed)) {
            coreFactory = this.getPaddedIndexFactory(trmrk);
        } else {
            coreFactory = (arr, idx) => name;
        }

        const factory = (arr, idx) =>
            {
                const coreStr = coreFactory(arr, idx);

                const retStr = this.concatParts(
                    macro, coreStr);

                return retStr;
            };

        return factory;
    }

    concatParts(macro, coreStr, succeedingStr = "") {
        const retStr = trmrk.core.strJoin([
            macro.preceedingDelimiter, coreStr,
            macro.succeedingDelimiter, succeedingStr],
            "", true);

        return retStr;
    }

    getSrcNameFirstLetterWrappingCharFactory(
        macro, wrappingChar) {
        const coreFactory = (arr, idx) => {
            const firstChar = macro.srcName[0];
            let newName = "";

            if (trmrk.core.isLetter(firstChar)) {
                newName = firstChar;
            }

            let number = trmrk.core.numOrDefault(
                macro.numberSeed, 0) + idx;

            if (number > 0) {
                newName += number;
            }

            newName = wrappingChar + newName + wrappingChar;
            return newName;
        };

        return coreFactory;
    }

    getPaddedIndexFactory(macro) {
        const digitsCount = macro.digitsCount ?? 1;
        let numberSeed = macro.numberSeed;

        const incrementNumber = macro.incrementNumber ?? false;
        const minNumber = macro.minNumber ?? 0;

        const maxAllowedNumber = Math.pow(10, digitsCount) - 1;
        const maxNumber = macro.maxNumber ?? maxAllowedNumber;

        if (!trmrk.core.isNotNaNNumber(numberSeed)) {
            if (incrementNumber)
            {
                numberSeed = minNumber;
            }
            else
            {
                numberSeed = maxNumber;
            }
        }

        this.validateMacroNumberOptions(
            digitsCount,
            numberSeed,
            minNumber,
            maxNumber,
            maxAllowedNumber);

        coreFactory = this.getPaddedIndexFactoryCore(
            incrementNumber,
            digitsCount,
            numberSeed,
            minNumber,
            maxNumber);

        return coreFactory;
    }

    getPaddedIndexFactoryCore(
        incrementNumber,
        digitsCount,
        numberSeed,
        minNumber,
        maxNumber
    ) {
        const coreFactory = (arr, idx) => {
            let number = numberSeed;
            
            if (idx > 0) {
                if (incrementNumber) {
                    number += idx;

                    if (number > maxNumber)
                    {
                        throw "Number " + number + " should not be greater than " + maxNumber;
                    }
                } else {
                    number -= idx;

                    if (number < minNumber)
                    {
                        throw "Number " + number + " should not be smaller than " + minNumber;
                    }
                }
            }

            let newName = trmrk.core.paddStr(
                number.toString(),
                digitsCount * -1, "0");
            
            return newName;
        };

        return coreFactory;
    }

    validateValidateMacroNumberOptions(
        digitsCount,
        numberSeed,
        minNumber,
        maxNumber,
        maxAllowedNumber
    ) {
        this.validateMacroNumber(
            "digitsCount",
            1,
            digitsCount,
            maxDigitsCount);

        this.validateMacroNumber(
            "minNumber",
            1,
            minNumber,
            maxAllowedNumber);

        this.validateMacroNumber(
            "maxNumber",
            minNumber,
            maxNumber,
            maxAllowedNumber);

        this.validateMacroNumber(
            "numberSeed",
            minNumber,
            numberSeed,
            maxNumber);
    }

    validateMacroNumber(propName,
        allowedMin, value, allowedMax
    ) {
        if (value < allowedMin || value > allowedMax)
        {
            throw "Value " + value + " for " + propName + " is outside of valid range " + allowedMin + "-" + allowedMax;
        }
    }
}

const driveItemNameMacroFactoryResolverInstn = new DriveItemNameMacroFactoryResolver();
export const driveItemNameMacroFactoryResolver = driveItemNameMacroFactoryResolverInstn;