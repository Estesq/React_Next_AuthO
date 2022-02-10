import React from "react";
import Link from "next/link";
import "components/AuthFooter.scss";

function AuthFooter(props) {
  return (
    <div className="AuthFooter text-center mt-4">
      {props.type === "signup" && (
        <>
          Have an account already?
          <Link href="/auth/signin">
            <a>{props.typeValues.linkTextSignin}</a>
          </Link>
        </>
      )}

      {props.type === "signin" && (
        <>
        {console.log(props.typeValues)}
          {/* <Link href="/auth/signup">
            <a>{props.typeValues.linkTextSignup}</a>
          </Link> */}
          {/* <Link href="/auth/passwordless">
            <a>{props.typeValues.linkTextPasswordless}</a>
          </Link> */}
          {/* <Link href="/auth/forgotpass">
            <a>{props.typeValues.linkTextForgotpass}</a>
          </Link> */}
        </>
      )}
    </div>
  );
}

export default AuthFooter;
