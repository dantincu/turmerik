using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes
{
    public class IdxesUpdater
    {
        public Dictionary<int, int> UpdateIdxes(
            IdxesUpdaterOpts opts)
        {
            NormalizeOpts(opts);

            var wka = new WorkArgs
            {
                Opts = opts,
                OutMap = new Dictionary<int, int>()
            };

            UpdateIdxes(wka);
            return wka.OutMap;
        }

        public void NormalizeOpts(
            IdxesUpdaterOpts opts)
        {
            if (opts.IdxIncVal == 0)
            {
                opts.IdxIncVal = opts.IncIdx ? 1 : -1;
            }

            if (opts.DfStIdx == 0)
            {
                opts.DfStIdx = opts.IncIdx ? opts.MinIdx : opts.MaxIdx;
            }

            if (opts.DfEndIdx == 0)
            {
                opts.DfEndIdx = opts.IncIdx ? opts.MaxIdx : opts.MinIdx;
            }

            /* opts.IdxComparison = opts.IdxComparison.IfNull(
                () => (i1, i2) => i1.CompareTo(i2) * opts.IdxIncVal); */

            opts.IdxComparison = opts.IdxComparison.IfNull(
                () => (i1, i2) =>
                {
                    var retVal = i1.CompareTo(i2) * opts.IdxIncVal;
                    return retVal;
                });
        }

        private void UpdateIdxes(WorkArgs wka)
        {
            wka.MappingArgs = GetMappingArgs(wka);

            foreach (var mappingArgs in wka.MappingArgs)
            {
                for (int i = 0; i < mappingArgs.SrcIdxes.Count; i++)
                {
                    var srcIdx = mappingArgs.SrcIdxes[i];
                    var trgIdx = mappingArgs.TrgIdxes[i];

                    if (wka.OutMap.TryGetValue(srcIdx,
                        out int existingTrgIdx))
                    {
                        throw new InvalidOperationException(string.Join(" ",
                            $"Some pair idxes filters overlap.",
                            $"Src idx {srcIdx} already has trg idx {existingTrgIdx}",
                            $"when trying to add a second one {trgIdx}"));
                    }
                    else
                    {
                        wka.OutMap.Add(srcIdx, trgIdx);
                    }
                }
            }

            if (wka.OutMap.Values.Count != wka.OutMap.Values.Distinct().Count())
            {
                throw new InvalidOperationException(
                    "Detected multiple pairs being set to the same idx");
            }

            if (wka.Opts.PrevIdxes.Except(wka.OutMap.Keys).Intersect(
                wka.OutMap.Values).Any())
            {
                throw new InvalidOperationException(
                    "Detected some pairs being set to existing idxes that would not be changed themselves");
            }
        }

        private List<MappingArgs> GetMappingArgs(
            WorkArgs wka) => wka.Opts.IdxesUpdateMappings.Select(
                idxesMapping =>
                {
                    var retObj = new MappingArgs
                    {
                        InArg = idxesMapping,
                        SrcIdxes = new List<int>(),
                        TrgIdxes = new List<int>()
                    };

                    FillIdxes(wka, retObj);
                    return retObj;
                }).ToList();

        private void FillIdxes(
            WorkArgs wka,
            MappingArgs mappingArgs)
        {
            foreach (var srcFilter in mappingArgs.InArg.SrcIdxes)
            {
                FillSrcIdxes(wka, mappingArgs, srcFilter);
            }

            foreach (var trgFilter in mappingArgs.InArg.TrgIdxes)
            {
                FillTrgIdxes(wka, mappingArgs, trgFilter);
            }
        }

        private void FillSrcIdxes(
            WorkArgs wka,
            MappingArgs mappingArgs,
            IdxesFilter idxesFilter)
        {
            if (idxesFilter.SingleIdx.HasValue)
            {
                mappingArgs.SrcIdxes.Add(
                    idxesFilter.SingleIdx.Value);
            }
            else
            {
                FillSrcIdxesCore(wka,
                    mappingArgs,
                    idxesFilter);
            }
        }

        private void FillTrgIdxes(
            WorkArgs wka,
            MappingArgs mappingArgs,
            IdxesFilter idxesFilter)
        {
            if (idxesFilter.SingleIdx.HasValue)
            {
                mappingArgs.TrgIdxes.Add(
                    idxesFilter.SingleIdx.Value);
            }
            else
            {
                FillTrgIdxesCore(wka,
                    mappingArgs,
                    idxesFilter);
            }
        }

        private void FillSrcIdxesCore(
            WorkArgs wka,
            MappingArgs mappingArgs,
            IdxesFilter idxesFilter)
        {
            IEnumerable<int> nmrbl;

            if (idxesFilter.StartIdx.HasValue)
            {
                nmrbl = wka.Opts.PrevIdxes.SkipWhile(
                    idx => wka.Opts.IdxComparison(
                        idxesFilter.StartIdx.Value, idx) > 0);

                if (idxesFilter.EndIdx.HasValue)
                {
                    nmrbl = nmrbl.TakeWhile(
                        idx => wka.Opts.IdxComparison(
                            idxesFilter.EndIdx.Value, idx) >= 0);
                }
            }
            else if (idxesFilter.EndIdx.HasValue)
            {
                nmrbl = wka.Opts.PrevIdxes.TakeWhile(
                    idx => wka.Opts.IdxComparison(
                        idxesFilter.EndIdx.Value, idx) >= 0);
            }
            else
            {
                nmrbl = wka.Opts.PrevIdxes;
            }

            mappingArgs.SrcIdxes.AddRange(nmrbl);
        }

        private void FillTrgIdxesCore(
            WorkArgs wka,
            MappingArgs mappingArgs,
            IdxesFilter idxesFilter)
        {
            var opts = wka.Opts;
            int count = mappingArgs.SrcIdxes.Count;

            IEnumerable<int> nmrbl = mappingArgs.SrcIdxes.Select(
                (idx, i) => i);

            if (idxesFilter.StartIdx.HasValue)
            {
                if (idxesFilter.EndIdx.HasValue)
                {
                    int trgCount = Math.Abs(
                        idxesFilter.EndIdx.Value - idxesFilter.StartIdx.Value) + 1;

                    if (trgCount != count)
                    {
                        throw new ArgumentException(string.Join(
                            " ", $"Filter with start idx {idxesFilter.StartIdx} and end idx {idxesFilter.EndIdx}",
                            $"totals a count of {trgCount} which is different than the source idxes count which is {count}"));
                    }
                }

                nmrbl = nmrbl.Select(i => idxesFilter.StartIdx.Value + i * opts.IdxIncVal);
            }
            else if (idxesFilter.EndIdx.HasValue)
            {
                nmrbl = nmrbl.Select(i => idxesFilter.EndIdx.Value - (count - i - 1) * opts.IdxIncVal);
            }
            else
            {
                nmrbl = nmrbl.Select(i => opts.DfStIdx + i * opts.IdxIncVal);
            }

            mappingArgs.TrgIdxes.AddRange(nmrbl);
        }

        public class WorkArgs
        {
            public IdxesUpdaterOpts Opts { get; set; }
            public Dictionary<int, int> OutMap { get; set; }

            public List<MappingArgs> MappingArgs { get; set; }
        }

        public class MappingArgs
        {
            public IdxesUpdateMapping InArg { get; set; }
            public List<int> SrcIdxes { get; set; }
            public List<int> TrgIdxes { get; set; }
        }
    }
}
