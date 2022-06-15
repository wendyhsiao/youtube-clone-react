import SocialMedia from './icons';

function VideoCard({upNextVideo}) {
  return (
    <div>
      <div className="video relative pb-[56.25%] overflow-hidden">
        <img className="absolute inset-0 bg-[333]" src={upNextVideo.snippet.thumbnails.high.url}/>
      </div>
      <div className="flex">
        <div className="w-[40px] h-[40px] mr-[12px] rounded-full overflow-hidden shrink-0">
          <img alt="" src="https://yt3.ggpht.com/obIiHrgUtL93lzpHG_pOPzseJv9ZEwGcLauBcqw9G-HB30qjiOe7uiVrA87WOO_4yCh-aQKxhsg=s88-c-k-c0x00ffffff-no-nd-rj"/>
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-left">{upNextVideo.snippet.title}</h3>
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