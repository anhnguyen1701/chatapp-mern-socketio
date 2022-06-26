import { Add, Remove } from '@material-ui/icons';
import axios from 'axios';
import React, { useRef } from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';

export default function ProfileRightBar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser } = useContext(AuthContext);
  const [followed, setFollowed] = useState('');

  useEffect(() => {
    console.log('chek');
    setFollowed(currentUser.followings.includes(user._id));
  }, [user]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get('/api/user/friends/' + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/api/user/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        // dispatch({ type: 'UNFOLLOW', payload: user._id });
      } else {
        await axios.put(`/api/user/${user._id}/follow`, {
          userId: currentUser._id,
        });
        // dispatch({ type: 'FOLLOW', payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {}
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? 'Unfollow' : 'Follow'}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">Following</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={'/profile/' + friend.username}
              style={{ textDecoration: 'none' }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + 'person/noAvatar.png'
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <></>}
      </div>
    </div>
  );
}
