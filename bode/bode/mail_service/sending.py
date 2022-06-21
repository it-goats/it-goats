from datetime import datetime, timedelta, timezone

from dateutil import tz
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from bode.config import sendgrid_key
from bode.models.enums import TaskStatus
from bode.models.notifications_data.model import NotificationsData
from bode.models.task.model import Task

client = SendGridAPIClient(sendgrid_key)


def send_notification(address, task):
    link = f"https://it-goats.netlify.app/task/{task.id}"
    due_date = task.due_date.astimezone(tz.gettz("Europe/Warsaw")).strftime("%d-%m-%Y %H:%M")

    message = Mail(
        from_email="itgoatsteam@gmail.com",
        to_emails=address,
        subject="Notification",
        html_content=f"<h3>The deadline is approaching for task:</h3><h4>TITLE: </h4>{task.title}<br /><h4>"
        f"DUE DATE: </h4>{due_date}<br /><a href='{link}'><h4>CLICK</h4></a>",
    )
    client.send(message)


def check_tasks_to_notify():
    settings = NotificationsData.get()

    if settings.email is None:
        return

    now = datetime.utcnow().replace(second=0, microsecond=0, tzinfo=timezone.utc)
    last_sent_at = settings.last_sent_at or datetime.fromtimestamp(1, timezone.utc)

    filters = [
        Task.status == TaskStatus.TODO.value,
        Task.due_date.is_not(None),
        Task.notify_before_minutes.is_not(None),
        Task.due_date > now,
    ]

    for task in Task.query.filter(*filters).all():
        notify_time = task.due_date - timedelta(minutes=task.notify_before_minutes)
        if last_sent_at <= notify_time <= now:

            send_notification(settings.email, task)

    NotificationsData.update_last_sent_at(now.replace(tzinfo=timezone.utc))
