import SocialMedia from './icons';
import { commaFormat, countFormat, fetchYear }from '../utils/format.js'

function VideoDescription(props) {
  const { snippet, statistics, setShowDescription } = props;
  
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
    <div className="bg-black h-full">
      <div className="flex flex-col bg-slate-100 rounded-t-[12px] h-full">
        <div className="flex justify-between items-center p-[12px]">
          <div>說明</div>
          <div onClick={() => setShowDescription(false)}><SocialMedia.Close/></div>
        </div>
        <div className="p-[12px] overflow-y-scroll">
            <div className="flex flex-col">
              <div>{snippet.title}</div>
              <div className="flex justify-around">
                <div className="flex flex-col">
                  <div>{countFormat(statistics.likeCount)}</div>
                  <span>喜歡次數</span>
                </div>
                <div className="flex flex-col">
                  <div>{commaFormat(statistics.viewCount)}</div>
                  <span>觀看次數</span>
                </div>
                <div className="flex flex-col">
                  <div>{fetchYear(snippet.publishedAt, 'day')}</div>
                  <span>{fetchYear(snippet.publishedAt, 'year')}</span>
                </div>
              </div>
            </div>
            <div dangerouslySetInnerHTML={descriptionFormat(snippet.description)}></div>
        </div>
      </div>
    </div>
  );
}

export default VideoDescription;