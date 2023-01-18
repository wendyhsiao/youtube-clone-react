import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiHelper } from '../utils/apis';
import VideoCardHome from '../components/VideoCardHome';

const Home = () => {
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    async function fetchVideoList() {
      const searchParams = {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        type: 'video',
        regionCode: 'TW',
        maxResults: 20,
        key: process.env.REACT_APP_YT_API_KEY,
      };
      
      const searchURL = new URLSearchParams(searchParams);
      const {data} = await apiHelper.get(`videos?${searchURL.toString()}`);
      setVideoList(data.items);
    };
    fetchVideoList();
  }, []);


  return (
    <>
      <ul className="flex flex-wrap">
        {videoList.map((video, index) => (
          <VideoCardHome upNextVideo={video} key={index}/>
        ))}
      </ul>
    </>
  )
};

export default Home;