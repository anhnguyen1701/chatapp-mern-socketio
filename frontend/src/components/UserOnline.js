import { Box, toast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import UserListItem from './UserAvatar/UserListItem';

export default function UserOnline() {
  const user1 = {
    _id: '62b74d6060de937a517c4a31',
    name: 'lamanh',
    username: 'lamanh',
    email: 'lamanh@gmail.com',
    password: '$2a$10$ceB6qKskUOLZ9K7ml/MI.e2moNxylDMecIYl5/C5UpLoEgPwS1Lgi',
    pic: 'http://res.cloudinary.com/dkwthlvw4/image/upload/v1656180062/wp1rsugba2lmr20mcxxv.jpg',
    coverPicture: '',
    followers: ['62b74c9060de937a517c49f2'],
    followings: [],
    isAdmin: false,
    createdAt: '2022-06-25T18:01:04.022Z',
    updatedAt: '2022-06-26T16:34:48.111Z',
    __v: 0,
  };

  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    onlineUsers,
    setOnlineUsers,
  } = ChatState();

  console.log(onlineUsers, '------');

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chat', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onclose();
    } catch (error) {
      toast({
        title: 'erorr fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <Box
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '30%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        User Online
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {onlineUsers?.map((user) => (
          <UserListItem
            key={user.user1._id}
            user={user.user1}
            handleFunction={() => accessChat(user.user1._id)}
          />
        ))}
      </Box>
    </Box>
  );
}
