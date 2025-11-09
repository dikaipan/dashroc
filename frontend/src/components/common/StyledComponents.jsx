/**
 * Styled Components - Reusable styled components
 * Pre-styled components for consistent UI
 */

import React from 'react';
import { X } from 'react-feather';
import { 
  CARD_STYLES, 
  BUTTON_STYLES, 
  BADGE_STYLES,
  TEXT_STYLES,
  INPUT_STYLES,
  TABLE_STYLES,
  MODAL_STYLES,
  getGradientCard,
  getColorMap,
  cn
} from '../../constants/styles';

/**
 * Styled Card Component
 */
export function Card({ 
  children, 
  variant = 'base', 
  color = null, 
  hover = false,
  className = '',
  ...props 
}) {
  const cardClass = color 
    ? getGradientCard(color, hover)
    : CARD_STYLES[variant] || CARD_STYLES.base;
  
  return (
    <div className={cn(cardClass, className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Styled Button Component
 */
export function Button({ 
  children, 
  variant = 'primary', 
  size = null,
  className = '',
  ...props 
}) {
  const buttonClass = BUTTON_STYLES[variant] || BUTTON_STYLES.primary;
  const sizeClass = size === 'small' 
    ? buttonClass.replace('px-6 py-2', 'px-3 py-1.5').replace('text-', 'text-xs ')
    : '';
  
  return (
    <button className={cn(buttonClass, sizeClass, className)} {...props}>
      {children}
    </button>
  );
}

/**
 * Styled Badge Component
 */
export function Badge({ 
  children, 
  color = 'gray',
  className = '',
  ...props 
}) {
  const badgeClass = BADGE_STYLES[color] || BADGE_STYLES.gray;
  
  return (
    <span className={cn(badgeClass, className)} {...props}>
      {children}
    </span>
  );
}

/**
 * Styled Text Component
 */
export function Text({ 
  children, 
  variant = 'body',
  className = '',
  as: Component = 'p',
  ...props 
}) {
  const textClass = TEXT_STYLES[variant] || TEXT_STYLES.body;
  
  return (
    <Component className={cn(textClass, className)} {...props}>
      {children}
    </Component>
  );
}

/**
 * Styled Heading Component
 */
export function Heading({ 
  children, 
  level = 1,
  className = '',
  ...props 
}) {
  const variants = {
    1: TEXT_STYLES.heading1,
    2: TEXT_STYLES.heading2,
    3: TEXT_STYLES.heading3,
    4: TEXT_STYLES.heading4,
  };
  const headingClass = variants[level] || variants[1];
  const Component = `h${level}`;
  
  return (
    <Component className={cn(headingClass, className)} {...props}>
      {children}
    </Component>
  );
}

/**
 * Styled KPI Card Component
 */
export function KPICard({ 
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  hover = true,
  className = '',
  ...props 
}) {
  const cardClass = getGradientCard(color, hover);
  
  return (
    <div className={cn(cardClass, 'min-h-[200px] flex flex-col', className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          {title && <p className={TEXT_STYLES.kpiTitle}>{title}</p>}
          {value && <h3 className={TEXT_STYLES.kpiValue}>{value}</h3>}
          {subtitle && <p className={TEXT_STYLES.kpiSubtitle}>{subtitle}</p>}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  );
}

/**
 * Styled Input Component
 */
export function Input({ 
  variant = 'base',
  className = '',
  ...props 
}) {
  const inputClass = INPUT_STYLES[variant] || INPUT_STYLES.base;
  
  return (
    <input className={cn(inputClass, className)} {...props} />
  );
}

/**
 * Styled Select Component
 */
export function Select({ 
  variant = 'base',
  className = '',
  ...props 
}) {
  const selectClass = INPUT_STYLES[variant === 'base' ? 'select' : 'selectSmall'] || INPUT_STYLES.select;
  
  return (
    <select className={cn(selectClass, className)} {...props} />
  );
}

/**
 * Styled Table Component
 */
export function Table({ 
  children,
  className = '',
  ...props 
}) {
  return (
    <div className={cn(TABLE_STYLES.container, className)} {...props}>
      <table className={TABLE_STYLES.table}>
        {children}
      </table>
    </div>
  );
}

/**
 * Styled Table Header Component
 */
export function TableHeader({ 
  children,
  className = '',
  ...props 
}) {
  return (
    <thead className={cn(TABLE_STYLES.thead, className)} {...props}>
      {children}
    </thead>
  );
}

/**
 * Styled Table Body Component
 */
export function TableBody({ 
  children,
  className = '',
  ...props 
}) {
  return (
    <tbody className={cn(TABLE_STYLES.tbody, className)} {...props}>
      {children}
    </tbody>
  );
}

/**
 * Styled Table Row Component
 */
export function TableRow({ 
  children,
  className = '',
  ...props 
}) {
  return (
    <tr className={cn(TABLE_STYLES.tr, className)} {...props}>
      {children}
    </tr>
  );
}

/**
 * Styled Table Cell Component
 */
export function TableCell({ 
  children,
  center = false,
  className = '',
  ...props 
}) {
  const cellClass = center ? TABLE_STYLES.thCenter : TABLE_STYLES.td;
  
  return (
    <td className={cn(cellClass, className)} {...props}>
      {children}
    </td>
  );
}

/**
 * Styled Table Header Cell Component
 */
export function TableHeaderCell({ 
  children,
  center = false,
  className = '',
  ...props 
}) {
  const headerClass = center ? TABLE_STYLES.thCenter : TABLE_STYLES.th;
  
  return (
    <th className={cn(headerClass, className)} {...props}>
      {children}
    </th>
  );
}

/**
 * Styled Modal Component
 */
export function Modal({ 
  isOpen,
  onClose,
  size = 'medium',
  children,
  className = '',
  ...props 
}) {
  if (!isOpen) return null;
  
  const sizeClasses = {
    small: MODAL_STYLES.contentSmall,
    medium: MODAL_STYLES.contentMedium,
    large: MODAL_STYLES.contentLarge,
    fullscreen: MODAL_STYLES.contentFullscreen,
  };
  
  return (
    <div className={MODAL_STYLES.container} onClick={onClose} {...props}>
      <div className={cn(sizeClasses[size] || sizeClasses.medium, className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/**
 * Styled Modal Header Component
 */
export function ModalHeader({ 
  title,
  subtitle,
  onClose,
  className = '',
  ...props 
}) {
  return (
    <div className={cn(MODAL_STYLES.header, className)} {...props}>
      <div>
        {title && <h2 className={MODAL_STYLES.headerTitle}>{title}</h2>}
        {subtitle && <p className={MODAL_STYLES.headerSubtitle}>{subtitle}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className={BUTTON_STYLES.close}>
          <X size={24} />
        </button>
      )}
    </div>
  );
}

/**
 * Styled Modal Body Component
 */
export function ModalBody({ 
  children,
  noPadding = false,
  className = '',
  ...props 
}) {
  const bodyClass = noPadding ? MODAL_STYLES.bodyNoPadding : MODAL_STYLES.body;
  
  return (
    <div className={cn(bodyClass, className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Styled Modal Footer Component
 */
export function ModalFooter({ 
  children,
  between = false,
  className = '',
  ...props 
}) {
  const footerClass = between ? MODAL_STYLES.footerBetween : MODAL_STYLES.footer;
  
  return (
    <div className={cn(footerClass, className)} {...props}>
      {children}
    </div>
  );
}

