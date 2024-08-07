using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Dependencies;

namespace Turmerik.UnitTests
{
    public class PropertyInjectorUnitTest : UnitTestBase
    {
        [Fact]
        public void MainTest()
        {
            var parentComponent = new ParentComponent();
            var childComponent = new ChildComponent();

            var parentStr = parentComponent.GetParentStr();
            var childStr = childComponent.GetChildStr();

            Assert.Equal("Service1Value|Service2Value", parentStr);
            Assert.Equal("Service3Value|Service4Value", childStr);
        }

        public interface IService1
        {
            string Service1Value { get; }
        }

        public interface IService2
        {
            string Service2Value { get; }
        }

        public interface IService3
        {
            string Service3Value { get; }
        }

        public interface IService4
        {
            string Service4Value { get; }
        }

        public interface IParentComponent
        {
            string GetParentStr();
        }

        public interface IChildComponent : IParentComponent
        {
            string GetChildStr();
        }

        public class Service1 : IService1
        {
            public string Service1Value => nameof(Service1Value);
        }

        public class Service2 : IService2
        {
            public string Service2Value => nameof(Service2Value);
        }

        public class Service3 : IService3
        {
            public string Service3Value => nameof(Service3Value);
        }

        public class Service4 : IService4
        {
            public string Service4Value => nameof(Service4Value);
        }

        public class ParentComponent : IParentComponent
        {
            public ParentComponent()
            {
                ServiceProviderContainer.Instance.Value.Data.InjectAllSvcs(
                    this, typeof(ParentComponent),
                    (cmp, prop, svc) => prop.SetValue(cmp, svc));
            }

            [InjectSvc]
            public IService1 Service1 { get; init; }

            [InjectSvc]
            public IService2 Service2 { get; init; }

            public string GetParentStr() => string.Join("|",
                Service1.Service1Value,
                Service2.Service2Value);
        }

        public class ChildComponent : ParentComponent, IChildComponent
        {
            public ChildComponent()
            {
                ServiceProviderContainer.Instance.Value.Data.InjectAllSvcs(
                    this, typeof(ChildComponent),
                    (cmp, prop, svc) => prop.SetValue(cmp, svc));
            }

            [InjectSvc]
            public IService3 Service3 { get; init; }

            [InjectSvc]
            public IService4 Service4 { get; init; }

            public string GetChildStr() => string.Join("|",
                Service3.Service3Value,
                Service4.Service4Value);
        }
    }
}
