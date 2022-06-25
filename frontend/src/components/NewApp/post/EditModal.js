import { ViewIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Cancel } from '@material-ui/icons';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

export default function EditModal({ post, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pic, setPic] = useState();
  const [desc, setDesc] = useState('');
  const [picLoading, setPicLoading] = useState(false);

  useEffect(() => {
    setPic(post.img);
    setDesc(post?.desc);
  }, []);

  const handleChangeDesc = (e) => {
    setDesc(e.target.value);
  };

  const uploadImage = (pics) => {
    setPicLoading(true);
    if (pics == undefined) {
      console.log('select an image');
      return;
    }

    if (pics) {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'dkwthlvw4');
      fetch('https://api.cloudinary.com/v1_1/dkwthlvw4/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      console.log('select an image');
      setPicLoading(false);
      return;
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    const newPost = {
      ...post,
      desc: desc,
      img: pic,
    };

    try {
      const post1 = await axios.put('/api/posts/' + post._id, newPost);
      console.log(post1);
      window.location.reload();
    } catch (err) {}
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: 'flex' }}
          icon={<ViewIcon></ViewIcon>}
          onClick={onOpen}
        ></IconButton>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={desc}
                placeholder="description"
                onChange={handleChangeDesc}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image url</FormLabel>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => uploadImage(e.target.files[0])}
              />
              {pic && (
                <div className="shareImgContainer">
                  <img className="shareImg" src={pic} alt="" />
                  <Cancel
                    className="shareCancelImg"
                    onClick={() => setPic(null)}
                  />
                </div>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={picLoading}
              onClick={onSave}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
