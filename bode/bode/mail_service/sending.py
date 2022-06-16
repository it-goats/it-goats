import time

from datetime import datetime, timedelta
from threading import Thread

import schedule

from dateutil import tz
from mailjet_rest import Client

from bode.config import mailjet_key
from bode.extensions import db
from bode.models.enums import TaskStatus
from bode.models.task.model import Task

mailjet = Client(auth=mailjet_key, version="v3.1")


def send_notification(address, title, due_date, link):
    data = {
        "Messages": [
            {
                "From": {"Email": "itgoatsteam@gmail.com", "Name": "IT Goats"},
                "To": [{"Email": address}],
                "Subject": "Notification",
                "HTMLPart": f"<h3>Thee deadline is approaching for task:</h3><h4>TITLE: </h4>{title}<br /><h4>"
                f"DUE DATE: </h4>{due_date}<br /><a href='{link}'><h4>CLICK</h4></a>",
            }
        ]
    }
    mailjet.send.create(data=data)


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
