import React from "react";
import { Flex, Heading, Text } from "@hubspot/ui-extensions";

export const SectionHeader = ({
  title,
  description,
  actions,
  children,
  gap = "xs",
  titleAs = "h2",
}) => {
  const body = [];

  if (title != null) {
    body.push(React.createElement(Heading, { key: "title", as: titleAs }, title));
  }

  if (description != null) {
    body.push(
      React.createElement(
        Text,
        { key: "description", variant: "microcopy" },
        description
      )
    );
  }

  if (children != null) {
    body.push(children);
  }

  const content = React.createElement(Flex, { direction: "column", gap }, ...body);

  if (actions == null) return content;

  return React.createElement(
    Flex,
    { direction: "row", justify: "between", align: "start", gap: "sm" },
    content,
    actions
  );
};
