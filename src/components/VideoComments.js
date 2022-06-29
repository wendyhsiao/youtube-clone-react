import SocialMedia from '../components/icons';
import VideoActionSheets from './VideoActionSheets';

function VideoComments(props) {
  const { commentList, setShowActionSheets } = props;

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
            <div>{publishedAt}</div>
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
      {commentList.map((comment, index) => (
        <Comment comment={comment} key={index}/>
      ))}
    </VideoActionSheets>
  )
}

export default VideoComments;