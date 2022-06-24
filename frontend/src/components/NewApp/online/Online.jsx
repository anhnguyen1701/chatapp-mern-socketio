import { Link } from 'react-router-dom';
import './online.css';

export default function Online({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <Link to={'/profile/' + user.username}>
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <img className="rightbarProfileImg" src={user.pic} alt="" />
          {/* <span className="rightbarOnline"></span> */}
        </div>
        <span className="rightbarUsername">
          {user.username ? user.username : user.name}
        </span>
      </li>
    </Link>
  );
}
