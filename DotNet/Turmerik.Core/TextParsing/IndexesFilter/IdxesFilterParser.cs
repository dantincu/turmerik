using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.Text;

namespace Turmerik.Core.TextParsing.IndexesFilter
{
    public interface IIdxesFilterParser
    {
        IdxesFilter ParseIdxesFilter(
            string rawArg);

        IdxesFilter[] ParseMultipleIdxesFilters(
            string rawArg);

        IdxesUpdateMapping[] ParseIdxesUpdateMapping(
            string rawArg);
    }

    public class IdxesFilterParser : IIdxesFilterParser
    {
        private const char ITEMS_LIST_SEP_CHR = ',';
        private const string ITEMS_SPREAD_STR = "..";

        public IdxesFilter ParseIdxesFilter(
            string rawArg)
        {
            var idxesFilter = new IdxesFilter();

            (var stIdxStr, var endIdxStr) = rawArg.SplitStr(
                (str, count) => str.IndexOf(ITEMS_SPREAD_STR));

            if (endIdxStr == null)
            {
                idxesFilter.SingleIdx = int.Parse(stIdxStr);
            }
            else
            {
                endIdxStr = endIdxStr.Substring(
                    ITEMS_SPREAD_STR.Length);

                if (!string.IsNullOrEmpty(stIdxStr))
                {
                    idxesFilter.StartIdx = int.Parse(stIdxStr);
                }

                if (!string.IsNullOrEmpty(endIdxStr))
                {
                    idxesFilter.EndIdx = int.Parse(endIdxStr);
                }
            }

            return idxesFilter;
        }

        public IdxesFilter[] ParseMultipleIdxesFilters(
            string rawArg) => rawArg.Split(
                ITEMS_LIST_SEP_CHR).Select(
                ParseIdxesFilter).ToArray();

        public IdxesUpdateMapping[] ParseIdxesUpdateMapping(
            string rawArg)
        {
            (var srcFilter, var trgFilter) = rawArg.SplitStr(
                (str, count) => str.IndexOf(
                    ConsoleArgsParser.OPTS_ARG_DELIM_CHAR));

            bool isSymetricalMapping = false;
            IdxesUpdateMapping symetricalMapping = null;

            if (trgFilter == null)
            {
                throw new ArgumentNullException(
                    $"Invalid idxes filter: {rawArg}");
            }
            else
            {
                trgFilter = trgFilter.Substring(1);

                if (trgFilter.FirstOrDefault() == ConsoleArgsParser.OPTS_ARG_DELIM_CHAR)
                {
                    isSymetricalMapping = true;
                    trgFilter = trgFilter.Substring(1);
                }
            }

            var mapping = new IdxesUpdateMapping
            {
                SrcIdxes = ParseMultipleIdxesFilters(srcFilter).ToList(),
                TrgIdxes = ParseMultipleIdxesFilters(trgFilter).ToList()
            };

            if (isSymetricalMapping)
            {
                symetricalMapping = new IdxesUpdateMapping
                {
                    SrcIdxes = mapping.TrgIdxes,
                    TrgIdxes = mapping.SrcIdxes
                };
            }

            IdxesUpdateMapping[] retArr;

            if (symetricalMapping != null)
            {
                retArr = [mapping, symetricalMapping];
            }
            else
            {
                retArr = [mapping];
            }

            return retArr;
        }
    }
}
