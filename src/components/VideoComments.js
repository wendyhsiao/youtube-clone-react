import React, { useState, useEffect, useCallback, useRef } from 'react';
import SocialMedia from '../components/icons';
import VideoActionSheets from './VideoActionSheets';
// day.js 組件
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';

dayjs.locale('zh-tw');
dayjs.extend(relativeTime)

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
  
  function Comment({comment}) {
    const { 
      authorProfileImageUrl, authorDisplayName, publishedAt, textDisplay, likeCount
    } = comment.snippet.topLevelComment.snippet;

    return (
      <div className="flex px-[12px] py-[16px] border-b border-black/10">
        <a className="w-[40px] h-[40px] rounded-full overflow-hidden shrink-0">
          <img className="h-full object-cover" alt="" src={authorProfileImageUrl}/>
        </a>
        <div className="grow px-[12px]">
          <div className="flex justify-between">
            <div>{authorDisplayName}</div>
            <div>{dayjs(publishedAt).fromNow()}</div>
          </div>
          <p className="my-[4px]" dangerouslySetInnerHTML={{__html:textDisplay}}></p>
          <div className="flex">
            <div className="flex justify-center items-center w-[40px] h-[40px]">
              <SocialMedia.Like className="w-[16px] h-[16px]"/>
              {likeCount > 0 && <span className="ml-[4px]">{likeCount}</span>}
            </div>
            <div className="flex justify-center items-center w-[40px] h-[40px]">
              <SocialMedia.Dislike className="w-[16px] h-[16px]"/>
            </div>
            <div className="flex justify-center items-center w-[40px] h-[40px]">
              <SocialMedia.Comment className="w-[16px] h-[16px]"/>
              {comment.snippet.totalReplyCount > 0 && <span className="ml-[4px]">{comment.snippet.totalReplyCount}</span>}
            </div>
            <div className="flex justify-center items-center w-[40px] h-[40px] ml-auto">
              <SocialMedia.More />
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <VideoActionSheets title={'留言'} setShowActionSheets={setShowActionSheets}>
      {showActionSheets === 'comment' && 
        commentList.map((comment, index) => (
          <Comment comment={comment} key={index}/>
        ))
      }
    </VideoActionSheets>
  )
}

export default VideoComments;