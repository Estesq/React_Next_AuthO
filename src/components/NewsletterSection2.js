import React from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "components/SectionHeader";
import Newsletter from "components/Newsletter";
import "components/NewsletterSection2.scss";

function NewsletterSection2(props) {
  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container className="text-center">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={2}
          spaced={false}
        />
        <div className="NewsletterSection2__form-container mx-auto">
          <Newsletter
            buttonText={props.buttonText}
            buttonColor={props.buttonColor}
            inputPlaceholder={props.inputPlaceholder}
            subscribedMessage={props.subscribedMessage}
          />
        </div>
      </Container>
    </Section>
  );
}

export default NewsletterSection2;
