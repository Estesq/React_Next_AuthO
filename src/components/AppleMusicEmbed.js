import React from "react";
import MediaEmbed from "components/MediaEmbed";

function AppleMusicEmbed(props) {
  // By Lachlan Campbell from https://github.com/lachlanjc/react-music-embed
  const src = props.url.replace("//music.apple.com", "//embed.music.apple.com");

  return <MediaEmbed src={src} width="100%" height={150} />;
}

export default AppleMusicEmbed;
