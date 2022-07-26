import jwt from 'jsonwebtoken'
import pc from '@prisma/client'
import {ApolloError,AuthenticationError,ForbiddenError} from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

const prisma = new pc.PrismaClient()

const MESSAGE_ADDED = 'MESSAGE_ADDED'
// console.log(process.env.JWT_SECRET)
const resolvers = {
    Query:{
       users:async(_,args,{userId})=>{
           if(!userId) throw new ForbiddenError("you must be logged in")
        const users= await prisma.user.findMany({
            orderBy:{ 
                createdAt:"desc"
            },
            where:{
                id:{
                    not:userId
                }
            }
        })
        return users
       },
       messagesByUser:async(_,{receiverId},{userId})=>{
        if(!userId) throw new ForbiddenError("You must be logged in")
       const messages = await prisma.message.findMany({
            where:{
                OR:[
                    {senderId:userId,receiverId:receiverId},
                    {senderId:receiverId,receiverId:userId}
                ]
            },
            orderBy:{
                createdAt:"asc"
            }
        })
        return messages
       }
    },
    
    Mutation:{
        SignupUser:async(_,{userNew})=>{
     const user =await prisma.user.findUnique({where:{email:userNew.email}})
        if(user) throw new AuthenticationError("user already exixts with this email")  
        const hashedPassword = await bcrypt.hash(userNew.password,10)
           const newUser = await prisma.user.create({
                data:{
                    ...userNew,
                    password:hashedPassword
                }
            })
            return newUser
        },
        SigninUser:async (_,{userSignin})=>{
            const user =await prisma.user.findUnique({where:{email:userSignin.email}})
            if(!user) throw new AuthenticationError("User doesnt exist with this email")
           const doMatch = await bcrypt.compare(userSignin.password,user.password)
           if(!doMatch) throw new AuthenticationError("email or password incorrect")
            const token =  jwt.sign({userId:user.id},process.env.JWT_SECRET)
            return {token}
        },
        createMessage:async(_,{receiverId,text},{userId})=>{
            if(!userId) throw new ForbiddenError("You must be logged in")
           const message = await prisma.message.create({
                data:{
                    text,
                    receiverId,
                    senderId:userId,
                }
            })
            pubsub.publish(MESSAGE_ADDED,{messageAdded:message})
            return message
        },
        
    },
    Subscription:{
        messageAdded:{
            subscribe:() => pubsub.asyncIterator(MESSAGE_ADDED)
        }
    }
}

export default resolvers