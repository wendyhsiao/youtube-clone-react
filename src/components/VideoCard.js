import SocialMedia from './icons';

function VideoCard({upNextVideo}) {
  return (
    <div className='md:flex md:mt-2'>
      <div className='w-full md:mr-2'>
        <div className="video relative pb-[56.25%] overflow-hidden">
          <img className="absolute top-2/4 -translate-y-2/4 w-full bg-[333]" src={upNextVideo.snippet.thumbnails.high.url}/>
        </div>
      </div>
      <div className="flex pt-[12px] pb-[24px] md:w-[55%] md:flex-shrink-0 md:py-0">
        <div className="w-[40px] h-[40px] mr-[12px] rounded-full overflow-hidden shrink-0 md:hidden">
          <img className="h-full object-cover" alt="" src={upNextVideo.snippet.thumbnails.default.url}/>
        </div>
        <div className="flex flex-col flex-auto items-start">
          <h3 className="text-left line-clamp-2">{upNextVideo.snippet.title}</h3>
          <div className="">
            <span>{upNextVideo.snippet.channelTitle}</span>
            {/* <span> 觀看次數：1,500萬次</span> */}
          </div>
        </div>
        <button>
          <SocialMedia.More />
        </button>
      </div>
    </div>
  );
}

export default VideoCard;