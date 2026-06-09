// ═══════════════════════════════════════════════════════════════════════════
// Pre-wrapped Safe* components — every collection component with required
// array props, hardened via withSafeArrayProps. The exact prop lists live in
// SAFE_ARRAY_PROPS (catalogs.js).
// ═══════════════════════════════════════════════════════════════════════════

import { MultiSelect, Select, StepIndicator, ToggleGroup } from "@hubspot/ui-extensions";
import { DataTable } from "../datatable/DataTable.jsx";
import { Kanban } from "../kanban/Kanban.jsx";
import { FormBuilder } from "../form/FormBuilder.jsx";
import { AvatarStack } from "../common-components/AvatarStack.js";
import { KeyValueList } from "../common-components/KeyValueList.js";
import { Feed } from "../feed/Feed.jsx";
import { Calendar } from "../calendar/Calendar.jsx";
import { CrmDataTable, CrmKanban } from "../utils/crmSearchAdapters.js";
import { SAFE_ARRAY_PROPS } from "./catalogs.js";
import { withSafeArrayProps } from "./withSafeArrayProps.js";

const wrap = (Component, name) => withSafeArrayProps(Component, name, SAFE_ARRAY_PROPS[name]);

// Native @hubspot/ui-extensions
export const SafeSelect = wrap(Select, "Select");
export const SafeMultiSelect = wrap(MultiSelect, "MultiSelect");
export const SafeToggleGroup = wrap(ToggleGroup, "ToggleGroup");
export const SafeStepIndicator = wrap(StepIndicator, "StepIndicator");

// hs-uix
export const SafeDataTable = wrap(DataTable, "DataTable");
export const SafeKanban = wrap(Kanban, "Kanban");
export const SafeFormBuilder = wrap(FormBuilder, "FormBuilder");
export const SafeAvatarStack = wrap(AvatarStack, "AvatarStack");
export const SafeKeyValueList = wrap(KeyValueList, "KeyValueList");
export const SafeFeed = wrap(Feed, "Feed");
export const SafeCalendar = wrap(Calendar, "Calendar");
export const SafeCrmDataTable = wrap(CrmDataTable, "CrmDataTable");
export const SafeCrmKanban = wrap(CrmKanban, "CrmKanban");
