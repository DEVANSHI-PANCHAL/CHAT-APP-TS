import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Stack,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";
import MessageCard from "./MessageCard";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_MSG } from "../graphql/queries";
import SendIcon from "@mui/icons-material/Send";
import { SEND_MSG } from "../graphql/mutations";
import { MSG_SUB } from "../graphql/subscriptions";
import jwt_decode from "jwt-decode";

interface ParamInf{
    id: number, 
    name: string, 
}

const ChatScreen = () => {
  const { id, name } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const { userId } = jwt_decode(localStorage.getItem("jwt"));
  const { data, loading } = useQuery(GET_MSG, {
    variables: {
      // receiverId: +id
      receiverId: id && parseInt(id),
    },
    onCompleted(data: any) {
      setMessages(data.messagesByUser);
    },
  });
  const [sendMessage] = useMutation(SEND_MSG,{
    // onCompleted(data){
    //   setMessages((prevMessages)=>[...prevMessages,data.createMessage])
    // }
  })
  console.log("user id ", userId)
  const { data:subData } = useSubscription(MSG_SUB, {
    onSubscriptionData({subscriptionData:{data}}){
        console.log("DATA RCVD :: ", data)
        console.log("user ID", userId, typeof userId)
        console.log("id ID", id, typeof id)
        if(
          (data.messageAdded.receiverId == parseInt(id) && data.messageAdded.senderId == parseInt(userId)) ||
          (data.messageAdded.receiverId == parseInt(userId) && data.messageAdded.senderId == parseInt(id)) 
        ){
           setMessages((prevMessages)=>[...prevMessages,data.messageAdded])  
        }
     }
  })

  const handleEnterEvent = (e) => {
    // e.preventDefault();
    console.log("enter event", e);
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    sendMessage({
      variables: {
        receiverId: id && parseInt(id),
        text: text,
      },
    });
    setText("");
  };

  return (
    <Box flexGrow={1}>
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 0 }}>
        <Toolbar>
          <Avatar
            src={`https://avatars.dicebear.com/api/initials/${name}.svg`}
            sx={{ width: "32px", height: "32px", mr: 2 }}
          />
          <Typography variant="h6" color="black">
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          height: "80vh",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        {loading ? (
          <Typography variant="h6" color="black">
            Loading...chats
          </Typography>
        ) : (
          messages.map((msg) => {
            return (
              <MessageCard
                key={msg.createdAt}
                text={msg.text}
                date={msg.createdAt}
                direction={msg.receiverId === +id ? "end" : "start"}
              />
            );
          })
        )}
      </Box>
      <Stack direction="row">
        <TextField
          placeholder="Enter a message"
          variant="standard"
          fullWidth
          multiline
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleEnterEvent}
        ></TextField>
        <SendIcon
          fontSize="large"
          onClick={handleSendMessage}
        />
      </Stack>
    </Box>
  );
};

export default ChatScreen;
