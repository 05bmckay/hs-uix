# Icon component behavior notes

Context: `src/common-components/Icon.js` is a wrapper around HubSpot's native `Icon` plus a custom SVG-data-URI fallback rendered through HubSpot `Image`. During Feed demo work, custom chevron icons (`Down` / `Right`) exposed several interaction and layout edge cases.

## What we observed

### Native and custom icons use different render paths

`Icon` delegates to HubSpot's native `Icon` when the request is natively expressible. Otherwise it renders a HubSpot `Image` whose `src` is an SVG data URI.

That means these two usages can behave differently even though callers use the same `Icon` API:

```jsx
<Icon name="email" />      // native HubSpot Icon path
<Icon name="Down" />       // custom Image fallback path
```

### Custom `Image` icons can disappear/collapse in tight flex layouts

In the Feed card header, a bare custom `Icon` fallback appeared in the DOM but was visually missing or effectively collapsed:

```html
<span class="Image__ImageWrapper...">
  <img width="16" height="16" src="data:image/svg+xml..." />
</span>
```

The historical Feed diagnosis used a non-flexing wrapper around an action-only
`Link`:

```jsx
<Box flex="none" alignSelf="center">
  <Link variant="dark" onClick={onToggleExpanded}>
    <Icon name={expanded ? "Down" : "Right"} size="md" />
  </Link>
</Box>
```

This reproduction established that `Box flex="none"` fixes the layout collapse,
but an action-only `Link` is not the supported public composition because
HubSpot's Link API expects an `href`. New action controls should use the Button
composition documented below. Without the Box, HubSpot's layout could render the
image node but not give it useful visual space.

### `Image` click handling works, but context matters

A demo test bed confirmed the custom Image path can render and receive clicks in multiple contexts:

- `hs-uix <Icon name="Down" onClick={...} />`
- Direct HubSpot `<Image src={makeIconDataUri("Down").src} onClick={...} />`
- HubSpot `<Link>` wrapping direct `<Image>`
- HubSpot `<Link>` wrapping `hs-uix <Icon>`
- HubSpot `<Button>` with `hs-uix <Icon>` child
- HubSpot `<ButtonRow>` with custom icon action

So the issue was not that HubSpot `Image` cannot be interactive; it was layout/context sensitivity in the Feed header.

### Native `Icon` should not be assumed to support interaction props

Passing `onClick` directly to HubSpot's native `Icon` did not behave reliably. Interactive native icons should be wrapped in an interactive primitive such as `Link` or `Button`.

The wrapper currently uses `Link` for interactive native icons to preserve the native glyph while putting `onClick` / `href` on a primitive that owns interaction.

### Exact icon names matter

Custom scraped icons are keyed with original casing, e.g. `Down`, `Right`, `Email`. Native HubSpot icon names are lower/camel-case, e.g. `downCarat`, `right`, `email`.

The resolver now prefers:

1. exact native name
2. exact custom name
3. alias / case-insensitive native mapping

This allows callers to explicitly request a custom scraped icon with `Down` while still supporting convenient aliases like `down`.

### Wrapping full title content in `Link` can distort layout

Wrapping the whole Feed title cluster (`chevron + type icon + title text`) in a `Link` made the title underlined and affected alignment/layout. The current Feed approach keeps only the chevron link-wrapped.

## Historical current Feed implementation

The Feed card collapse control still contains the diagnostic action-only Link
composition below. It records the host-layout finding; it is not the supported
pattern for new callers:

```jsx
<Flex direction="row" align="center" gap="xs" wrap="nowrap">
  <Box flex="none" alignSelf="center">
    <Link variant="dark" onClick={onToggleExpanded}>
      <Icon
        name={expanded ? "Down" : "Right"}
        size="md"
        screenReaderText={expanded ? "Collapse" : "Expand"}
      />
    </Link>
  </Box>
  {typeIcon}
  {titleText}
</Flex>
```

## Supported action pattern

For new action controls, keep the non-flexing layout wrapper and let Button own
the action:

```jsx
<Flex direction="row" align="center" gap="xs" wrap="nowrap">
  <Box flex="none" alignSelf="center">
    <Button variant="transparent" size="small" onClick={onToggleExpanded}>
      <Icon
        name={expanded ? "Down" : "Right"}
        size="md"
        screenReaderText={expanded ? "Collapse" : "Expand"}
      />
    </Button>
  </Box>
  {typeIcon}
  {titleText}
</Flex>
```

Use Link only for navigation and always provide its `href`.

## Demo test bed

A temporary/diagnostic demo exists in `../hs-uix-demos/src/app/pages/icon-demos.jsx` named **Icon clickable test bed**. It exercises custom icon rendering and click behavior across multiple HubSpot primitive contexts.

## Resolution

The public [`common-components` Icon documentation](../src/common-components/README.md#icon)
now defines the native/Icon vs custom/Image render paths, name-resolution rules,
and supported `Flex` / `Link` / `Button` / `ButtonRow` compositions.

For now, callers should compose `Box flex="none"` + `Button` for actions, or a
`Link` with `href` for navigation, where layout requires it. We are not
universally wrapping fallback Images because that would change existing remote-
component trees inside Link, Button, and ButtonRow contexts. A separate
`ClickableIcon` / `IconButton` helper would be additive, but its API and render
tree remain deferred pending design work and HubSpot host integration coverage.
