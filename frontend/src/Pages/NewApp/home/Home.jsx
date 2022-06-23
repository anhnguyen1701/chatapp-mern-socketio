import Topbar from '../../../components/NewApp/topbar/Topbar';
import Sidebar from '../../../components/NewApp/sidebar/Sidebar';
import Feed from '../../../components/NewApp/feed/Feed';
import Rightbar from '../../../components/NewApp/rightbar/Rightbar';
import './home.css';

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
    </>
  );
}
