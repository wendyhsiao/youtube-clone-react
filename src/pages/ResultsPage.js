import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { apiHelper } from '../utils/apis';
import VideoCard from '../components/VideoCard';

const ResultsPage = () => {
  const [videoList, setVideoList] = useState([]);
  const [resultNextPageToken, setResultNextPageToken] = useState('');
  const resultNextPageTokenRef = useRef(resultNextPageToken);
  let location = useLocation();
  let searchQuery = new URLSearchParams(location.search).get('search_query');

  const fetchSearchResult = useCallback((more) => {
    const searchVideos = async () => {
      const searchParams = {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        // regionCode: 'TW',
        maxResults: 20,
        key: process.env.REACT_APP_YT_API_KEY,
      };

      if (resultNextPageTokenRef.current) {
        searchParams['pageToken'] = resultNextPageTokenRef.current;
      };
      
      const searchURL = new URLSearchParams(searchParams);
      const {data} = await apiHelper.get(`search?${searchURL.toString()}`);

      if (more) {
        setVideoList(prevState => [
          ...prevState,
          ...data.items
        ]);
      } else {
        setVideoList(data.items);
      };
      setResultNextPageToken(data.nextPageToken);
      resultNextPageTokenRef.current = data.nextPageToken;
    };
    searchVideos();
  });
  
  useEffect(() => {
    fetchSearchResult();
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
      const scrollHeight = document.querySelector(".js-result").scrollHeight;
      const offsetTop = document.querySelector(".js-result").offsetTop;
      const clientHeight  = document.documentElement.clientHeight; //瀏覽器高度
      const scrollTop = document.documentElement.scrollTop;
      const distance = 50;

      if (
        (scrollTop + clientHeight) >= (scrollHeight + offsetTop - distance) &&
        resultNextPageTokenRef.current !== undefined
      ) fetchSearchResult('more');
    }
    const debounceFunc = debounce(loadMore, 500);

    window.addEventListener('scroll', debounceFunc);
    return () => window.removeEventListener('scroll', debounceFunc);
  }, []);

  return (
    <div className="mx-auto px-6 py-4 max-w-[1096px] js-result">
      <ul>
        {videoList.map((video, index) => (
          // <li key={index}>{video.snippet.title}</li>
          <VideoCard upNextVideo={video} key={index} page="resultPage"/> 
        ))}
      </ul>
      <div className="my-[12px] mx-auto w-8 h-8 rounded-full border-2 border-solid border-[#eee] border-t-[#666] animate-spin"></div>
    </div>
  );
};

export default ResultsPage;