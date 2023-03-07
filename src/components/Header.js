import React, { useState } from 'react';
import { useNavigate, createSearchParams, Link } from "react-router-dom";
import SocialMedia from './icons';

function Header({searchInput, onSearchInput}) {
  const navigate = useNavigate();
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    navigate({
      pathname: '/results',
      search: `${createSearchParams({search_query: searchInput})}`
    });
  };
  
  return (
    <div className="sticky top-0 inset-x-0 flex justify-between items-center z-[3] bg-white">
      <Link to={'/'} className="w-[113px] h-[48px] px-[12px] py-[14px]">
        <SocialMedia.Logo className="w-full h-full"/>
      </Link>
      <div className="flex">
        <form className="flex items-center" onSubmit = {handleSearchSubmit} >
          <div className="flex px-[12px] h-[40px] border border-black/10 rounded-l-full border-r-0">
            <input type="search" value={searchInput} name="search_query" className="focus-visible:outline-0" placeholder="搜尋" onChange={(e)=>{onSearchInput(e.target.value)}}/>
          </div>
          <button type="submit" className="h-[40px] w-[64px] border border-black/10 rounded-r-full bg-[#f8f8f8]"><SocialMedia.Search className="mx-auto"/></button>
        </form>
        {/* <div className="p-[12px]"><SocialMedia.Search/></div> */}
        <div className="p-[12px]"><SocialMedia.More/></div>
      </div>
    </div>
  );
}

export default Header;