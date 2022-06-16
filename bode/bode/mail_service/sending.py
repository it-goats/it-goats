import time

from datetime import datetime, timedelta
from threading import Thread

import schedule

from dateutil import tz
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from bode.config import sendgrid_key
from bode.extensions import db
from bode.models.enums import TaskStatus
from bode.models.task.model import Task

client = SendGridAPIClient(sendgrid_key)


def send_notification(address, title, due_date, link):
    message = Mail(
        from_email="itgoatsteam@gmail.com",
        to_emails=address,
        subject="Notification",
        html_content=f"<h3>The deadline is approaching for task:</h3><h4>TITLE: </h4>{title}<br /><h4>"
        f"DUE DATE: </h4>{due_date}<br /><a href='{link}'><h4>CLICK</h4></a>",
    )
    client.send(message)


send_notification


def start_notify(app):
    def check_task_to_notify():
        nowutc = datetime.utcnow().replace(second=0, microsecond=0)
        with app.app_context():
            tasks = db.session.query(Task).filter(Task.status == TaskStatus.TODO.value).all()
        address = "itgoatsteam@gmail.com"  # get email from database
        for task in tasks:
            notify_time = 60  # in minutes, get this information from task, if none => not notify
            if notify_time is None:
                continue
            dt = nowutc + timedelta(minutes=notify_time)
            due_date = datetime.fromisoformat(str(task.due_date)).replace(second=0, microsecond=0)
            delta = dt - due_date.replace(tzinfo=None)
            if delta.total_seconds() != 0:
                continue
            link = f"https://it-goats.netlify.app/task/{task.id}"
            due_date_string = due_date.astimezone(tz.gettz("Europe/Warsaw")).strftime("%d-%m-%Y %H:%M")
            send_notification(address, task.title, due_date_string, link)

    def start_scheduler():
        schedule.every().minute.at(":00").do(check_task_to_notify)
        while True:
            schedule.run_pending()
            time.sleep(1)

    Thread(target=start_scheduler, daemon=True).start()
