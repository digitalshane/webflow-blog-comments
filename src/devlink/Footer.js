"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./Footer.module.css";

export function Footer({ as: _Component = _Builtin.Section }) {
  return (
    <_Component
      className={_utils.cx(_styles, "main-section", "dark")}
      grid={{
        type: "section",
      }}
      tag="div"
    >
      <_Builtin.Container tag="div">
        <_Builtin.Block
          className={_utils.cx(_styles, "section-heading")}
          tag="div"
        >
          <_Builtin.Heading
            className={_utils.cx(_styles, "white")}
            editable={true}
            tag="h2"
          >
            {"Stay in Touch"}
          </_Builtin.Heading>
          <_Builtin.Block
            className={_utils.cx(_styles, "med-divider")}
            tag="div"
          />
        </_Builtin.Block>
        <_Builtin.FormWrapper className={_utils.cx(_styles, "form-wrapper")}>
          <_Builtin.FormForm
            className={_utils.cj(_utils.cx(_styles, ""), "w-clearfix")}
            name="email-form"
            data-name="Email Form"
            method="get"
            id="email-form"
          >
            <_Builtin.FormTextInput
              className={_utils.cx(_styles, "field")}
              name="email"
              data-name="Email"
              type="email"
              placeholder="Enter your email address"
              maxLength={256}
              required={true}
              disabled={false}
              autoFocus={false}
              id="email"
            />
            <_Builtin.FormButton
              className={_utils.cx(_styles, "submit-button")}
              type="submit"
              value="Submit"
              data-wait="Please wait..."
            />
          </_Builtin.FormForm>
          <_Builtin.FormSuccessMessage
            className={_utils.cx(_styles, "success-message")}
          >
            <_Builtin.Paragraph>
              {"Thank you! Your submission has been received!"}
            </_Builtin.Paragraph>
          </_Builtin.FormSuccessMessage>
          <_Builtin.FormErrorMessage>
            <_Builtin.Paragraph>
              {"Oops! Something went wrong while submitting the form"}
            </_Builtin.Paragraph>
          </_Builtin.FormErrorMessage>
        </_Builtin.FormWrapper>
      </_Builtin.Container>
      <_Builtin.Block
        className={_utils.cx(_styles, "footer-section")}
        tag="div"
      >
        <_Builtin.Container tag="div">
          <_Builtin.Row
            tag="div"
            columns={{
              main: "4|8",
              small: "custom",
            }}
          >
            <_Builtin.Column tag="div">
              <_Builtin.Link
                className={_utils.cx(_styles, "footer-logo")}
                button={false}
                block="inline"
                options={{
                  href: "/",
                }}
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "long-text")}
                  tag="div"
                >
                  {"Escape."}
                </_Builtin.Block>
              </_Builtin.Link>
            </_Builtin.Column>
            <_Builtin.Column
              className={_utils.cx(_styles, "footer-links")}
              tag="div"
            >
              <_Builtin.Link
                className={_utils.cx(_styles, "footer-link")}
                editable={true}
                button={false}
                block=""
                options={{
                  href: "/",
                }}
              >
                {"Home"}
              </_Builtin.Link>
              <_Builtin.Link
                className={_utils.cx(_styles, "footer-link")}
                editable={true}
                button={false}
                block=""
                options={{
                  href: "/categories",
                }}
              >
                {"Categories"}
              </_Builtin.Link>
              <_Builtin.Link
                className={_utils.cx(_styles, "footer-link")}
                editable={true}
                button={false}
                block=""
                options={{
                  href: "/about",
                }}
              >
                {"About"}
              </_Builtin.Link>
              <_Builtin.Link
                className={_utils.cx(_styles, "footer-link")}
                editable={true}
                button={false}
                block=""
                options={{
                  href: "/contact",
                }}
              >
                {"Contact"}
              </_Builtin.Link>
            </_Builtin.Column>
          </_Builtin.Row>
        </_Builtin.Container>
      </_Builtin.Block>
    </_Component>
  );
}
