using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.QuickMarks.AvaloniaApp.ViewModels
{
    public class UserMsgTuple
    {
        public UserMsgTuple(string message, bool? isSuccess)
        {
            Message = message;
            IsSuccess = isSuccess;
        }

        public string Message { get; }
        public bool? IsSuccess { get; }
    }

    public class UserMsgObservable : IObservable<bool>
    {
        private readonly List<UserMsgObserverSubscription> subscriptions = new();

        public void Execute(bool execute)
        {
            foreach (var subscription in subscriptions)
            {
                subscription.Execute(execute);
            }
        }

        public IDisposable Subscribe(
            IObserver<bool> observer)
        {
            var subscription = new UserMsgObserverSubscription(observer);
            subscriptions.Add(subscription);

            return subscription;
        }
    }

    public class UserMsgObserverSubscription : IDisposable
    {
        private IObserver<bool> observer;

        public UserMsgObserverSubscription(IObserver<bool> observer)
        {
            this.observer = observer;
        }

        public void Execute(bool execute)
        {
            observer.OnNext(execute);
        }

        public void Dispose()
        {
        }
    }
}
