import React from 'react'
import {Stack,Avatar,Typography} from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface UserIntf{
  item: any
}

const UserCard = ({item:{firstName,lastName,id}}:UserIntf) => {
    const navigate = useNavigate()
  return (
   <Stack 
   className="usercard"
   direction="row"
   spacing={2}
   sx={{py:1}}
   onClick={()=>navigate(`/${id}/${firstName} ${lastName}`)}>
       <Avatar 
       src={`https://avatars.dicebear.com/api/initials/${firstName}${lastName}.svg`}
       sx={{width:"32px",height:"32px"}} />
       <Typography
      sx={{variant:"subtitle"}} >{firstName} {lastName}</Typography>
   </Stack>
  )
}

export default UserCard