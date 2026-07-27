# hs-uix

[![npm version](https://img.shields.io/npm/v/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![npm downloads](https://img.shields.io/npm/dm/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![license](https://img.shields.io/npm/l/hs-uix)](./LICENSE)

补全 HubSpot UI Extensions 所缺失的组件层。

无需为每个扩展重复构建搜索、过滤、分页、校验、加载状态和边缘情况处理，即可构建复杂的 CRM 体验。hs-uix 将这些重复出现的模式封装成生产就绪的表格 (tables)、表单 (forms)、看板 (boards)、信息流 (feeds)、日历 (calendars)、过滤器 (filters) 和共享控件。

![DataTable, FormBuilder, Kanban, Feed, Calendar, and FilterBuilder running inside HubSpot](https://raw.githubusercontent.com/05bmckay/hs-uix/main/docs/assets/hs-uix-gallery.jpg)

## 为什么选择 hs-uix？

HubSpot 为 UI Extensions 提供了强大的原语集。hs-uix 将这些原语转化为完整的产品界面：

- **交付完整的工作流** — 搜索、过滤、排序、分页、校验、空状态、加载状态和 i18n 已在设计中协同完成。
- **保持原生体验** — 输出完全由 `@hubspot/ui-extensions` 组件组成。
- **复用同一套数据模型** — DataTable、Kanban、Feed 和 Calendar 共享熟悉的配置模式。
- **增强鲁棒性** — 可选的安全包装器 (safe wrappers) 可修复常见的无效 prop，并防止错误的集合值导致扩展页面空白。
- **需要时可灵活跳出** — 声明式默认配置覆盖常见路径；渲染回调 (render callbacks) 覆盖最后的一公里。

## 组件预览

| DataTable | FormBuilder |
| --- | --- |
| [![DataTable with search, filters, sorting, totals, and pagination](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/datatable/assets/showcase-table.jpg)](./src/datatable/README.md) | [![Read-only FormBuilder with one explicitly editable field](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/form/assets/showcase-form.jpg)](./src/form/README.md) |
| **Kanban** | **Feed** |
| [![Stage-based Kanban board](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/kanban/assets/showcase-kanban.jpg)](./src/kanban/README.md) | [![Searchable CRM activity Feed](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/feed/assets/showcase-feed.jpg)](./src/feed/README.md) |
| **Calendar** | **FilterBuilder** |
| [![Month Calendar with CRM events](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/calendar/assets/showcase-calendar.jpg)](./src/calendar/README.md) | [![Nested AND OR FilterBuilder](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/filter/assets/showcase-filter-builder.jpg)](./src/filter/README.md) |
| **Wizard + checklist** | **Common components** |
| [![Multi-step Wizard and onboarding checklist](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/wizard/assets/showcase-wizard-checklist.jpg)](./src/wizard/README.md) | [![A deal summary composed from common components](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/common-components/assets/showcase-overview.jpg)](./src/common-components/README.md) |

## 安装

```bash
npm install hs-uix
```

`react >= 18` 和 `@hubspot/ui-extensions >= 0.14` 是同级依赖 (peer dependencies)，通常在 HubSpot UI Extensions 项目中已经存在。

## 60 秒快速上手

```jsx
import React from "react";
import { hubspot, StatusTag } from "@hubspot/ui-extensions";
import { DataTable } from "hs-uix/datatable";
import { formatCurrency } from "hs-uix/utils";

const columns = [
  { field: "company", label: "Company", sortable: true },
  { field: "owner", label: "Owner", sortable: true },
  {
    field: "stage",
    label: "Stage",
    sortable: true,
    renderCell: (value) => <StatusTag>{value}</StatusTag>,
  },
  {
    field: "amount",
    label: "Amount",
    sortable: true,
    align: "right",
    renderCell: (value) => formatCurrency(value),
  },
];

const rows = [
  {
    id: "1",
    company: "Acme Corp",
    owner: "Sam Patel",
    stage: "Qualified",
    amount: 125000,
  },
];

hubspot.extend(() => (
  <DataTable
    data={rows}
    columns={columns}
    searchFields={["company", "owner", "stage"]}
    pageSize={5}
    showRowCount
  />
));
```

## 选择合适的界面组件

| 界面 (Surface) | 适用场景… | 导入路径 |
| --- | --- | --- |
| [DataTable](./src/datatable/README.md) | 用户需要浏览、比较、过滤、编辑或批量选择记录时。 | `hs-uix/datatable` |
| [FormBuilder](./src/form/README.md) | 表单 Schema 应该掌控布局、校验、依赖关系、步骤和提交时。 | `hs-uix/form` |
| [Kanban](./src/kanban/README.md) | 阶段 (Stage) 和流转比密集的数据比较更重要时。 | `hs-uix/kanban` |
| [Feed](./src/feed/README.md) | 时间线和叙述至关重要：如活动、审计日志、备注和事件。 | `hs-uix/feed` |
| [Calendar](./src/calendar/README.md) | 记录属于月、周、日、议程或资源时间表时。 | `hs-uix/calendar` |
| [FilterBuilder](./src/filter/README.md) | 用户需要嵌套的 CRM 风格 `AND` / `OR` 条件时。 | `hs-uix/filter` |
| [Wizard](./src/wizard/README.md) | 多步流程包含任意 UI，而不仅仅是表单字段时。 | `hs-uix/experimental` |
| [Common components](./src/common-components/README.md) | 需要原生的摘要、记录选择器、标签、图标、过滤器和显示辅助工具时。 | `hs-uix/common-components` |
| [Safe wrappers](./src/safe/README.md) | 运行时数据或生成的配置可能包含无效 prop 时。 | `hs-uix/safe` |
| [Utilities](./src/utils/README.md) | 需要格式化、选项、查询助手、视图适配器或 CRM 搜索绑定时。 | `hs-uix/utils` |

## 按需导入

```jsx
import { DataTable } from "hs-uix/datatable";
import { FormBuilder } from "hs-uix/form";
import { Kanban } from "hs-uix/kanban";
import { Feed } from "hs-uix/feed";
import { Calendar } from "hs-uix/calendar";
import { FilterBuilder } from "hs-uix/filter";

import {
  AutoStatusTag,
  AvatarStack,
  CollectionToolbar,
  CrmRecordPicker,
  DateRangePicker,
  Icon,
  KeyValueList,
  SectionHeader,
} from "hs-uix/common-components";

import {
  CrmDataTable,
  CrmKanban,
  deriveCardFieldsFromColumns,
  formatCurrency,
  formatDate,
} from "hs-uix/utils";

import {
  SafeDataTable,
  SafeEmptyState,
  SafeIcon,
} from "hs-uix/safe";
```

同样可以使用根导出 (root barrel)：

```jsx
import {
  Calendar,
  DataTable,
  Feed,
  FilterBuilder,
  FormBuilder,
  Kanban,
} from "hs-uix";
```

## 一套集合模型，多种视图

DataTable 和 Kanban 刻意共享了一套词汇表。您可以将表格的列投射为卡片字段，让用户在不重建数据层的情况下切换视图：

```jsx
import { DataTable } from "hs-uix/datatable";
import { Kanban } from "hs-uix/kanban";
import { deriveCardFieldsFromColumns } from "hs-uix/utils";

const cardFields = deriveCardFieldsFromColumns(columns);

return view === "table" ? (
  <DataTable data={deals} columns={columns} />
) : (
  <Kanban
    data={deals}
    stages={stages}
    groupBy="stage"
    cardFields={cardFields}
  />
);
```

## 包含内容

- 搜索、模糊搜索、过滤器、激活过滤器标签 (chips)、排序、计数和分页
- 针对单元格、卡片、信息流项、事件详情和表单字段的声明式及自定义渲染器
- 适用于服务端和客户端数据流的受控 (controlled) 与非受控 (uncontrolled) API
- 具备 CRM 感知的适配器，且不使视觉组件受限于 CRM
- 加载中、空状态、错误、校验、选择和批量操作状态
- 为每个公共子路径编写的类型声明
- ESM 和 CommonJS 构建版本

## 正视平台限制

hs-uix 在 UI Extensions 运行时中工作，而不是假装自己在浏览器 DOM 中：

- 列宽使用 HubSpot 支持的 `"min"`、`"max"` 和 `"auto"` 值。
- Kanban 阶段变更使用原生控件，因为 UI Extensions 不提供拖拽 (drag-and-drop) 功能。
- 日历重新调度会发出建议日期，由您的应用程序进行持久化。
- 输入控件不继承父级布局原语的文本对齐方式。
- 组件绝不依赖自定义 CSS。

每个组件指南都记录了其剩余的平台特定限制和逃生口 (escape hatches)。

## 从旧的 scope 包迁移

旧的 `@hs-uix/datatable` 和 `@hs-uix/form` 包已弃用。请安装根包并更改导入方式：

```diff
- import { DataTable } from "@hs-uix/datatable";
- import { FormBuilder } from "@hs-uix/form";
+ import { DataTable } from "hs-uix/datatable";
+ import { FormBuilder } from "hs-uix/form";
```

FormBuilder 中被弃用的 `allValues` prop 已由 `values` 取代。

## 开发

```bash
npm install
npm test
npm run build
```

源代码为 JavaScript/JSX，使用 tsup 进行打包，公共类型通过 `.d.ts` 声明维护。

## 许可证

[MIT](./LICENSE)
