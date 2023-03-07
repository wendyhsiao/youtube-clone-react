import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { apiHelper } from '../utils/apis';
import { countFormat }from '../utils/format.js'
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

const descriptionFormat = (str) => {
  const regex = /(https|http):\/\/([\w.]+\/?)\S*(?=\s)/g;
  const urlList = new Set(str.match(regex));
  urlList.forEach(url => {
    const regexUrl = new RegExp(`${url}`, 'g');
    str = str.replace(regexUrl, `<a href="${url}" class="text-[#065fd4]">${url}</a>`);
  });

  const regex2 = /(?<!\[)#\S+/g; // 選擇 tag，排除色碼 [#ffffff]
  const tagList = new Set(str.match(regex2));
  tagList.forEach(tag => {
    const regexTag = new RegExp(`${tag}`, 'g');
    str = str.replace(regexTag, `<a href="/results?search_query=${encodeURIComponent(tag)}" class="text-[#065fd4]">${tag}</a>`);
  });
  str = str.replace(/(\r|\n|\r\n)/g, '<br/>');
  return {__html: str};
};

const WatchPage = () => {
  const [video, setVideo] = useState({
    id: '',
    snippet: {
      publishedAt: '',
      channelTitle: '',
      title: '',
      description: '',
      thumbnails: {},
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
  }, [location]);

  function commaFormat(str) {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };


  // VideoCard
  const [upNextList, setUpNextList] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const nextPageTokenRef = useRef(nextPageToken);

  const fetchUpNext = useCallback((more) => {
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
      
      if (more) {
        setUpNextList(prevState => [
          ...prevState,
          ...items
        ]);
      } else {
        setUpNextList(items);
      };
      

      setNextPageToken(data.nextPageToken);
      nextPageTokenRef.current = data.nextPageToken;
    };
    fetchingUpNext();
  }, [nextPageToken, id]);

  useEffect(() => {
    fetchUpNext();
  }, [location]);

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
      ) fetchUpNext('more');
    }
    
    window.addEventListener('scroll', debounce(loadMore, 500));
    return () => window.removeEventListener('scroll', debounce(loadMore, 500));
  }, []);

  // comments
  const [commentList, setCommentList] = useState([]); 
  const [commentNextPageToken, setCommentNextPageToken] = useState('');
  const [isCommentLoad, setIsCommentLoad] = useState(false);

  const fetchComments = useCallback((more) => {
    const fetchingComments = async () => {
      setIsCommentLoad(true);
      const searchParams = {
        part: 'snippet,replies',
        videoId: id,
        maxResults: 40,
        // pageToken,
        key: process.env.REACT_APP_YT_API_KEY,
      };
      if (commentNextPageToken !== '') {
        searchParams['pageToken'] = commentNextPageToken;
      };

      const searchURL = new URLSearchParams(searchParams);
      const {data} = await apiHelper.get(`commentThreads?${searchURL.toString()}`);
      
      if (more) {
        setCommentList(prevState => [
          ...prevState,
          ...data.items
        ]);
      } else {
        setCommentList(data.items);
      };
      setCommentNextPageToken(data.nextPageToken || '');
      
      setIsCommentLoad(false);
    };
    fetchingComments();
  }, [location, commentNextPageToken]);
  
  useEffect(() => {
    function loadMore () {
      const scrollHeight = document.querySelector(".js-comment").scrollHeight;
      const offsetTop = document.querySelector(".js-comment").offsetTop;
      const clientHeight  = document.documentElement.clientHeight; //瀏覽器高度
      const scrollTop = document.documentElement.scrollTop;
      const distance = 50;

      if (
        (scrollTop + clientHeight) >= (scrollHeight + offsetTop - distance) &&
        commentNextPageToken !== undefined
      ) fetchComments('more');
    }
    const debounceFunc = debounce(loadMore, 500);

    window.addEventListener('scroll', debounceFunc );
    return () => window.removeEventListener('scroll', debounceFunc );
  }, [location, commentNextPageToken]);
  
  useEffect(() => {
    fetchComments();
  }, [location]);

  const [isDescriptionShow, setDescriptionShow] = useState(false);
  const toggleDescription = () => {
    setDescriptionShow(!isDescriptionShow);
  }

  return (
    <>
      <div className="mx-auto bg-[#fff] md:max-w-[90%] md:flex">
        <div className="intro text-left	mt-[56.25%] flex-1 md:mt-0">
          <div className="fixed top-[48px] inset-x-0 z-[2] md:static">
            <VideoIframe id={video.id} />
          </div>
          <div className="pt-[12px]">
            {/* <ul className="flex px-[12px] text-xs">
              <li className="px-[4px] pt-[12px] pb-[4px] text-[#065fd4]">
                <a>#米津玄師</a>
              </li>
              <li className="px-[4px] pt-[12px] pb-[4px] text-[#065fd4]">
                <a>#KenshiYonezu</a>
              </li>
              <li className="px-[4px] pt-[12px] pb-[4px] text-[#065fd4]">
                <a>#シンウルトラマン</a>
              </li>
            </ul> */}
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
                  <img className="h-full object-cover" src={video.snippet.thumbnails?.default?.url} />
                </div>
                <div>
                  <h3>{video.snippet.channelTitle}</h3>
                  <span className="text-xs">626萬 位訂閱者</span>
                </div>
              </div>
              <button className="ml-2 px-[16px] h-9 rounded-[18px] text-white  bg-black">訂閱</button>
            </div>
            <div>
              <div className="flex pb-[12px] overflow-x-scroll whitespace-nowrap no-scrollbar">
                <div className="flex mr-2 px-[16px] h-9 rounded-[18px] bg-[#f2f2f2]">
                  <button className="after:content-['|'] after:mx-2">
                    <SocialMedia.Like className="inline-block"/><span className="align-middle">{countFormat(video.statistics.likeCount)}</span>
                  </button> 
                  <button><SocialMedia.Dislike className="inline-block"/><span></span></button>
                </div>
                <button className="mr-2 px-[16px] h-9 rounded-[18px] bg-[#f2f2f2]">
                  <SocialMedia.Share className="inline-block" />
                  <span className="align-middle	">分享</span>
                </button>
                <button className="mr-2 px-[16px] h-9 rounded-[18px] bg-[#f2f2f2] lg:hidden">
                  <SocialMedia.Save className="inline-block"/>
                  <span className="align-middle	">儲存</span>
                </button>
                <button className="px-[16px] h-9 rounded-[18px]	bg-[#f2f2f2] lg:hidden">
                  <SocialMedia.Report className="inline-block"/>
                  <span className="align-middle	">檢舉</span>
                </button>
                <button className="w-9 h-9 rounded-[18px]	bg-[#f2f2f2] hidden lg:block">
                  <span className="inline-block h-6 w-6 align-middle"><SocialMedia.SpecBtn/></span>
                </button>
              </div>
            </div>
          </div>
          <div className={`p-[12px] bg-[#f2f2f2] rounded-[12px] hidden md:flex md:flex-col md:justify-between md:items-start ${!isDescriptionShow && "h-[104px]"}`}>
            <span>觀看次數：{countFormat(video.statistics.viewCount)}次 · {dayjs(video.snippet.publishedAt).fromNow()}</span>
            <div className={`whitespace-pre-wrap break-words ${!isDescriptionShow && "line-clamp-2"}`} dangerouslySetInnerHTML={descriptionFormat(video.snippet.description)}></div>
            <button onClick={toggleDescription}>{isDescriptionShow ? '只顯示部分資訊' : '顯示完整資訊'}</button>
          </div>
          <div className="flex justify-between items-center p-[12px] border-b border-black/10 md:hidden" onClick={() => setShowActionSheets('comment')}>
            <div className="text-[14px] leading-[17px]">
              <strong>留言 </strong>
              • {commaFormat(video.statistics.commentCount)} 則
            </div>
            <div className="w-[16px]"><SocialMedia.UpDown className="w-full"/></div>
          </div>
          <div className="hidden md:block js-comment">
            <div className="p-[12px] text-[14px] leading-[17px]">
              <strong>{commaFormat(video.statistics.commentCount)} 則留言</strong>
            </div>
            <ul>
              {commentList.map((comment, index) => (
                <CommentChild comment={comment} key={index}/>
              ))}
            </ul>
            <div className={`my-[12px] mx-auto w-8 h-8 rounded-full border-2 border-solid border-[#eee] border-t-[#666] animate-spin ${!isCommentLoad && 'opacity-0'}`}></div>
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
            <VideoCard upNextVideo={upNextVideo} key={index} setCommentNextPageToken={setCommentNextPageToken}/> 
            //key={upNextVideo.id.videoId}
          ))}
        </div>
      </div>
    </>
  );
};

export default WatchPage;
