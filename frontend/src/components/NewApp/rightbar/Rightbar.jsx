import './rightbar.css';
import { Users } from '../../../dummyData';
import Online from '../online/Online';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { Add, Remove } from '@material-ui/icons';
import { ChatState } from '../../../Context/ChatProvider';

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [userList, setUserList] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?.id)
  );

  useEffect(() => {
    console.log('chek');
    setFollowed(currentUser.followings.includes(user?._id));
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

    const getUserList = async () => {
      try {
        const userList = await axios.get('api/user/getall');
        setUserList(userList.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserList();
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

  const HomeRightbar = () => {
    return (
      <>
        {/* <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" /> */}
        <h4 className="rightbarTitle">All Users</h4>
        <ul className="rightbarFriendList">
          {userList.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
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
                  src={friend.pic ? friend.pic : PF + 'person/noAvatar.png'}
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
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
