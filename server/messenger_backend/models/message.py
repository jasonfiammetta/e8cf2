from django.db import models

from . import utils
from .conversation import Conversation


class Message(utils.CustomModel):
    text = models.TextField(null=False)
    senderId = models.IntegerField(null=False)
    read = models.BooleanField(null=False, default=False)
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        db_column="conversationId",
        related_name="messages",
        related_query_name="message"
    )
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def read_conversation(conversation_id, user_id):
        if not conversation_id:
            return
        try:
            conversation =  Conversation.objects.get(id=conversation_id)
            Message.objects.filter(conversation=conversation).exclude(senderId=user_id).update(read=True)

        except Conversation.DoesNotExist:
            throw('conversation does not exist', conversation_id)
