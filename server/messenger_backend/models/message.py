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

    def read_conversation(conversation_id, user_id): # self or no self?
        print('reading conversation', conversation_id)
        if not conversation_id:
            print('no convo id')
            return
        try:
            conversation =  Conversation.objects.get(id=conversation_id)
            print("conversation read:", conversation)
            # messages = conversation.messages
            messages = Message.objects.filter(conversation=conversation)
            print("messages:", messages)
            for m in messages.all():
                if m.senderId is not user_id:
                    m.read = True
                    m.save()
                    print("read message:", m)

        except Conversation.DoesNotExist:
            throw('conversation does not exist', conversation_id)
