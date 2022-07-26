import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { AppBar, Toolbar, Box,Stack, Avatar, Typography,TextField } from '@mui/material'
import MessageCard from './MessageCard'
import { useQuery,useMutation, useSubscription } from '@apollo/client'
import { GET_MSG } from '../graphql/queries'
import SendIcon from '@mui/icons-material/Send';
import { SEND_MSG } from '../graphql/mutations'
import { MSG_SUB } from '../graphql/subscriptions'


const ChatScreen = () => {
    const {id ,name} = useParams()
    const [text,setText] = useState("")
    const [messages,setMessages] = useState<any[]>([])
    const {data,loading,error} = useQuery(GET_MSG,{
        variables:{
            receiverId: id && parseInt(id),
        },
        onCompleted(data:any){
            setMessages(data.messagesByUser)
        }
    })

   const [sendMessage] =  useMutation(SEND_MSG,{
    
   })
    console.log(data)
  
    const {data:subData} =useSubscription(MSG_SUB,{
        onSubscriptionData({subscriptionData:{data}}){
            // console.log(data)
          
                setMessages((prevMessages)=>[...prevMessages,data.messageAdded])
            
        }
    })
    // if (subData) console.log(subData)

  return (
   <Box 
   flexGrow={1}>
       <AppBar position="static"
       sx={{backgroundColor:"white",boxShadow:0}}>
           <Toolbar>
           <Avatar 
       src={`https://avatars.dicebear.com/api/initials/${name}.svg`}
       sx={{width:"32px",height:"32px",mr:2}} />
           <Typography variant="h6" color="black">{name}</Typography>
           </Toolbar>
       </AppBar>
       <Box 
      sx={{ backgroundColor:"#f5f5f5",
      height:"80vh",
      padding:"10px",
      overflowY:"auto"}}>
         {
             loading ? <Typography variant="h6" color="black">Loading...chats</Typography>
             : messages.map(msg =>{
                 return <MessageCard key={msg.createdAt} text={msg.text} date = {msg.createdAt} direction={msg.receiverId == id ? "end" : "start"}/>
             })
         }
       </Box>
       <Stack direction="row">
       <TextField
       placeholder="Enter a message"
       variant="standard"
       fullWidth
       multiline
       rows={2}
       value={text}
       onChange={e =>setText(e.target.value)}>
       </TextField>
       <SendIcon fontSize="large" onClick = {() =>{
           sendMessage({
               variables:{
                   receiverId: id && parseInt(id),
                   text:text
               }
           })
       }}/>
       </Stack>
       
   </Box>
  )
}

export default ChatScreen