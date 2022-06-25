import './post.css';
import { MoreVert } from '@material-ui/icons';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { ChatState } from '../../../Context/ChatProvider';
import {
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = JSON.parse(localStorage.getItem('userInfo'));
  const toast = useToast();

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };

      const res = await axios.get(
        `/api/user/specific?userId=${post.userId}`,
        config
      );
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put('/api/posts/' + post._id + '/like', {
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deletePost = async () => {
    try {
      await axios.delete('/api/posts/' + post._id, {
        data: { userId: currentUser._id },
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast({
        title: 'error occured',
        description: 'you can only delete your posts',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  const editPost = () => {};

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + 'person/noAvatar.png'
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <Menu className="postTopRight">
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<MoreVert />}
              variant="outline"
            />
            <MenuList>
              <MenuItem icon={<EditIcon />} onClick={editPost}>
                Edit post
              </MenuItem>
              <MenuItem icon={<DeleteIcon />} onClick={deletePost}>
                Delete post
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
