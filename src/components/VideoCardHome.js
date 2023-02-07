import { Link } from "react-router-dom";
import { countFormat }from '../utils/format.js'
import SocialMedia from './icons';

// day.js 組件
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';

dayjs.locale('zh-tw');
dayjs.extend(relativeTime);

function VideoCardHome({upNextVideo}) {
  return (
    <li className="shrink-0 box-border px-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <Link to={`/watch?v=${upNextVideo.id}`} className='w-full'>
        <div className="video relative pb-[56.25%] rounded-lg overflow-hidden">
          <img className="absolute top-2/4 -translate-y-2/4 w-full bg-[333]" src={upNextVideo.snippet.thumbnails.high.url}/>
        </div>
      </Link>
      <div className="flex items-start pt-[12px] pb-[24px]">
        <div className="w-[40px] h-[40px] mr-[12px] rounded-full overflow-hidden shrink-0">
          <img className="h-full object-cover" alt="" src={upNextVideo.snippet.thumbnails.default.url}/>
        </div>
        <Link to={`/watch?v=${upNextVideo.id}`} className="flex flex-col flex-auto items-start">
          <h3 className="text-left line-clamp-2">{upNextVideo.snippet.title}</h3>
          <div className="">
            <div>{upNextVideo.snippet.channelTitle}</div>
            <span>觀看次數：{countFormat(upNextVideo.statistics.viewCount)}次 • </span>
            <span>{dayjs(upNextVideo.snippet.publishedAt).fromNow()}</span>
          </div>
        </Link>
        <button>
          <SocialMedia.More />
        </button>
      </div>
    </li>
  );
}

export default VideoCardHome;