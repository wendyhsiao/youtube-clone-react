import SocialMedia from './icons';

function VideoActionSheets(props) {
  const { title, setShowActionSheets, children } = props;

  return (
    <div className="bg-black h-full">
      <div className="flex flex-col bg-slate-100 rounded-t-[12px] h-full">
        <div className="flex justify-between items-center p-[12px] text-sm leading-[14px] border-b border-black/10">
          <div>{title}</div>
          <div className="p-[12px]" onClick={() => setShowActionSheets('')}><SocialMedia.Close/></div>
        </div>
        <ul id="js-box" className="p-[12px] overflow-y-scroll">
          {children}
        </ul>
      </div>
    </div>
  )
}

export default VideoActionSheets;