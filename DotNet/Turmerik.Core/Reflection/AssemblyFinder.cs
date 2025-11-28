using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Xml.Linq;

namespace Turmerik.Core.Reflection
{
    public interface IAssemblyFinder
    {
        AssemblyWrapper? FindAssembly(
            Func<AssemblyWrapper, int, int, bool> predicate);
    }

    public class AssemblyWrapper
    {
        public AssemblyWrapper(
            Lazy<Assembly> asmb,
            AssemblyName name,
            Lazy<AssemblyWrapper[]> referencedAssemblies)
        {
            Asmb = asmb ?? throw new ArgumentNullException(
                nameof(asmb));

            Name = name ?? throw new ArgumentNullException(
                nameof(name));

            ReferencedAssemblies = referencedAssemblies ?? throw new ArgumentNullException(
                nameof(referencedAssemblies));
        }

        public Lazy<Assembly> Asmb { get; }
        public AssemblyName Name { get; }
        public Lazy<AssemblyWrapper[]> ReferencedAssemblies { get; }
    }

    public class AssemblyFinder : IAssemblyFinder
    {
        private readonly List<AssemblyWrapper> allAssembliesList;

        public AssemblyFinder()
        {
            allAssembliesList = new();
        }

        public AssemblyWrapper? FindAssembly(
            Func<AssemblyWrapper, int, int, bool> predicate)
        {
            LoadFirstAssembliesIfReq();
            var lastLoadedAsmbsArr = allAssembliesList.ToArray();
            int skipLoadedCount = 0;
            int lastLoadedCount = lastLoadedAsmbsArr.Length;

            Func<AssemblyWrapper?> getMatchingWrapper = () => lastLoadedAsmbsArr.Where(
                (asmb, i) => predicate(asmb, skipLoadedCount + i, allAssembliesList.Count)).FirstOrDefault();

            var matchingWrapper = getMatchingWrapper();

            while (matchingWrapper == null)
            {
                int allLoadedCount = allAssembliesList.Count;

                while (allAssembliesList.Count == allLoadedCount)
                {
                    foreach (var loadedAsmb in allAssembliesList)
                    {
                        _ = loadedAsmb.ReferencedAssemblies.Value;

                        if (allAssembliesList.Count != allLoadedCount)
                        {
                            break;
                        }
                    }
                }

                skipLoadedCount += lastLoadedCount;

                lastLoadedAsmbsArr = allAssembliesList.Skip(
                    skipLoadedCount).ToArray();

                lastLoadedCount = lastLoadedAsmbsArr.Length;
                matchingWrapper = getMatchingWrapper();
            }

            return matchingWrapper;
        }

        private void LoadFirstAssembliesIfReq()
        {
            if (!allAssembliesList.Any())
            {
                foreach (var asmb in AppDomain.CurrentDomain.GetAssemblies())
                {
                    LoadAsmbIfReq(asmb, null);
                }
            }
        }

        private AssemblyWrapper LoadAsmbIfReq(
            Assembly? asmb,
            AssemblyName? asmbName)
        {
            asmbName ??= asmb!.GetName();

            var matchingWrapper = allAssembliesList.FirstOrDefault(
                wrapper => AsmbNamesAreEqual(asmbName, wrapper));

            if (matchingWrapper == null)
            {
                lock (allAssembliesList)
                {
                    matchingWrapper = allAssembliesList.FirstOrDefault(
                        wrapper => AsmbNamesAreEqual(asmbName, wrapper));

                    if (matchingWrapper == null)
                    {
                        asmb ??= Assembly.Load(asmbName);

                        matchingWrapper = new(
                            new (() => asmb ??= Assembly.Load(asmbName),
                                LazyThreadSafetyMode.ExecutionAndPublication),
                            asmbName,
                            new (() => asmb.GetReferencedAssemblies().Select(
                                refAsmbName => LoadAsmbIfReq(null, refAsmbName)).ToArray(),
                                LazyThreadSafetyMode.ExecutionAndPublication));

                        allAssembliesList.Add(matchingWrapper);
                    }
                }
            }

            return matchingWrapper;
        }

        private bool AsmbNamesAreEqual(
            AssemblyName asmbName,
            AssemblyWrapper loadedWrapper)
        {
            bool areEqual = AssemblyName.ReferenceMatchesDefinition(
                asmbName, loadedWrapper.Name);

            return areEqual;
        }
    }
}
