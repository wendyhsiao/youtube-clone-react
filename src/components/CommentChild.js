import SocialMedia from '../components/icons';

// day.js 組件
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';

dayjs.locale('zh-tw');
dayjs.extend(relativeTime)

function CommentChild({comment}) {
  const { 
    authorProfileImageUrl, authorDisplayName, publishedAt, textDisplay, likeCount
  } = comment.snippet.topLevelComment.snippet;
  return (
    <li className="border-b border-black/10 last:border-b-0">
      <div className="flex px-[12px] py-[16px]">
        <a className="w-[40px] h-[40px] rounded-full overflow-hidden shrink-0">
          <img className="h-full object-cover" alt="" src={authorProfileImageUrl}/>
        </a>
        <div className="grow px-[12px]">
          <div className="flex justify-between">
            <div>{authorDisplayName}</div>
            <div>{dayjs(publishedAt).fromNow()}</div>
          </div>
          <p className="my-[4px]" dangerouslySetInnerHTML={{__html:textDisplay}}></p>
          <div className="flex items-center">
            <button className="flex justify-center items-center w-[40px] h-[40px]">
              <SocialMedia.Like className="w-[16px] h-[16px]"/>
            </button>
            {likeCount > 0 && <span className="mr-[4px]">{likeCount}</span>}
            <button className="flex justify-center items-center w-[40px] h-[40px]">
              <SocialMedia.Dislike className="w-[16px] h-[16px]"/>
            </button>
            <button className="flex justify-center items-center w-[40px] h-[40px]">
              <SocialMedia.Comment className="w-[16px] h-[16px]"/>
            </button>
            {comment.snippet.totalReplyCount > 0 && <span className="mr-[4px]">{comment.snippet.totalReplyCount}</span>}
            <button className="flex justify-center items-center w-[40px] h-[40px] ml-auto">
              <SocialMedia.More />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
};

export default CommentChild;