import React from "react";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";

function SettingsNav(props) {
  return (
    <Nav variant="pills" {...props}>
      <Nav.Item>
        <Link href="/settings/general" passHref={true}>
          <Nav.Link eventKey="general">General</Nav.Link>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link href="/settings/password" passHref={true}>
          <Nav.Link eventKey="password">Password</Nav.Link>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link href="/settings/billing" passHref={true}>
          <Nav.Link eventKey="billing">Billing</Nav.Link>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link href="/settings/links" passHref={true}>
          <Nav.Link eventKey="links">Social Linking</Nav.Link>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link href="/settings/organization" passHref={true}>
          <Nav.Link eventKey="organization">Organization</Nav.Link>
        </Link>
      </Nav.Item>
    </Nav>
  );
}

export default SettingsNav;
