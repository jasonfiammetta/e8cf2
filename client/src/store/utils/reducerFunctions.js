export const createConversations = (state, conversations) => {
  console.log(conversations)
  if(!conversations) { return [] }
  return conversations.map(convo => {
    let userUnread = 0;
    let partnerUnread = 0;

    convo.messages.forEach(message => {
      if(!message.read) {
        message.senderId === convo.otherUser.id ?
          userUnread++ : partnerUnread++
      }
    });

    convo.userUnreadMessages = userUnread
    convo.partnerUnreadMessages = partnerUnread
    return convo
  });
};


export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      partnerUnreadMessages: 0,
      userUnreadMessages: 1,
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  };

  let convoCopy = {};
  const remainingState = state.filter((convo) => {
    if (convo.id === message.conversationId) {
      convoCopy = { ...convo }
      convoCopy.messages = [...convo.messages, message]
      convoCopy.latestMessageText = message.text;
      console.log({ messageId: message.senderId, partnerId: convo.otherUser.id})
      convoCopy.partnerUnreadMessages = convo.otherUser.id === message.senderId ? convo.partnerUnreadMessages + 1 : 0
      convoCopy.userUnreadMessages = convo.otherUser.id !== message.senderId ? 0 : convo.userUnreadMessages + 1
      return false;
    } else {
      return true;
    }
  });
  if(state.length === remainingState.length) { return remainingState }
  return [convoCopy, ...remainingState]
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages = [message]
      convoCopy.latestMessageText = message.text;
      convoCopy.partnerUnreadMessages = convo.partnerUnreadMessages + 1;
      convoCopy.userUnreadMessages = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const convoWasRead = (state, convoReadId) => {
  return state.map((convo) => {
    if (convo.id === convoReadId) {
      const convoCopy = { ...convo };
      convoCopy.partnerUnreadMessages = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const readAConvo = (state, readConvoId) => {
  return state.map((convo) => {
    if (convo.id === readConvoId) {
      const convoCopy = { ...convo };
      convoCopy.userUnreadMessages = 0;
      return convoCopy
    } else {
      return convo
    }
  })
}
