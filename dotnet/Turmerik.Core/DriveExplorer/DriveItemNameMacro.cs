using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveItemNameMacro
    {
        Guid? MacroUuid { get; }
        string MacroName { get; }
        string MacroDescription { get; }
        string EntryName { get; }
        string SrcName { get; }
        string ConstName { get; }
        char? SrcNameFirstLetterWrappingChar { get; }
        int? NumberSeed { get; }
        int? MinNumber { get; }
        int? MaxNumber { get; }
        bool? IncrementNumber { get; }
        int? DigitsCount { get; }
        string PreceedingDelimiter { get; }
        string SucceedingDelimiter { get; }
        IDriveItemNameMacro GetSucceedingMacro();
    }

    public class DriveItemNameMacroImmtbl : IDriveItemNameMacro
    {
        public DriveItemNameMacroImmtbl(IDriveItemNameMacro src, Guid? macroUuid = null)
        {
            this.MacroUuid = macroUuid;
            this.MacroName = src.MacroName;
            this.MacroDescription = src.MacroDescription;
            this.EntryName = src.EntryName;
            this.SrcName = src.SrcName;
            this.ConstName = src.ConstName;
            this.SrcNameFirstLetterWrappingChar = src.SrcNameFirstLetterWrappingChar;
            this.NumberSeed = src.NumberSeed;
            this.MinNumber = src.MinNumber;
            this.MaxNumber = src.MaxNumber;
            this.IncrementNumber = src.IncrementNumber;
            this.DigitsCount = src.DigitsCount;
            this.PreceedingDelimiter = src.PreceedingDelimiter;
            this.SucceedingDelimiter = src.SucceedingDelimiter;

            this.SucceedingMacro = src.GetSucceedingMacro().IfNotNull(
                val => new DriveItemNameMacroImmtbl(val));
        }

        public Guid? MacroUuid { get; }
        public string MacroName { get; }
        public string MacroDescription { get; }
        public string EntryName { get; }
        public string SrcName { get; }
        public string ConstName { get; }
        public char? SrcNameFirstLetterWrappingChar { get; }
        public int? NumberSeed { get; }
        public int? MinNumber { get; }
        public int? MaxNumber { get; }
        public bool? IncrementNumber { get; }
        public int? DigitsCount { get; }
        public string PreceedingDelimiter { get; }
        public string SucceedingDelimiter { get; }

        public DriveItemNameMacroImmtbl SucceedingMacro { get; set; }

        public IDriveItemNameMacro GetSucceedingMacro() => this.SucceedingMacro;
    }

    public class DriveItemNameMacroMtbl : IDriveItemNameMacro
    {
        public DriveItemNameMacroMtbl()
        {
        }

        public DriveItemNameMacroMtbl(IDriveItemNameMacro src, Guid? macroUuid = null)
        {
            this.MacroUuid = macroUuid;
            this.MacroName = src.MacroName;
            this.MacroDescription = src.MacroDescription;
            this.EntryName = src.EntryName;
            this.SrcName = src.SrcName;
            this.ConstName = src.ConstName;
            this.SrcNameFirstLetterWrappingChar = src.SrcNameFirstLetterWrappingChar;
            this.NumberSeed = src.NumberSeed;
            this.MinNumber = src.MinNumber;
            this.MaxNumber = src.MaxNumber;
            this.IncrementNumber = src.IncrementNumber;
            this.DigitsCount = src.DigitsCount;
            this.PreceedingDelimiter = src.PreceedingDelimiter;
            this.SucceedingDelimiter = src.SucceedingDelimiter;

            this.SucceedingMacro = src.GetSucceedingMacro().IfNotNull(
                item => new DriveItemNameMacroMtbl(item));
        }

        public Guid? MacroUuid { get; set; }
        public string MacroName { get; set; }
        public string MacroDescription { get; set; }
        public string EntryName { get; set; }
        public string SrcName { get; set; }
        public string ConstName { get; set; }
        public char? SrcNameFirstLetterWrappingChar { get; set; }
        public int? NumberSeed { get; set; }
        public int? MinNumber { get; set; }
        public int? MaxNumber { get; set; }
        public bool? IncrementNumber { get; set; }
        public int? DigitsCount { get; set; }
        public string PreceedingDelimiter { get; set; }
        public string SucceedingDelimiter { get; set; }

        public DriveItemNameMacroMtbl SucceedingMacro { get; set; }

        public IDriveItemNameMacro GetSucceedingMacro() => this.SucceedingMacro;
    }
}
