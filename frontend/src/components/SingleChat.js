import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from '../components/misc/ProfileModal';
import UpdateGroupChatModal from './misc/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'error occured',
        description: 'failed to send the message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(messages);
        setNewMessage('');
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'error occured',
          description: 'failed to send the message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
          >
            <IconButton
              d={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon></ArrowBackIcon>}
              onClick={() => setSelectedChat('')}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                ></UpdateGroupChatModal>
              </>
            )}
          </Text>

          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              ></Input>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click a user to start chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
