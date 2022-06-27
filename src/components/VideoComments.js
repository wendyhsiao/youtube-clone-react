import VideoActionSheets from './VideoActionSheets';

function VideoComments(props) {
  const { setShowActionSheets } = props;
  return (
    <VideoActionSheets title={'留言'} setShowActionSheets={setShowActionSheets}>
      <div>comment</div>
    </VideoActionSheets>
  )
}

export default VideoComments;