import React, { useState } from "react";
import FormAlert from "components/FormAlert";
import AuthForm from "components/AuthForm";
import AuthSocial from "components/AuthSocial";
import AuthFooter from "components/AuthFooter";
import { useRouter } from "next/router";

function Auth(props) {
  const router = useRouter();
  const [formAlert, setFormAlert] = useState(null);

  const handleAuth = (user) => {
    router.push(props.afterAuthPath);
  };

  const handleFormAlert = (data) => {
    setFormAlert(data);
  };

  return (
    <>
      {formAlert && (
        <FormAlert type={formAlert.type} message={formAlert.message} />
      )}

      <AuthForm
        type={props.type}
        typeValues={props.typeValues}
        onAuth={handleAuth}
        onFormAlert={handleFormAlert}
      />

      {["signup", "signin", "login"].includes(props.type) && (
        <>
          {props.providers && props.providers.length && (
            <>
              {["signup", "signin","login"].includes(props.type) && (
                <small className="text-center d-block my-3">OR</small>)}
              <AuthSocial
                type={props.type}
                buttonText={props.typeValues.buttonText}
                providers={props.providers}
                showLastUsed={true}
                onAuth={handleAuth}
                onError={(message) => {
                  handleFormAlert({
                    type: "error",
                    message: message,
                  });
                }}
              />
            </>
          )}

          <AuthFooter type={props.type} typeValues={props.typeValues} />
        </>
      )}
    </>
  );
}

export default Auth;
