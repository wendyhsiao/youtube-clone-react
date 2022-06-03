import SocialMedia from './icons';

function VideoCard() {
  return (
    <div>
      <div className="video relative pb-[56.25%]">
        <img className="absolute inset-0 bg-[333]" src="https://i.ytimg.com/vi/Zhx1n6uvgUE/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&amp;rs=AOn4CLChjbt5OpJHqQNcODTa8VGwHovUZA"/>
      </div>
      <div className="flex">
        <div className="w-[40px] h-[40px] mr-[12px] rounded-full overflow-hidden shrink-0">
          <img alt="" src="https://yt3.ggpht.com/obIiHrgUtL93lzpHG_pOPzseJv9ZEwGcLauBcqw9G-HB30qjiOe7uiVrA87WOO_4yCh-aQKxhsg=s88-c-k-c0x00ffffff-no-nd-rj"/>
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-left">米津玄師 - M八七 　Kenshi Yonezu - M87</h3>
          <div className="">
            <span>Kenshi Yonezu  米津玄師</span>
            <span> 觀看次數：1,500萬次</span>
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