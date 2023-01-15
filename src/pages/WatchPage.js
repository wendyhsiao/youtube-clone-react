import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { apiHelper } from '../utils/apis';
import SocialMedia from '../components/icons';
import VideoCard from '../components/VideoCard';
import VideoIframe from '../components/VideoIframe';
import VideoDescription from '../components/VideoDescription';
import VideoComments from '../components/VideoComments';
import CommentChild from '../components/CommentChild';


// day.js 組件
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';

dayjs.locale('zh-tw');
dayjs.extend(relativeTime);

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
  const [showActionSheets, setShowActionSheets] = useState('');

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

  // comments
  const [commentList, setCommentList] = useState([]); 
  const [commentNextPageToken, setCommentNextPageToken] = useState('');
  const commentNextPageTokenRef = useRef(commentNextPageToken);
  const fetchComments = useCallback(() => {
    const fetchingComments = async () => {
      const searchParams = {
        part: 'snippet,replies',
        videoId: id,
        maxResults: 40,
        // pageToken,
        key: process.env.REACT_APP_YT_API_KEY,
      };
    
      if (commentNextPageTokenRef.current) {
        searchParams['pageToken'] = commentNextPageTokenRef.current;
      };

      const searchURL = new URLSearchParams(searchParams);
      const {data} = await apiHelper.get(`commentThreads?${searchURL.toString()}`);
      setCommentList(prevState => [
        ...prevState,
        ...data.items
      ]);
      setCommentNextPageToken(data.nextPageToken);
      commentNextPageTokenRef.current = data.nextPageToken;
    };
    fetchingComments();
  });
  
  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      <div className="mx-auto bg-[#fff] md:max-w-[90%] md:flex">
        <div className="intro text-left	mt-[56.25%] flex-1 md:mt-0">
          <div className="fixed top-[48px] inset-x-0 z-[2] md:static">
            <VideoIframe id={video.id} />
          </div>
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
            <div className="px-[12px] pb-[9px] flex justify-between md:hidden" onClick={() => setShowActionSheets('description')}>
              <div className="text-xs">
                <h2 className="pb-[4px]">{video.snippet.title}</h2>
                <span>觀看次數：{countFormat(video.statistics.viewCount)}次 · {dayjs(video.snippet.publishedAt).fromNow()}</span>
                <span className="ml-2">...更多內容</span>
              </div>
            </div>
            <div className="px-[12px] pb-[9px] hidden md:flex md:justify-between">
              <div className="text-xs">
                <h2 className="pb-[4px]">{video.snippet.title}</h2>
              </div>
            </div>
          </div>
          <div className="px-[12px] border-b-[1px] border-black/10 md:border-b-0 lg:flex lg:justify-between">
            <div className="flex justify-between mb-[9px]">
              <div className="flex">
                <div className="w-[34px] h-[34px] mr-[12px] rounded-full overflow-hidden">
                  <img alt="" src="https://yt3.ggpht.com/rGwF3epSxFQZcTNfViuBgXeH7opUXf72ZBuAn50W-40oxe1ebvZ-2X3J5SeO0oqZq7vqVOrzaQ=s88-c-k-c0x00ffffff-no-nd-rj"/>
                </div>
                <div>
                  <h3>{video.snippet.channelTitle}</h3>
                  <span className="text-xs">626萬 位訂閱者</span>
                </div>
              </div>
              <button className="px-[16px] h-9 rounded-[18px]	bg-[#f2f2f2]">已訂閱</button>
            </div>
            <div>
              <div className="flex pb-[12px]">
                <div className="flex mr-2 px-[16px] h-9 rounded-[18px] bg-[#f2f2f2]">
                  <button className="after:content-['|'] after:mx-2">
                    <SocialMedia.Like className="inline-block"/><span>36</span>
                  </button> 
                  <button><SocialMedia.Dislike className="inline-block"/><span></span></button>
                </div>
                <button className="mr-2 px-[16px] h-9 rounded-[18px]	bg-[#f2f2f2]">
                  <SocialMedia.Share className="inline-block" />
                  <span className="align-middle	">分享</span>
                </button>
                <button className="mr-2 px-[16px] h-9 rounded-[18px]	bg-[#f2f2f2]">
                  <SocialMedia.Save className="inline-block"/>
                  <span className="align-middle	">儲存</span>
                </button>
                <button className="px-[16px] h-9 rounded-[18px]	bg-[#f2f2f2]">
                  <SocialMedia.Report className="inline-block"/>
                  <span className="align-middle	">檢舉</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-[12px] bg-[#f2f2f2] rounded-[12px] h-[104px] hidden md:flex md:flex-col md:justify-between md:items-start">
            <span>觀看次數：{countFormat(video.statistics.viewCount)}次 · {dayjs(video.snippet.publishedAt).fromNow()}</span>
            <button>顯示完整資訊</button>
          </div>
          <div className="flex justify-between items-center p-[12px] border-b border-black/10 md:hidden" onClick={() => setShowActionSheets('comment')}>
            <div className="text-[14px] leading-[17px]">
              <strong>留言 </strong>
              • {commaFormat(video.statistics.commentCount)} 則
            </div>
            <div className="w-[16px]"><SocialMedia.UpDown className="w-full"/></div>
          </div>
          <div className="hidden md:block">
            <div className="p-[12px] text-[14px] leading-[17px]">
              <strong>{commaFormat(video.statistics.commentCount)} 則留言</strong>
            </div>
            {commentList.map((comment, index) => (
              <CommentChild comment={comment} key={index}/>
            ))}
          </div>
        </div>
        <div className={`fixed top-[calc(56.25vw+48px)] bottom-0 inset-x-0 z-[3] ${showActionSheets ? "block" : "hidden"}`}>
          {showActionSheets === 'description'
            ? <VideoDescription snippet={video.snippet} statistics={video.statistics} setShowActionSheets={setShowActionSheets}/>
            : <VideoComments fetchComments={fetchComments} commentList={commentList} showActionSheets={showActionSheets} setShowActionSheets={setShowActionSheets} />
          }
        </div>
        {/* 即將播放 */}
        <div className="px-[12px] md:w-2/5 md:max-w-[400px]">
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
