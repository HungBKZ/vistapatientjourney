# Hướng Dẫn Custom Bento Grid

## 🎨 Bento Grid Layout Basics

Bento Grid sử dụng CSS Grid với khả năng span nhiều columns và rows.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 cột */
  gap: 1rem;                             /* Khoảng cách giữa các ô */
  auto-rows: 200px;                      /* Chiều cao mỗi hàng */
}
```

## 📐 Cách Span Grid Items

### 1. Chiều Rộng (Columns)

```jsx
// Chiếm 1 cột (25% width)
span={1}

// Chiếm 2 cột (50% width)
span={2}

// Chiếm 3 cột (75% width)
span={3}

// Chiếm 4 cột (100% width)
span={4}
```

### 2. Chiều Cao (Rows)

```jsx
// Chiếm 1 hàng (200px)
rowSpan={1}

// Chiếm 2 hàng (400px)
rowSpan={2}

// Chiếm 3 hàng (600px)
rowSpan={3}
```

## 🎯 Ví Dụ Layouts

### Layout 1: Asymmetric (Hiện tại)

```
┌─────────┬───┬───┐
│         │ 2 │ 3 │
│    1    ├───┼───┤
│         │ 4 │ 5 │
├─────────┴───┴───┤
│        6        │
└─────────────────┘
```

```jsx
const features = [
  { span: 2, rowSpan: 2 }, // 1: Lớn
  { span: 1, rowSpan: 1 }, // 2: Nhỏ
  { span: 1, rowSpan: 1 }, // 3: Nhỏ
  { span: 1, rowSpan: 1 }, // 4: Nhỏ
  { span: 1, rowSpan: 1 }, // 5: Nhỏ
  { span: 2, rowSpan: 1 }, // 6: Ngang
]
```

### Layout 2: Masonry Style

```
┌───┬───────────┬───┐
│ 1 │           │ 4 │
├───┤     2     ├───┤
│ 3 │           │ 5 │
├───┴───────────┴───┤
│         6         │
└───────────────────┘
```

```jsx
const features = [
  { span: 1, rowSpan: 1 }, // 1
  { span: 2, rowSpan: 2 }, // 2: Center focal
  { span: 1, rowSpan: 1 }, // 3
  { span: 1, rowSpan: 1 }, // 4
  { span: 1, rowSpan: 1 }, // 5
  { span: 4, rowSpan: 1 }, // 6: Full width
]
```

### Layout 3: Balanced

```
┌───────┬───────┐
│   1   │   2   │
├───────┼───────┤
│   3   │   4   │
├───────┴───────┤
│       5       │
└───────────────┘
```

```jsx
const features = [
  { span: 2, rowSpan: 1 }, // 1
  { span: 2, rowSpan: 1 }, // 2
  { span: 2, rowSpan: 1 }, // 3
  { span: 2, rowSpan: 1 }, // 4
  { span: 4, rowSpan: 1 }, // 5
]
```

## 🎪 Responsive Breakpoints

### Mobile (< 768px): 1 column

```jsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
```

Mọi card sẽ chiếm full width trên mobile.

### Tablet (768px - 1024px): 2-3 columns

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

### Desktop (> 1024px): 4 columns

Sử dụng full grid như designed.

## 🔥 Hover Effects

### 1. Scale Up (Hiện tại)

```jsx
whileHover={{ 
  scale: 1.02,
  zIndex: 10,
  boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.5)'
}}
```

### 2. Expand to Full Width

```jsx
whileHover={{ 
  gridColumn: '1 / -1', // Span toàn bộ chiều rộng
  scale: 1.05,
  zIndex: 50
}}
transition={{ duration: 0.3 }}
```

### 3. Tilt Effect

```jsx
whileHover={{ 
  rotateY: 5,
  rotateX: 5,
  scale: 1.05
}}
style={{ 
  perspective: '1000px',
  transformStyle: 'preserve-3d'
}}
```

### 4. Reveal Content

```jsx
const [isHovered, setIsHovered] = useState(false)

<BentoCard
  onHoverStart={() => setIsHovered(true)}
  onHoverEnd={() => setIsHovered(false)}
>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: isHovered ? 1 : 0 }}
  >
    {/* Hidden content */}
  </motion.div>
</BentoCard>
```

## 🎨 Background Patterns

### 1. Gradient Overlay

```jsx
<div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-transparent to-purple-500/20" />
```

### 2. Grid Pattern

```jsx
<div 
  className="absolute inset-0 opacity-10"
  style={{
    backgroundImage: `
      linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px'
  }}
/>
```

### 3. Dots Pattern

```jsx
<div 
  className="absolute inset-0 opacity-20"
  style={{
    backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
    backgroundSize: '16px 16px'
  }}
/>
```

## 📦 Complete Example

```jsx
const CustomBentoGrid = () => {
  const items = [
    {
      title: 'Main Feature',
      icon: '🚀',
      image: 'path/to/image.jpg',
      span: 2,
      rowSpan: 2,
      gradient: 'from-sky-500/20 to-blue-500/20'
    },
    {
      title: 'Feature 2',
      icon: '⚡',
      span: 1,
      rowSpan: 1,
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    // ... more items
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-slate-800/90 border border-white/10 p-6"
          style={{ 
            gridColumn: `span ${item.span}`,
            gridRow: `span ${item.rowSpan}`
          }}
          whileHover={{ 
            scale: 1.02,
            zIndex: 10,
            boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.5)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Background Image */}
          {item.image && (
            <div className="absolute inset-0 opacity-30">
              <img 
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {item.title}
              </h3>
            </div>
            
            {/* Bottom Glow */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
```

## 🎬 Animation Sequences

### Stagger Children

```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

<motion.div
  variants={container}
  initial="hidden"
  animate="show"
  className="grid ..."
>
  {items.map((item, i) => (
    <motion.div key={i} variants={item}>
      {/* content */}
    </motion.div>
  ))}
</motion.div>
```

## 💡 Pro Tips

1. **Maintain Aspect Ratios**: Sử dụng `auto-rows-[minmax(200px, auto)]` để tự động điều chỉnh
2. **Prevent Layout Shift**: Set explicit heights để tránh shift khi hover
3. **Performance**: Sử dụng `will-change: transform` cho animated elements
4. **Accessibility**: Đảm bảo keyboard navigation works
5. **Mobile First**: Design cho mobile trước, sau đó scale lên desktop

## 🔍 Debugging

### Xem Grid Lines

```jsx
<div className="grid ... relative">
  {/* Grid overlay for debugging */}
  <div className="absolute inset-0 grid grid-cols-4 gap-4 pointer-events-none">
    {[...Array(16)].map((_, i) => (
      <div key={i} className="border border-red-500/20" />
    ))}
  </div>
  
  {/* Your content */}
</div>
```

### Browser DevTools

1. Inspect element
2. Click "Grid" badge trong Elements panel
3. Xem grid overlay trên page
