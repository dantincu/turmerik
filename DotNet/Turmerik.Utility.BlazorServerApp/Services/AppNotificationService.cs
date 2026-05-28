namespace Turmerik.Utility.BlazorServerApp.Services
{
    public enum NotificationLevel { Info, Success, Warning, Error }

    public record AppNotification(string Message, NotificationLevel Level = NotificationLevel.Info);

    public class AppNotificationService
    {
        private AppNotification? _current;

        public AppNotification? Current => _current;

        public event Action? OnChange;

        public void Notify(string message, NotificationLevel level = NotificationLevel.Info)
        {
            _current = new AppNotification(message, level);
            OnChange?.Invoke();
        }

        public void NotifySuccess(string message) => Notify(message, NotificationLevel.Success);
        public void NotifyError(string message) => Notify(message, NotificationLevel.Error);
        public void NotifyWarning(string message) => Notify(message, NotificationLevel.Warning);
        public void Clear() { _current = null; OnChange?.Invoke(); }
    }
}
