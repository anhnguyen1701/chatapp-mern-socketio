import { useContext, useEffect, useState } from 'react';
import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
import axios from 'axios';
import { AuthContext } from '../../../Context/AuthContext';
import { ChatState } from '../../../Context/ChatProvider';

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  // const { user } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get('/api/posts/profile/' + username)
        : await axios.get('api/posts/timeline/' + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
