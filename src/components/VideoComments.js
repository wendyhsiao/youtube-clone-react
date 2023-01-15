import React, { useState, useEffect, useCallback, useRef } from 'react';
import SocialMedia from '../components/icons';
import VideoActionSheets from './VideoActionSheets';
import CommentChild from './CommentChild';

function VideoComments(props) {
  const { commentList, showActionSheets, setShowActionSheets, fetchComments } = props;

  function debounce(fun, delay) {
    let timer = null;
    return function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(fun, delay);
    };
  };

  useEffect(() => {
    function loadMore () {
      const scrollHeight = document.getElementById('js-box').scrollHeight;
      const clientHeight  = document.getElementById('js-box').clientHeight;
      const scrollTop = document.getElementById('js-box').scrollTop;
      const distance = 50;
      if (
        (scrollTop + clientHeight) >= (scrollHeight - distance) 
      ) fetchComments();
    }
    
    document.getElementById('js-box').addEventListener('scroll', debounce(loadMore, 500));
    return () => document.getElementById('js-box').removeEventListener('scroll', debounce(loadMore, 500));
  }, []);
  


  return (
    <VideoActionSheets title={'留言'} setShowActionSheets={setShowActionSheets}>
      {showActionSheets === 'comment' && 
        commentList.map((comment, index) => (
          <CommentChild comment={comment} key={index}/>
        ))
      }
    </VideoActionSheets>
  )
}

export default VideoComments;