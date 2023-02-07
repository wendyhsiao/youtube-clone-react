import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from "react-router-dom";
import { apiHelper } from '../utils/apis';
import VideoCard from '../components/VideoCard';

const ResultsPage = () => {
  const [videoList, setVideoList] = useState([]);
  let location = useLocation();
  let searchQuery = new URLSearchParams(location.search).get('search_query');

  const fetchSearchResult = useCallback(() => {
    const searchVideos = async () => {
      const searchParams = {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        // regionCode: 'TW',
        maxResults: 20,
        key: process.env.REACT_APP_YT_API_KEY,
      };
      
      const searchURL = new URLSearchParams(searchParams);
      const {data} = await apiHelper.get(`search?${searchURL.toString()}`);
      setVideoList(data.items);
    };
    searchVideos();
  });
  
  useEffect(() => {
    fetchSearchResult();
  }, [location]);

  return (
    <div className="mx-auto px-6 py-4 max-w-[1096px]">
      <ul>
        {videoList.map((video, index) => (
          // <li key={index}>{video.snippet.title}</li>
          <VideoCard upNextVideo={video} key={index} page="resultPage"/> 
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;