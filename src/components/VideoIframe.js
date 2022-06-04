function VideoIframe(props) {
  const embedURL = `https://www.youtube.com/embed/${props.id}`;

  return (
    <div className="relative pb-[56.25%]">
      <div className="absolute inset-0">
        <iframe
          className="w-full h-full"
          src={embedURL}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default VideoIframe;
