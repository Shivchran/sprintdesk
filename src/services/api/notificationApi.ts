export interface NotificationPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const BASE_URL =
  "https://jsonplaceholder.typicode.com/posts";

let notificationOffset = 0;

const NOTIFICATIONS_PER_REQUEST = 5;

export async function fetchNotifications(): Promise<
  NotificationPost[]
> {
  const start = notificationOffset;

  const response = await fetch(
    `${BASE_URL}?_start=${start}&_limit=${NOTIFICATIONS_PER_REQUEST}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch notifications"
    );
  }

  const notifications =
    (await response.json()) as NotificationPost[];

  // Move to the next set for testing
  notificationOffset +=
    NOTIFICATIONS_PER_REQUEST;

  return notifications;
}