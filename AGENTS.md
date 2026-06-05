# AGENTS.md

## Project Context

This repository is for the AI health management project.

## Working Guidelines

- Prefer small, focused changes that match the existing project structure.
- Read relevant files before editing them.
- Do not overwrite user changes unless explicitly requested.
- Keep implementation details documented when they affect future maintenance.

## Figma Design Reference

Source: Figma file "Full Disease Course Management System" / follow-up home screen  
Figma node: `EQY5mkeIJi5ZIqwEvRRZ6u`, `7862:28050`

### Design System Library

- The file subscribes to `Ant Design Vue (4.2.3)`.
- When implementing web UI, prefer Ant Design Vue-compatible component behavior and spacing before introducing custom patterns.

### Color Tokens

Use these tokens as the primary implementation palette:

| Token | Value | Usage |
| --- | --- | --- |
| `colorPrimary` | `#3671FF` | C-end primary blue, active states, CTA text, icons |
| `colorPrimaryFirstLevel` | `#3671FFCC` | Strong primary overlay |
| `colorPrimaryLevelThree` | `#3671FF1A` | Primary border / light divider |
| `colorPrimaryLevelFour` | `#3671FF0D` | Primary pale background |
| `colorWarning` | `#F49529` | Warning numbers and units |
| `colorError` | `#FF4D4F` | Error state |
| `colorBgContainer` | `#FFFFFF` | Main card/container background |
| `colorBgCardView` | `#FFFFFF80` | Translucent card background |
| `colorBgButton` | `#FFFFFFCC` | Translucent button/capsule background |
| `colorBorder` | `#EEEEEE` | Neutral border |
| `colorCardViewBorder` | `#FFFFFF` | Card border |
| `colorText` | `#03102EE5` | Primary dark text |
| `colorTextSecondary` | `#03102EA8` | Secondary text |
| `colorTextTertiary` | `#03102E73` | Tertiary/helper text |
| `colorTextQuaternary` | `#03102E40` | Disabled/weak text |
| `colorTextLightSolid` | `#FFFFFF` | Text on primary/dark backgrounds |
| `colorText01` | `#122E84` | Blue-toned section title/body text |
| `colorText02` | `#122E8438` | Very weak blue-toned helper text |

Observed additional colors:

- `#F3F7FA` and `#A7C1FD`: page background gradient.
- `#DAE6FF`: decorative pattern fill.
- `#D9D9D9`: icon placeholder / neutral shape fill.
- `#ABACBD`: input placeholder text.
- `#434343`: dark neutral label.
- `#000000`, `#000000CC`: black text and high-emphasis text.

### Typography

- Primary font: `PingFang SC`.
- Decorative/brand font observed once: `Alimama ShuHeiTi Bold`.
- Use `letter-spacing: 0`.

Common text styles:

| Role | Font | Size | Color |
| --- | --- | --- | --- |
| Page title / major label | PingFang SC Semibold | `18px` | `#03102EE5` |
| Section heading | PingFang SC Semibold | `16px` | `#03102EE5` or `#122E84` |
| Card title | PingFang SC Semibold | `14px` to `15px` | `#03102EE5` |
| Body text | PingFang SC Regular | `13px` to `14px` | `#122E84` or `#03102E73` |
| Tab / feature label | PingFang SC Regular | `11px` | `#000000` |
| Helper text | PingFang SC Regular | `10px` to `12px` | `#03102E73` or `#122E8438` |
| Metric number | PingFang SC Semibold | `16px` | `#03102EE5` or `#F49529` |
| Button text | PingFang SC Medium | `14px` | `#3671FF` or `#FFFFFF` |

### Shape, Radius, and Elevation

Observed radii:

- `16px`: main health/family cards.
- `12px`: schedule cards and some panel containers.
- `10px`: dashed add-member button and send button.
- `8px`: sidebar/menu and smaller grouped items.
- `4px`: small tags and labels.
- `14px`: chat bubble with asymmetric rounded corners.

Observed shadows:

- Main translucent panel: `0 4px 14.7px rgba(10, 6, 130, 0.06)`.
- Floating image/object: `0 0 20.6px rgba(21, 36, 138, 0.17)`.
- Schedule card: `0 4px 17px rgba(199, 204, 219, 0.21)`.
- Family card: `0 3.713px 12.066px rgba(213, 225, 242, 0.31)`.
- Icon glow variants use blue shadows such as `rgba(73, 104, 215, ...)`, `rgba(96, 143, 255, 0.6)`.

### Page Layout Patterns

The referenced mobile screen is `375px` wide and uses a soft medical blue theme.

- Page background: light gradient from `#F3F7FA` to `#A7C1FD`, with pale decorative image/pattern layers.
- Header: iOS-style status bar and mini-program capsule controls.
- Brand/hospital row: left icon plus hospital name in `16px` medium blue text.
- Assistant hero area: robot image, greeting, search/input pill, and send icon button.
- Section headers: left blue accent line plus title with mixed dark/primary-blue text.
- Schedule list: repeated white cards, around `327x78`, radius `12px`, title, tag, author/date metadata, and right chevron.
- Feature shortcut row: translucent rounded container with five icon+label items, each about `48px` wide.
- Family archive card: white `351x201` cards, radius `16px`, subtle border/shadow, avatar, name, update time, insight strip, metrics row.
- Add member button: dashed border using primary blue at low opacity, pale primary background, icon plus blue label.
- Bottom tab bar: fixed bottom navigation with active primary blue icon/text and inactive gray items.

### Component Patterns to Reuse

- `StatusBar`: iOS status indicators at the top.
- `MiniProgramCapsule`: white translucent pill with more/divider/close icons.
- `AssistantSearch`: white input pill with placeholder text and primary gradient send button.
- `SectionTitle`: blue vertical marker, split-color title text, optional right action.
- `ScheduleCard`: white rounded card with title, person tag, metadata, and circular chevron.
- `ShortcutGrid`: row of icon shortcuts with `11px` labels.
- `HealthMemberCard`: avatar, patient name, update time, AI insight strip, metric columns.
- `MetricColumn`: value, unit, label; warning values use `#F49529`.
- `DashedAddButton`: full-width dashed border CTA.
- `BottomTabBar`: three-item mobile tab bar.

### Implementation Notes

- Prefer CSS variables matching the token names above.
- Keep cards visually light: white or translucent white backgrounds, subtle blue-tinted shadows, and low-opacity blue borders.
- Use primary blue for active state, CTA, links, chevrons, and emphasis in section titles.
- Avoid heavy dark blocks; this design relies on pale backgrounds, white cards, and blue accents.
- Preserve compact mobile spacing and dense information layout instead of making a marketing-style hero.

## Verification

- Run the most relevant local checks after code changes when a runnable project exists.
- If no test or build command is available, explain what was verified manually.
