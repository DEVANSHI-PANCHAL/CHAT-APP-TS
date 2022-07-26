import React from 'react';
import {Box, Typography, Divider, Stack} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import UserCard from './UserCard';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries'


interface UserIntf1{
  setloggedIn: any
}
const SideBar:any = ({setloggedIn}:UserIntf1) => {

  const {loading,data,error} = useQuery(GET_ALL_USERS)

  if(loading) return <Typography variant="h6">loading chats</Typography>
  // if(data){
  //   console.log(data)
  // }
  if(error){
    console.log(error.message)
  }
  return (
    <Box
    sx={{backgroundColor:"#f7f7f7",
    height:"100vh",
    width:"250px",
    padding:"10px"}}
    >
        <Stack direction="row"
        justifyContent="space-between">
        <Typography variant="h6">Chat</Typography>
        <LogoutIcon onClick={()=>{
          localStorage.removeItem('jwt')
          setloggedIn(false)
        }}/>
        </Stack>
      
        <Divider />
        {
            data && data.users.map((item: { id: React.Key | null | undefined; })=>{
                return <UserCard key={item.id} item={item}/>
            })
        }
    </Box>
  )
}

export default SideBar