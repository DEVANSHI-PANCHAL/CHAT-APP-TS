import React from 'react'
import { Box, Typography } from '@mui/material'

interface UserIntf2{
  text:any, 
  date:any, 
  direction:any
}

const MessageCard = ({text,date,direction}:UserIntf2) => {
  return (
      <Box
      display="flex"
      justifyContent={direction}>
          <Box>
        <Typography sx={{variant:"subtitle2",
        backgroundColor:"white",
        padding:"5px"}}>
            {text}
        </Typography>
        <Typography
        variant="caption"
        
        padding="5px"
        >
            {new Date (date).toLocaleTimeString()}
        </Typography>
    </Box>
      </Box>
    
  )
}

export default MessageCard