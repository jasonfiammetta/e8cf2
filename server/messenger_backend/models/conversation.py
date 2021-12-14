from django.db import models
from django.db.models import Q

from . import utils
from .user import User


class Conversation(utils.CustomModel):

    users = models.ManyToManyField(
        User,
        related_name="conversations"
    )

    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    # find conversation given one or more user Ids
    def find_conversations(userIds):
        try:
            q = Conversation.objects.all()
            for id in userIds:
                q = q.filter(users__id=id)
            return q.all()

        except Conversation.DoesNotExist:
            return None
