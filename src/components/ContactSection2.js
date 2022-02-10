import React from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "components/SectionHeader";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Contact from "components/Contact";
import "components/ContactSection2.scss";

function ContactSection2(props) {
  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={2}
          spaced={true}
          className="text-center"
        />
        <Row>
          <Col xs={12} md={6}>
            <iframe
              className="ContactSection2__map has-background-light"
              src={props.embedSrc}
              title="Contact Map"
              frameBorder={0}
            />
          </Col>
          <Col xs={12} md={6} className="mt-3 mt-md-0">
            <Contact
              showNameField={props.showNameField}
              buttonText={props.buttonText}
              buttonColor={props.buttonColor}
            />
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default ContactSection2;
