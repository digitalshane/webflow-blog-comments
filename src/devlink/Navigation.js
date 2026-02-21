"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./Navigation.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-8":{"id":"e-8","animationType":"custom","eventTypeId":"PAGE_FINISH","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-7","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-7"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1582925971194}},"actionLists":{"a-7":{"id":"a-7","title":"Nav On Page Load","actionItemGroups":[{"actionItems":[{"id":"a-7-n","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".navbar","selectorGuids":["aaeab10d-2cc6-e4ec-8de0-028454ff6860"]},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-7-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"easeInOut","duration":500,"target":{"selector":".navbar","selectorGuids":["aaeab10d-2cc6-e4ec-8de0-028454ff6860"]},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":true,"createdOn":1582925974230}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function Navigation({ as: _Component = _Builtin.NavbarWrapper }) {
  _interactions.useInteractions(_interactionsData, _styles);

  return (
    <_Component
      className={_utils.cx(_styles, "navbar")}
      tag="div"
      data-collapse="tiny"
      data-animation="over-right"
      data-duration="400"
      config={{
        animation: "over-right",
        easing2: "ease",
        easing: "ease",
        _collapse: 3,
        collapse: "tiny",
        noScroll: false,
        duration: 400,
        docHeight: false,
      }}
    >
      <_Builtin.Container tag="div">
        <_Builtin.NavbarBrand
          className={_utils.cx(_styles, "logo")}
          options={{
            href: "#",
          }}
        >
          <_Builtin.Block className={_utils.cx(_styles, "long-text")} tag="div">
            {"Escape."}
          </_Builtin.Block>
        </_Builtin.NavbarBrand>
        <_Builtin.NavbarMenu
          className={_utils.cx(_styles, "nav-menu")}
          tag="nav"
          role="navigation"
        >
          <_Builtin.NavbarLink
            className={_utils.cx(_styles, "nav-link")}
            options={{
              href: "#",
            }}
          >
            {"Home"}
          </_Builtin.NavbarLink>
          <_Builtin.NavbarLink
            className={_utils.cx(_styles, "nav-link")}
            options={{
              href: "#",
            }}
          >
            {"Categories"}
          </_Builtin.NavbarLink>
          <_Builtin.NavbarLink
            className={_utils.cx(_styles, "nav-link")}
            options={{
              href: "#",
            }}
          >
            {"About"}
          </_Builtin.NavbarLink>
          <_Builtin.NavbarLink
            className={_utils.cx(_styles, "nav-link")}
            options={{
              href: "#",
            }}
          >
            {"Contact"}
          </_Builtin.NavbarLink>
          <_Builtin.Link
            className={_utils.cx(_styles, "close-x")}
            vis={{
              small: false,
              medium: false,
              main: false,
            }}
            button={false}
            block=""
            options={{
              href: "#",
            }}
          >
            {"×"}
          </_Builtin.Link>
        </_Builtin.NavbarMenu>
        <_Builtin.NavbarButton
          className={_utils.cj(_utils.cx(_styles, "menu-button"), "w-clearfix")}
          vis={{
            main: false,
            medium: false,
            small: false,
          }}
          tag="div"
        >
          <_Builtin.Icon
            className={_utils.cx(_styles, "menu-icon")}
            widget={{
              type: "icon",
              icon: "nav-menu",
            }}
          />
          <_Builtin.Block className={_utils.cx(_styles, "menu-link")} tag="div">
            {"MENU"}
          </_Builtin.Block>
        </_Builtin.NavbarButton>
      </_Builtin.Container>
    </_Component>
  );
}
