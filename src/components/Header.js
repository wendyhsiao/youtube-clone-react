import SocialMedia from './icons';

function Header() {
  return (
    <div className="sticky top-0 inset-x-0 flex justify-between items-center">
      <div className="w-[113px] h-[48px] px-[12px] py-[14px]">
        <SocialMedia.Logo className="w-full h-full"/>
      </div>
      <div className="flex">
        <div className="p-[12px]"><SocialMedia.Search/></div>
        <div className="p-[12px]"><SocialMedia.More/></div>
      </div>
    </div>
  );
}

export default Header;