import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { apiHelper } from '../utils/apis';
import SocialMedia from '../components/icons';
import VideoCard from '../components/VideoCard';
import VideoIframe from '../components/VideoIframe';
import VideoDescription from '../components/VideoDescription';

const WatchPage = () => {
  const [video, setVideo] = useState({
    id: '',
    snippet: {
      publishedAt: '',
      channelTitle: '',
      title: '',
      description: ''
    },
    statistics: {
      viewCount: '0',
      likeCount: '0',
      commentCount: '0'
    }
  });
  const [isShowDescription, setShowDescription] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('v');
  
  useEffect(() => {
    async function fetchVideo() {
      const searchParams = {
        id,
        key: process.env.REACT_APP_YT_API_KEY,
        part: 'snippet,statistics'
      };
      const searchURL = new URLSearchParams(searchParams);
      const {data} = await apiHelper.get(`videos?${searchURL.toString()}`);
      setVideo(data.items[0]);
    };
    fetchVideo();
  }, []);

  function commaFormat(str) {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  function countFormat(str) {
    if (str <= 4) {
      str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (str <= 5) {
      str = `${str.slice(0)}.${str.slice(1)}萬`;
    } else {
      str = `${str.slice(0, str.length - 4)}萬`;
    };
    return str;
  };

  // VideoCard
  const [upNextList, setUpNextList] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const nextPageTokenRef = useRef(nextPageToken);

  const fetchUpNext = useCallback(() => {
    const fetchingUpNext = async () => {
      const searchParams = {
        part: 'snippet',
        type: 'video',
        relatedToVideoId: id,
        maxResults: 20,
        key: process.env.REACT_APP_YT_API_KEY,
      };

      if (nextPageTokenRef.current) {
        searchParams['pageToken'] = nextPageTokenRef.current;
      };
      
      const searchURL = new URLSearchParams(searchParams);
      const {data} = await apiHelper.get(`search?${searchURL.toString()}`);
      const items = data.items.filter(item => item.snippet);
      
      setUpNextList(prevState => [
          ...prevState,
          ...items
      ]);

      setNextPageToken(data.nextPageToken);
      nextPageTokenRef.current = data.nextPageToken;
    };
    fetchingUpNext();
  }, [nextPageToken]);

  useEffect(() => {
    fetchUpNext();
  }, []);

  function debounce(fun, delay) {
    let timer = null;
    return function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(fun, delay);
    };
  };

  useEffect(() => {
    function loadMore () {
      const scrollHeight = document.body.scrollHeight;
      const clientHeight  = document.documentElement.clientHeight; //瀏覽器高度
      const scrollTop = document.documentElement.scrollTop;
      const distance = 50;

      if (
        (scrollTop + clientHeight) >= (scrollHeight - distance) &&
        nextPageTokenRef.current !== undefined
      ) fetchUpNext();
    }
    
    window.addEventListener('scroll', debounce(loadMore, 500));
    return () => window.removeEventListener('scroll', debounce(loadMore, 500));
  }, []);

  return (
    <>
      <div className="bg-[#f3f3f3]">
        <div className="fixed top-[48px] inset-x-0 z-[2]">
          <VideoIframe id={video.id} />
        </div>
        <div className="intro text-left	mt-[56.25%]">
          <div>
            <ul className="flex px-[12px] text-xs">
              <li className="px-[4px] pt-[12px] pb-[4px] text-[#065fd4]">
                <a>#米津玄師</a>
              </li>
              <li className="px-[4px] pt-[12px] pb-[4px] text-[#065fd4]">
                <a>#KenshiYonezu</a>
              </li>
              <li className="px-[4px] pt-[12px] pb-[4px] text-[#065fd4]">
                <a>#シンウルトラマン</a>
              </li>
            </ul>
            <div className="px-[9px] pb-[9px] flex justify-between" onClick={() => setShowDescription(true)}>
              <div className="text-xs">
                <h2 className="pb-[4px]">{video.snippet.title}</h2>
                <span>觀看次數：{countFormat(video.statistics.viewCount)}次 · 1 個月前</span>
              </div>
              <div>
                <SocialMedia.Down />
              </div>
            </div>
          </div>
          <div className="flex px-[12px] pb-[12px]">
            <button className="flex flex-col items-center grow">
              <SocialMedia.Like />
              {/* <SocialMedia.LikeFill /> */}
              <div className="mt-[7px]">{countFormat(video.statistics.likeCount)}</div>
            </button>
            <button className="flex flex-col items-center grow">
              <SocialMedia.Dislike />
              <span className="mt-[7px]">不喜歡</span>
            </button>
            <button className="flex flex-col items-center grow">
              <SocialMedia.Share />
              <span className="mt-[7px]">分享</span>
            </button>
            {/* <button className="text-[14px]">剪輯片段</button> */}
            <button className="flex flex-col items-center grow">
              <SocialMedia.Save />
              <span className="mt-[7px]">儲存</span>
            </button>
            <button className="flex flex-col items-center grow">
              <SocialMedia.Report />
              <span className="mt-[7px]">檢舉</span>
            </button>
          </div>
          <div className="flex justify-between p-[12px] border-y-[1px] border-black/10">
            <div className="flex">
              <div className="w-[34px] h-[34px] mr-[12px] rounded-full overflow-hidden">
                <img alt="" src="https://yt3.ggpht.com/obIiHrgUtL93lzpHG_pOPzseJv9ZEwGcLauBcqw9G-HB30qjiOe7uiVrA87WOO_4yCh-aQKxhsg=s88-c-k-c0x00ffffff-no-nd-rj"/>
              </div>
              <div>
                <h3>{video.snippet.channelTitle}</h3>
                <div className="text-xs">626萬 位訂閱者</div>
              </div>
            </div>
            <button className="px-[8px] py-[10px]">已訂閱</button>
          </div>
          <div className="flex justify-between items-center p-[12px] border-b border-black/10">
            <div className="text-[14px] leading-[17px]">
              <strong>留言 </strong>
              • {commaFormat(video.statistics.commentCount)} 則
            </div>
            <div className="w-[16px]"><SocialMedia.UpDown className="w-full"/></div>
          </div>
        </div>
        <div className={`fixed top-[calc(56.25vw+48px)] bottom-0 inset-x-0 z-[3] ${isShowDescription ? "block" : "hidden"}`}>
          <VideoDescription snippet={video.snippet} statistics={video.statistics} setShowDescription={setShowDescription}/>
        </div>
        {/* 即將播放 */}
        <div className="px-[12px]">
          <h3 className="py-[12px]">即將播放</h3>
          {upNextList.map((upNextVideo, index) => (
            <VideoCard upNextVideo={upNextVideo} key={index}/> 
            //key={upNextVideo.id.videoId}
          ))}
        </div>
      </div>
    </>
  );
};

export default WatchPage;
