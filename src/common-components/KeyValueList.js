import React from "react";
import { DescriptionList, DescriptionListItem, Flex } from "@hubspot/ui-extensions";

export const KeyValueList = ({ items = [], direction = "row", gap = "sm" }) => {
  const rows = items.map((item, index) =>
    React.createElement(
      DescriptionListItem,
      {
        key: item.key ?? item.label ?? `kv-${index}`,
        label: item.label,
      },
      item.value
    )
  );

  return React.createElement(
    Flex,
    { direction: "column", gap },
    React.createElement(DescriptionList, { direction }, ...rows)
  );
};
