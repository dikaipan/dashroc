# Styling Guide - Reusable Style System

Sistem styling yang reusable untuk konsistensi UI di seluruh aplikasi.

## 📁 File Structure

```
constants/
  └── styles.js          # Semua style constants dan utility functions

components/common/
  ├── Modal.jsx         # Reusable modal component
  ├── Button.jsx        # Reusable button component
  ├── Input.jsx         # Reusable input component
  ├── Card.jsx          # Reusable card component
  └── Badge.jsx         # Reusable badge component
```

## 🎨 Style Constants

### Import
```javascript
import { 
  MODAL_STYLES, 
  BUTTON_STYLES, 
  INPUT_STYLES, 
  CARD_STYLES, 
  BADGE_STYLES,
  TEXT_STYLES,
  TABLE_STYLES,
  LAYOUT_STYLES,
  GRADIENT_COLORS,
  getGradientClasses,
  cn,
  conditionalClasses
} from '../constants/styles';
```

## 📦 Components

### Modal Component
```javascript
import { Modal } from '../components/common';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  subtitle="Modal subtitle"
  size="medium" // 'small', 'medium', 'large', 'fullscreen'
  footer={
    <>
      <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </>
  }
>
  {/* Modal content */}
</Modal>
```

### Button Component
```javascript
import { Button } from '../components/common';

<Button variant="primary" size="medium" onClick={handleClick}>
  Click Me
</Button>

// With icon
<Button variant="primary" icon={Plus} iconPosition="left">
  Add New
</Button>

// Variants: 'primary', 'secondary', 'danger', 'success', 'warning', 'ghost', 'icon', 'link'
// Sizes: 'small', 'medium', 'large'
```

### Input Component
```javascript
import { Input } from '../components/common';

<Input
  label="Part Number"
  value={formData.part_number}
  onChange={(e) => setFormData({...formData, part_number: e.target.value})}
  placeholder="Enter part number"
  required
  size="medium" // 'small', 'medium'
/>

<Input
  label="Stock"
  type="number"
  value={formData.stock}
  onChange={(e) => setFormData({...formData, stock: e.target.value})}
  disabled
  helperText="This field is auto-filled"
/>
```

### Card Component
```javascript
import { Card } from '../components/common';

// Base card
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Gradient card
<Card variant="gradient" gradientColor="blue">
  <h3>Gradient Card</h3>
  <p>With blue gradient</p>
</Card>

// Hover card
<Card variant="hover" onClick={handleClick}>
  <h3>Clickable Card</h3>
</Card>

// Variants: 'base', 'baseSmall', 'hover', 'gradient'
// Gradient colors: 'blue', 'purple', 'green', 'red', 'orange', 'yellow', 'indigo', 'cyan'
```

### Badge Component
```javascript
import { Badge } from '../components/common';

<Badge variant="purple">Top 20</Badge>
<Badge variant="green">Active</Badge>
<Badge variant="red">Critical</Badge>

// Variants: 'purple', 'green', 'blue', 'red', 'yellow', 'orange', 'gray', 'cyan'
```

## 🎯 Direct Style Usage

### Using Style Constants
```javascript
import { MODAL_STYLES, BUTTON_STYLES, INPUT_STYLES } from '../constants/styles';

// Modal
<div className={MODAL_STYLES.container}>
  <div className={MODAL_STYLES.content}>
    <div className={MODAL_STYLES.header}>
      <h2 className={MODAL_STYLES.headerTitle}>Title</h2>
    </div>
    <div className={MODAL_STYLES.body}>
      {/* Content */}
    </div>
  </div>
</div>

// Button
<button className={BUTTON_STYLES.primary}>Click Me</button>

// Input
<input className={INPUT_STYLES.base} />
```

### Using Utility Functions
```javascript
import { cn, getGradientClasses, conditionalClasses } from '../constants/styles';

// Combine classes
<div className={cn('base-class', condition && 'conditional-class', className)} />

// Get gradient classes
<div className={getGradientClasses('blue')} />

// Conditional classes
<div className={conditionalClasses({
  [isActive]: 'active-class',
  [isDisabled]: 'disabled-class',
})} />
```

## 📋 Common Patterns

### Modal Pattern
```javascript
import { Modal, Button } from '../components/common';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Edit Part"
  size="medium"
  footer={
    <>
      <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </>
  }
>
  <Input label="Part Number" value={partNumber} onChange={handleChange} />
</Modal>
```

### Card Grid Pattern
```javascript
import { Card } from '../components/common';
import { LAYOUT_STYLES } from '../constants/styles';

<div className={LAYOUT_STYLES.grid}>
  {items.map(item => (
    <Card key={item.id} variant="hover" onClick={() => handleClick(item)}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </Card>
  ))}
</div>
```

### Form Pattern
```javascript
import { Input, Button } from '../components/common';

<form>
  <Input label="Name" value={name} onChange={setName} required />
  <Input label="Email" type="email" value={email} onChange={setEmail} />
  <div className="flex gap-3 justify-end">
    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
  </div>
</form>
```

## 🔄 Migration Guide

### Before (Old Way)
```javascript
<div className="bg-slate-900 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-700">
  <div className="flex justify-between items-center p-6 border-b border-slate-700">
    <h2 className="text-2xl font-bold text-white">Title</h2>
    <button className="text-slate-400 hover:text-white transition-colors">
      <X size={24} />
    </button>
  </div>
</div>
```

### After (New Way)
```javascript
import { Modal } from '../components/common';

<Modal
  isOpen={true}
  onClose={handleClose}
  title="Title"
  size="medium"
>
  {/* Content */}
</Modal>
```

## ✅ Benefits

1. **Konsistensi**: Semua styling menggunakan constants yang sama
2. **Reusability**: Komponen dapat digunakan ulang tanpa duplikasi
3. **Maintainability**: Perubahan styling hanya perlu dilakukan di satu tempat
4. **Type Safety**: Semua style constants terpusat dan mudah diubah
5. **Cleaner Code**: Kode lebih bersih dan mudah dibaca

## 📝 Notes

- Gunakan komponen (`Modal`, `Button`, dll) jika memungkinkan
- Gunakan style constants jika perlu custom styling
- Gunakan utility functions (`cn`, `getGradientClasses`) untuk kombinasi class
- Selalu import dari `constants/styles.js` untuk konsistensi

