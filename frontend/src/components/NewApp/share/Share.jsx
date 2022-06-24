import './share.css';
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from '@material-ui/icons';
import { Button } from '@chakra-ui/button';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import axios from 'axios';
import { ChatState } from '../../../Context/ChatProvider';

export default function Share() {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

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

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    // if (file) {
    //   const data = new FormData();
    //   const fileName = Date.now() + file.name;
    //   data.append('name', fileName);
    //   data.append('file', file);
    //   newPost.img = fileName;
    //   console.log(newPost);
    //   try {
    //     await axios.post('/upload', data);
    //   } catch (err) {}
    // }

    newPost.img = pic;
    try {
      const post = await axios.post('/api/posts', newPost);
      window.location.reload();
    } catch (err) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + 'person/noAvatar.png'
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + '?'}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {pic && (
          <div className="shareImgContainer">
            <img className="shareImg" src={pic} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setPic(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: 'none' }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => uploadImage(e.target.files[0])}
              />
            </label>
            {/* <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div> */}
          </div>
          <Button
            className="shareButton"
            type="submit"
            colorScheme="green"
            isLoading={picLoading}
          >
            Share
          </Button>
        </form>
      </div>
    </div>
  );
}
