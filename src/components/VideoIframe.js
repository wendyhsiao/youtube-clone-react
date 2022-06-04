function VideoIframe() {
  return (
    <iframe
      className="w-full h-full"
      src="https://www.youtube.com/embed/Zhx1n6uvgUE"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

export default VideoIframe;
