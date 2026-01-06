export default function NotificationsPage() {
  const notifications = [
    {
      id: "notif-1",
      title: "Approval needed",
      message: "Mukono Family Clinic wants to use your package for Ben. Tap to review.",
      time: "10:34 AM",
    },
    {
      id: "notif-2",
      title: "Booking confirmed",
      message: "Your appointment at City medical Center is confirmed for tomorrow at 2:30 PM.",
      time: "9:15 AM",
    },
    {
      id: "notif-3",
      title: "Top up successful",
      message: "UGX 50,000 has been added to your wallet.",
      time: "8:45 AM",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-6 pb-10 pt-6">
      {notifications.length === 0 ? (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
          <div className="text-[64px] leading-none">🔕</div>
          <h2 className="mt-6 text-xl font-bold text-neutral-900">No notifications yet</h2>
          <p className="mt-3 max-w-xs text-base text-neutral-600">
            You&apos;ll see updates about your packages, bookings, and approvals here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <button className="text-base font-semibold text-secondary-900">Mark as read</button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-[28px] bg-neutral-100 px-5 py-5"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-secondary-900" />
                  <h3 className="text-base font-semibold text-neutral-900">
                    {notification.title}
                  </h3>
                </div>

                <div className="mt-4 h-px w-full bg-neutral-300" />

                <p className="mt-4 text-base leading-[160%] text-neutral-700">
                  {notification.message} {notification.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
