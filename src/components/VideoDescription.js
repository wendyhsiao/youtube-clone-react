import SocialMedia from './icons';
import VideoActionSheets from './VideoActionSheets';
import { commaFormat, countFormat, fetchYear }from '../utils/format.js'

function VideoDescription(props) {
  const { snippet, statistics, setShowActionSheets } = props;
  
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

  return (
    <VideoActionSheets title={'說明'} setShowActionSheets={setShowActionSheets}>
      <div className="flex flex-col border-b border-black/10">
        <div className="text-sm leading-[14px] py-[4px]">{snippet.title}</div>
        <div className="flex justify-around py-[8px]">
          <div className="flex flex-col items-center">
            <div className="text-[18px] leading-[26px] font-bold">{countFormat(statistics.likeCount)}</div>
            <span>喜歡次數</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[18px] leading-[26px] font-bold">{commaFormat(statistics.viewCount)}</div>
            <span>觀看次數</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[18px] leading-[26px] font-bold">{fetchYear(snippet.publishedAt, 'day')}</div>
            <span>{fetchYear(snippet.publishedAt, 'year')}</span>
          </div>
        </div>
      </div>
      <div className="pt-[12px] pb-[32px] whitespace-pre-wrap break-words" dangerouslySetInnerHTML={descriptionFormat(snippet.description)}></div>
    </VideoActionSheets>
  );
}

export default VideoDescription;