import React from "react";
import "components/MediaEmbed.scss";

function MediaEmbed(props) {
  const { width, height, ...otherProps } = props;

  return (
    <iframe
      className="MediaEmbed"
      title="Media Embed"
      allow="autoplay *; encrypted-media *;"
      frameBorder={0}
      style={{
        height: props.height,
        maxWidth: props.width,
      }}
      {...otherProps}
    />
  );
}

export default MediaEmbed;
