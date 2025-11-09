# Style System Guide - Sistem Styling Terpusat

Sistem styling yang terorganisir dan reusable untuk konsistensi UI di seluruh aplikasi.

## 📁 Struktur File

```
constants/
  └── styles.js          # Semua style constants dan utility functions

utils/
  └── styleUtils.js      # Helper functions untuk styling

components/common/
  └── StyledComponents.jsx # Pre-styled reusable components
```

## 🎨 Style Constants

### Import Style Constants

```javascript
import { 
  CARD_STYLES, 
  BUTTON_STYLES, 
  BADGE_STYLES,
  TEXT_STYLES,
  MODAL_STYLES,
  INPUT_STYLES,
  TABLE_STYLES,
  LAYOUT_STYLES,
  GRADIENT_COLORS,
  getGradientCard,
  getColorMap,
  cn,
  getStockAlertBadge,
  getStockAlertText
} from '../constants/styles';
```

## 📦 Penggunaan

### 1. Card Styles

```javascript
import { CARD_STYLES, getGradientCard } from '../constants/styles';

// Basic card
<div className={CARD_STYLES.base}>
  Content
</div>

// Gradient card
<div className={getGradientCard('blue', true)}>
  Content with hover
</div>

// KPI card
<div className={CARD_STYLES.kpi}>
  KPI Content
</div>
```

### 2. Button Styles

```javascript
import { BUTTON_STYLES } from '../constants/styles';

<button className={BUTTON_STYLES.primary}>Primary</button>
<button className={BUTTON_STYLES.secondary}>Secondary</button>
<button className={BUTTON_STYLES.danger}>Danger</button>
<button className={BUTTON_STYLES.iconSmall}>Icon</button>
```

### 3. Badge Styles

```javascript
import { BADGE_STYLES, getStockAlertBadge } from '../constants/styles';

<span className={BADGE_STYLES.blue}>Badge</span>
<span className={getStockAlertBadge(stock)}>Stock Alert</span>
```

### 4. Text Styles

```javascript
import { TEXT_STYLES } from '../constants/styles';

<h1 className={TEXT_STYLES.heading1}>Heading 1</h1>
<p className={TEXT_STYLES.body}>Body text</p>
<p className={TEXT_STYLES.muted}>Muted text</p>
```

### 5. Modal Styles

```javascript
import { MODAL_STYLES } from '../constants/styles';

<div className={MODAL_STYLES.container}>
  <div className={MODAL_STYLES.contentLarge}>
    <div className={MODAL_STYLES.header}>
      <h2 className={MODAL_STYLES.headerTitleLarge}>Title</h2>
    </div>
    <div className={MODAL_STYLES.body}>
      Content
    </div>
    <div className={MODAL_STYLES.footer}>
      Footer
    </div>
  </div>
</div>
```

### 6. Input Styles

```javascript
import { INPUT_STYLES } from '../constants/styles';

<input className={INPUT_STYLES.base} />
<input className={INPUT_STYLES.search} />
<select className={INPUT_STYLES.select} />
```

### 7. Table Styles

```javascript
import { TABLE_STYLES } from '../constants/styles';

<table className={TABLE_STYLES.table}>
  <thead className={TABLE_STYLES.thead}>
    <tr>
      <th className={TABLE_STYLES.th}>Header</th>
    </tr>
  </thead>
  <tbody className={TABLE_STYLES.tbody}>
    <tr className={TABLE_STYLES.tr}>
      <td className={TABLE_STYLES.td}>Data</td>
    </tr>
  </tbody>
</table>
```

### 8. Layout Styles

```javascript
import { LAYOUT_STYLES } from '../constants/styles';

<div className={LAYOUT_STYLES.page}>
  <div className={LAYOUT_STYLES.grid}>
    Cards
  </div>
</div>
```

## 🎨 Utility Functions

### Combine Classes

```javascript
import { cn } from '../constants/styles';

<div className={cn(CARD_STYLES.base, 'custom-class', condition && 'conditional-class')}>
  Content
</div>
```

### Get Gradient Card

```javascript
import { getGradientCard } from '../constants/styles';

// With hover
<div className={getGradientCard('blue', true)}>Content</div>

// Without hover
<div className={getGradientCard('purple', false)}>Content</div>
```

### Get Color Map

```javascript
import { getColorMap } from '../constants/styles';

const colors = getColorMap('blue');
// Returns: { bg, border, text, hover, shadow }

<div className={`bg-gradient-to-br ${colors.bg} ${colors.border}`}>
  Content
</div>
```

### Stock Alert Badges

```javascript
import { getStockAlertBadge, getStockAlertText } from '../constants/styles';

<span className={getStockAlertBadge(stock)}>Stock: {stock}</span>
<span className={getStockAlertText(stock)}>{stock}</span>
```

## 🧩 Styled Components

### Pre-styled Components

```javascript
import { Card, Button, Badge, Text, Heading, KPICard } from '../components/common/StyledComponents';

<Card variant="base" color="blue" hover>
  <Heading level={2}>Title</Heading>
  <Text variant="body">Content</Text>
  <Button variant="primary">Click</Button>
</Card>

<KPICard
  title="Total Machines"
  value={1000}
  subtitle="All regions"
  icon="🖥️"
  color="blue"
/>
```

## 🎯 Best Practices

1. **Selalu gunakan style constants** daripada hardcode className
2. **Gunakan utility functions** untuk kombinasi styles
3. **Gunakan cn()** untuk menggabungkan multiple classes
4. **Gunakan StyledComponents** untuk komponen yang sering digunakan
5. **Konsisten dengan color system** - gunakan GRADIENT_COLORS
6. **Jangan duplikasi styles** - gunakan dari constants/styles.js

## 📝 Contoh Refactoring

### Sebelum (Hardcoded)
```javascript
<div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30 hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-300">
  Content
</div>
```

### Sesudah (Menggunakan Style System)
```javascript
import { getGradientCard } from '../constants/styles';

<div className={getGradientCard('blue', true)}>
  Content
</div>
```

## 🎨 Color System

### Available Colors
- `blue` - Primary actions, info
- `purple` - Special features, priority
- `green` - Success, positive metrics
- `red` - Error, critical alerts
- `orange` - Warning, urgent
- `yellow` - Caution, monitoring
- `indigo` - Secondary actions
- `cyan` - Accent, highlights

### Gradient Intensities
- Light: `from-{color}-500/10 to-{color}-600/5`
- Medium: `from-{color}-500/20 to-{color}-600/10` (default)
- Strong: `from-{color}-500/30 to-{color}-600/20`

## 📚 File Reference

- `constants/styles.js` - Semua style constants
- `utils/styleUtils.js` - Helper functions
- `components/common/StyledComponents.jsx` - Pre-styled components

