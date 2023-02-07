import SocialMedia from './icons';

// day.js 組件
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';

dayjs.locale('zh-tw');
dayjs.extend(relativeTime);

function VideoCard({upNextVideo, page}) {
  return (
    <div className='md:flex md:mt-2'>
      <div className={`w-full md:w-[45%] md:max-w-[360px] md:flex-shrink-0 ${page ? "md:mr-4" : "md:mr-2"}`}>
        <div className="video relative pb-[56.25%] rounded-lg overflow-hidden">
          <img className="absolute top-2/4 -translate-y-2/4 w-full bg-[333]" src={upNextVideo.snippet.thumbnails.high.url}/>
        </div>
      </div>
      <div className="flex pt-[12px] pb-[24px] flex-grow md:py-0">
        <div className="w-[40px] h-[40px] mr-[12px] rounded-full overflow-hidden shrink-0 md:hidden">
          <img className="h-full object-cover" alt="" src={upNextVideo.snippet.thumbnails.default.url}/>
        </div>
        <div className="flex flex-col flex-auto items-start">
          <h3 className={`text-left line-clamp-2 font-medium ${page && "text-lg"}`}>{upNextVideo.snippet.title}</h3>
          <div className="py-3">
            <span className={`w-[24px] h-[24px] mr-[8px] inline-block align-bottom rounded-full overflow-hidden shrink-0 ${!page && "md:hidden"}`}>
              <img className="h-full object-cover" alt="" src={upNextVideo.snippet.thumbnails.default.url}/>
            </span>
            <span>{upNextVideo.snippet.channelTitle} • </span>
            {/* <span> 觀看次數：1,500萬次</span> */}
            <span>{dayjs(upNextVideo.snippet.publishedAt).fromNow()}</span>
          </div>
          {page && <div className="">
            {upNextVideo.snippet.description}
          </div>}
        </div>
        {/* <button>
          <SocialMedia.More />
        </button> */}
      </div>
    </div>
  );
}

export default VideoCard;