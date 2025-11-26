using Microsoft.CodeAnalysis.CSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public class TypeResolverOpts
    {
        public INameOrTypeT Type { get; set; }
        public DataTreeTraversalArgsCore<IDataTypeDeclarationT> DataTypes { get; set; }
    }

    public class TypeResolverResult
    {
        public IDataTypeDeclarationT? DeclaredType { get; set; }
        public bool IsGenericTypeArg { get; set; }
        public bool IsNullable { get; set; }
    }

    public class TypeResolverWorkArgs
    {
        public TypeResolverOpts Opts { get; set; }
        public TypeResolverResult Result { get; set; }
        public INameOrTypeT Type { get; set; }
        public int CurrentHcyLevel { get; set; }
    }

    public class TypeResolver
    {
        public TypeResolverResult Resolve(
            TypeResolverOpts opts)
        {
            var wka = new TypeResolverWorkArgs
            {
                Opts = opts,
                Result = new ()
            };

            Resolve(wka);
            return wka.Result;
        }

        public void Resolve(
            TypeResolverWorkArgs wka)
        {
            var opts = wka.Opts;
            var dataTypes = opts.DataTypes;
            var typeT = opts.Type;
            var result = wka.Result;

            if (typeT is NullableTypeNameT nullableType)
            {
                typeT = nullableType.ElementType;
                result.IsNullable = true;
            }

            wka.Type = typeT;

            if (TryFindMatchingAnyGenericParamName(
                opts, typeT, out var matchingType))
            {
                result.DeclaredType = matchingType;
                result.IsGenericTypeArg = true;
            }
            else
            {
                while (!TryResolve(wka) && (
                    wka.CurrentHcyLevel == 0 || wka.CurrentHcyLevel < dataTypes.PrevParentItems.Count))
                {
                    wka.CurrentHcyLevel++;
                }
            }
        }

        public bool TryFindMatchingAnyGenericParamName(
            TypeResolverOpts opts,
            INameOrTypeT typeT,
            out IDataTypeDeclarationT? genericDataType)
        {
            var dataTypes = opts.DataTypes;
            var typeName = typeT.Name;

            genericDataType = dataTypes.CurrentItem?.With(
                currentItem => IsGenericTypeParamOf(typeName, currentItem) switch
            {
                true => currentItem,
                false => dataTypes.ParentItem?.With(
                    parentItem => IsGenericTypeParamOf(typeName, parentItem) switch
                {
                    true => parentItem,
                    false => dataTypes.PrevParentItems.Reverse().FirstOrDefault(
                        prevParent => IsGenericTypeParamOf(typeName, prevParent))
                })
            });

            bool isMatching = genericDataType != null;
            return isMatching;
        }

        public bool IsGenericTypeParamOf(
            string typeName,
            IDataTypeDeclarationT candidateDataType) => candidateDataType
                .GenericTypeParamNamesList.Contains(typeName);

        public bool TryFindFirstMatching(
            List<IDataTypeDeclarationT> sibblinTypes,
            INameOrTypeT typeT,
            out IDataTypeDeclarationT? matchingType,
            INameOrTypeT? namespaceT)
        {
            bool isMatch = typeT is not PredefinedTypeNameT;

            if (isMatch)
            {
                if (typeT is QualifiedNameT qualifiedName)
                {
                    isMatch = TryFindFirstMatchingQualifiedName(
                        sibblinTypes,
                        qualifiedName.Left,
                        qualifiedName.Right,
                        out matchingType,
                        namespaceT);
                }
                else
                {
                    isMatch = TryFindFirstMatchingSimpleName(sibblinTypes, typeT, out matchingType);
                }
            }
            else
            {
                matchingType = null;
            }

            return isMatch;
        }

        public bool TryFindFirstMatchingQualifiedName(
            List<IDataTypeDeclarationT> sibblinTypes,
            INameOrTypeT left,
            INameOrTypeT right,
            out IDataTypeDeclarationT? matchingType,
            INameOrTypeT? namespaceT)
        {
            bool isMatch;
            matchingType = null;

            if (left is QualifiedNameT qualifiedName)
            {
                if (namespaceT != null)
                {
                    List<INameOrTypeT> rightRest = new();

                    if (MatchesNamespace(
                        namespaceT,
                        qualifiedName.Left,
                        rightRest))
                    {
                        if (rightRest.Any())
                        {
                            isMatch = TryFindFirstMatchingQualifiedName(
                                sibblinTypes, qualifiedName.Left, qualifiedName.Right, out matchingType, rightRest);
                        }
                        else
                        {
                            isMatch = TryFindFirstMatchingSimpleName(sibblinTypes, right, out matchingType);
                        }
                    }
                    else
                    {
                        isMatch = false;
                        matchingType = null;
                    }
                }
                else
                {
                    isMatch = TryFindFirstMatchingQualifiedName(
                        sibblinTypes, qualifiedName.Left, qualifiedName.Right, out matchingType, namespaceT);
                }
            }
            else
            {
                isMatch = TryFindFirstMatchingSimpleName(sibblinTypes, left, out matchingType);
            }

            isMatch = isMatch && TryFindFirstMatchingSimpleName(
                matchingType!.NestedTypes, right, out matchingType);

            if (!isMatch)
            {
                matchingType = null;
            }

            return isMatch;
        }

        public bool TryFindFirstMatchingQualifiedName(
            List<IDataTypeDeclarationT> sibblinTypes,
            INameOrTypeT left,
            INameOrTypeT right,
            out IDataTypeDeclarationT? matchingType,
            List<INameOrTypeT> rightRest)
        {
            bool isMatch;
            matchingType = null;

            if (left is QualifiedNameT qualifiedName)
            {
                if (rightRest.Any())
                {
                    if (TryFindFirstMatchingSimpleName(sibblinTypes, rightRest.First(), out matchingType))
                    {
                        rightRest.RemoveAt(0);

                        isMatch = TryFindFirstMatchingQualifiedName(
                            matchingType!.NestedTypes,
                            left, right, out matchingType, rightRest);
                    }
                    else
                    {
                        isMatch = false;
                    }
                }
                else
                {
                    isMatch = TryFindFirstMatchingSimpleName(sibblinTypes, right, out matchingType);
                }
            }
            else
            {
                isMatch = TryFindFirstMatchingSimpleName(sibblinTypes, left, out matchingType);
            }

            isMatch = isMatch && TryFindFirstMatchingSimpleName(
                matchingType!.NestedTypes, right, out matchingType);

            if (!isMatch)
            {
                matchingType = null;
            }

            return isMatch;
        }

        public bool TryFindFirstMatchingSimpleName(
            List<IDataTypeDeclarationT> sibblinTypes,
            INameOrTypeT typeT,
            out IDataTypeDeclarationT? matchingType)
        {
            matchingType = sibblinTypes.FirstOrDefault(
                candidateType => SimpleNameMatches(candidateType, typeT));

            bool isMatch = matchingType != null;
            return isMatch;
        }

        public bool SimpleNameMatches(
            IDataTypeDeclarationT declaredType,
            INameOrTypeT typeT)
        {
            bool isMatch;

            if (typeT is GenericNameT genericName)
            {
                isMatch = (typeT.Name == declaredType.Name) && (
                    genericName.GenericArgsList.Count == declaredType.GenericTypeParamNamesList.Count);
            }
            else if (typeT is IdentifierNameT)
            {
                isMatch = typeT.Name == declaredType.Name;
            }
            else
            {
                throw new TrmrkException($"Simple name matching not supported for type {typeT.GetType().GetTypeFullDisplayName()}");
            }

            return isMatch;
        }

        public bool MatchesNamespace(
            INameOrTypeT namespaceT,
            INameOrTypeT qualifiedName,
            List<INameOrTypeT> rightRest)
        {
            bool isMatch;

            if (namespaceT is IdentifierNameT)
            {
                if (qualifiedName is IdentifierNameT)
                {
                    isMatch = namespaceT.Name == qualifiedName.Name;
                }
                else if (qualifiedName is QualifiedNameT qualifiedNameT)
                {
                    rightRest.Insert(0, qualifiedNameT.Right);
                    isMatch = MatchesNamespace(namespaceT, qualifiedNameT.Left, rightRest);
                }
                else
                {
                    throw new TrmrkException($"Cannot match type {qualifiedName.GetType().GetTypeFullDisplayName()} with a namespace");
                }
            }
            else if (namespaceT is QualifiedNameT namespaceQ)
            {
                if (qualifiedName is QualifiedNameT qualifiedNameT)
                {
                    rightRest.Insert(0, qualifiedNameT.Right);
                    isMatch = MatchesNamespace(namespaceQ.Left, qualifiedNameT.Left, rightRest);
                }
                else if (qualifiedName is IdentifierNameT)
                {
                    isMatch = false;
                }
                else
                {
                    throw new TrmrkException($"Cannot match type {qualifiedName.GetType().GetTypeFullDisplayName()} with a namespace");
                }
            }
            else
            {
                throw new TrmrkException($"Type {qualifiedName.GetType().GetTypeFullDisplayName()} is not a namespace");
            }

            return isMatch;
        }

        private bool TryResolve(TypeResolverWorkArgs wka)
        {
            var opts = wka.Opts;
            var result = wka.Result;
            var typeT = wka.Type;
            var dataTypes = opts.DataTypes;

            if (wka.CurrentHcyLevel > 1)
            {
                var prevParent = dataTypes.PrevParentItems.Skip(
                    wka.CurrentHcyLevel).FirstOrDefault();

                if (prevParent != null)
                {
                    if (TryFindFirstMatching(
                        prevParent.ChildNodesOrTokens.OfType<IDataTypeDeclarationT>().ToList(),
                        typeT, out var matchingType, prevParent.Namespace?.Name))
                    {
                        result.DeclaredType = matchingType;
                    }
                }
            }
            else if (wka.CurrentHcyLevel == 1)
            {
                if (dataTypes.ParentItem != null && TryFindFirstMatching(
                    dataTypes.ParentItem.ChildNodesOrTokens.OfType<IDataTypeDeclarationT>().ToList(),
                    typeT, out var matchingType, dataTypes.ParentItem.Namespace?.Name))
                {
                    result.DeclaredType = matchingType;
                }
            }
            else
            {
                if (TryFindFirstMatching(
                    dataTypes.CurrentItem!.ChildNodesOrTokens.OfType<IDataTypeDeclarationT>().ToList(),
                    typeT, out var matchingType, dataTypes.CurrentItem.Namespace?.Name))
                {
                    result.DeclaredType = matchingType;
                }
            }

            bool resolved = result.DeclaredType != null;
            return resolved;
        }
    }
}
