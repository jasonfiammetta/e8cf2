import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { readConvo } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user } = props;
  const conversation = props.conversation || {};

  const handleClick = async () => {
    if(conversation.userUnreadMessages !== 0) {
      await props.readConvo(conversation.id, user.id);
    }
  }

  const lastReadIdx = conversation?.messages?.length - 1 - conversation?.partnerUnreadMessages;
  const lastPartnerRead = conversation.messages && conversation.messages[lastReadIdx]?.id

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box onClick={handleClick} className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              lastPartnerRead={lastPartnerRead}
              otherUser={conversation.otherUser}
              user={user}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readConvo: (convoId, userId) => {
      dispatch(readConvo(convoId, userId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
