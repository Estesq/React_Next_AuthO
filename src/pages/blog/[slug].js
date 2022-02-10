import React from "react";
import HeroSection from "components/HeroSection";

function BlogPage2(props) {
  return (
    <HeroSection
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
      title="Your landing page title here"
      subtitle="This landing page is perfect for showing off your awesome product and driving people to sign up for a paid plan."
      image="https://uploads.divjoy.com/undraw-japan_ubgk.svg"
      buttonText="Get Started"
      buttonColor="primary"
      buttonPath="/pricing"
    />
  );
}

export default BlogPage2;
