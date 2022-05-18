from bode.extensions import db
from bode.models.tag.model import Tag


def create_tag(tag_name):
    tag = Tag(name=tag_name)

    db.session.add(tag)
    db.session.commit()

    return tag


def delete_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)

    db.session.delete(tag)
    db.session.commit()

    return tag


def get_tag_by_name(tag_name):
    return Tag.query.filter(Tag.name == tag_name).first()
