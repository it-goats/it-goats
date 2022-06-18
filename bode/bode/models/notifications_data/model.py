from bode.extensions import db
from bode.models.utc_datetime import UTCDateTime

default_id = "notifications_data"


class NotificationsData(db.Model):
    __tablename__ = "notifications_data"

    id = db.Column(db.String(256), primary_key=True, server_default=default_id)
    email = db.Column(db.String(256), nullable=True)
    last_sent_at = db.Column(UTCDateTime(), nullable=True)

    __table_args__ = (db.CheckConstraint(f"id = '{default_id}'", name="single_row_check"),)

    def get():
        return NotificationsData.query.get(default_id)

    def update_email(email):
        data = NotificationsData.get()
        data.email = email

        db.session.commit()

        return data

    def update_last_sent_at(last_sent_at):
        data = NotificationsData.get()
        data.last_sent_at = last_sent_at

        db.session.commit()

        return data

    def __repr__(self):
        return f'<Notifications data email="{self.email} last_sent_at={self.last_sent_at}">'
