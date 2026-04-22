import React from "react";
import {
  Button,
  Dropdown,
  Flex,
  Icon,
  Text,
} from "@hubspot/ui-extensions";

// ---------------------------------------------------------------------------
// KanbanCardActions — pure layout helper for the footer action row.
// Shipped alongside Kanban so callers get the "icon row bottom-right" look
// without hand-rolling Button/Icon combinations per card.
// ---------------------------------------------------------------------------

const renderButton = (action, display, size) => {
  const { key, label, icon, tooltip, variant = "transparent", disabled, onClick, href } = action;
  // Default tooltip to the label. Icon-only buttons rely on it for context;
  // labeled buttons still benefit from a tooltip for truncated/overflowed text.
  const buttonProps = {
    key: key || label,
    variant,
    size,
    disabled,
    tooltip: tooltip || label,
  };
  if (href) buttonProps.href = typeof href === "string" ? href : href;
  if (onClick) buttonProps.onClick = onClick;

  // display="icon"  — icon alone, aria-label carries the action name
  // display="label" — label text only (compact, matches prototype's pipe row)
  // display="iconAndLabel" — icon + label side by side
  // Explicit size="sm" on Icon — auto-sizing from an "xs" Button renders the
  // icon noticeably smaller than a stand-alone sm icon, so we pin it.
  if (display === "icon") {
    return (
      <Button {...buttonProps}>
        {icon ? <Icon name={icon} size="sm" screenReaderText={label} /> : label}
      </Button>
    );
  }
  if (display === "label") {
    return <Button {...buttonProps}>{label}</Button>;
  }
  return (
    <Button {...buttonProps}>
      <Flex direction="row" align="center" gap="xs">
        {icon ? <Icon name={icon} size="sm" screenReaderText={label} /> : null}
        <Text variant="microcopy">{label}</Text>
      </Flex>
    </Button>
  );
};

export const KanbanCardActions = ({
  actions = [],
  display = "icon",
  // Default to xs — the Button's own padding at sm visibly pushes icons away
  // from Tile edges. Icon glyph inside stays pinned to size="sm" in renderButton
  // so the icon itself doesn't shrink, only the hit-target/button padding does.
  size = "xs",
  align = "end",
  gap = "flush",
  separator = "none",
  overflowAfter,
  overflowLabel = "More",
}) => {
  const visible = actions.filter((a) => a.visible !== false);
  if (visible.length === 0) return null;

  const cutoff = typeof overflowAfter === "number" ? Math.max(0, overflowAfter) : visible.length;
  const primary = visible.slice(0, cutoff);
  const overflow = visible.slice(cutoff);

  const renderedPrimary = primary.map((action, idx) => {
    const button = renderButton(action, display, size);
    if (separator === "pipe" && idx > 0) {
      return (
        <React.Fragment key={`${action.key || action.label}-sep`}>
          <Text variant="microcopy">|</Text>
          {button}
        </React.Fragment>
      );
    }
    return button;
  });

  const renderedOverflow =
    overflow.length > 0 ? (
      <Dropdown variant="transparent" buttonText={overflowLabel} buttonSize={size} key="overflow">
        {overflow.map((action) => (
          <Dropdown.ButtonItem
            key={action.key || action.label}
            onClick={action.onClick}
          >
            {action.label}
          </Dropdown.ButtonItem>
        ))}
      </Dropdown>
    ) : null;

  // Place the cluster via justify on the main (row) axis and align on the
  // cross axis. With a stretched-by-default parent column Flex, this row Flex
  // spans the full card content width, so `justify="end"` hard-anchors the
  // last button to the right edge and `align="end"` aligns the buttons to the
  // bottom of this row.
  const justify = align === "end" ? "end" : align === "between" ? "between" : "start";

  return (
    <Flex direction="row" align="end" justify={justify} gap={gap}>
      {renderedPrimary}
      {renderedOverflow}
    </Flex>
  );
};
