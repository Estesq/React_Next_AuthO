import React from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "components/SectionHeader";
import AppleMusicEmbed from "components/AppleMusicEmbed";

function AppleMusicSection(props) {
  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container
        style={{
          maxWidth: "768px",
        }}
      >
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={2}
          spaced={true}
          className="text-center"
        />
        <AppleMusicEmbed url="https://music.apple.com/us/album/ultralife/1440894720?i=1222147721" />
      </Container>
    </Section>
  );
}

export default AppleMusicSection;
