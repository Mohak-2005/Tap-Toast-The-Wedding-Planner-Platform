import React from 'react';

/**
 * Splits a dietary string (e.g. "1x Vegetarian, 1x Gluten-Free" or "Vegetarian, Nut allergy")
 * into trimmed, non-empty requirement tokens.
 */
export function parseDietaryRequirements(dietaryStr: string | undefined | null): string[] {
  if (!dietaryStr) return [];
  const trimmed = dietaryStr.trim();
  if (
    !trimmed ||
    trimmed.toLowerCase() === 'none' ||
    trimmed.toLowerCase() === 'no' ||
    trimmed.toLowerCase() === 'standard' ||
    trimmed === '-'
  ) {
    return [];
  }

  // Split by comma or semicolon
  return trimmed
    .split(/[,;]/)
    .map(item => item.trim())
    .filter(item => {
      const lower = item.toLowerCase();
      return item.length > 0 && lower !== 'none' && lower !== 'no' && lower !== 'standard' && lower !== '-';
    });
}

interface DietaryBadgesProps {
  dietary?: string | null;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  showNone?: boolean;
}

/**
 * Renders dietary requirements as discrete, styled, non-wrapping badge pills
 * with distinct color accents for each diet category.
 */
export function DietaryBadges({
  dietary,
  size = 'md',
  className = '',
  showNone = true,
}: DietaryBadgesProps) {
  const items = parseDietaryRequirements(dietary);

  if (items.length === 0) {
    if (!showNone) return null;
    return <span className="text-[#a09181] text-xs font-normal">None</span>;
  }

  const getBadgeStyle = (item: string) => {
    const lower = item.toLowerCase();
    // Gluten-Free / Celiac
    if (lower.includes('gluten') || lower.includes('celiac') || lower.includes('gf')) {
      return {
        wrapper: 'bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs',
        dot: 'bg-amber-500',
      };
    }
    // Vegan
    if (lower.includes('vegan')) {
      return {
        wrapper: 'bg-teal-50 text-teal-800 border border-teal-200/90 shadow-2xs',
        dot: 'bg-teal-500',
      };
    }
    // Vegetarian
    if (lower.includes('veg') || lower.includes('vegetarian')) {
      return {
        wrapper: 'bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs',
        dot: 'bg-emerald-500',
      };
    }
    // Allergies (Nut, Peanut, Shellfish, Dairy, Egg)
    if (
      lower.includes('nut') ||
      lower.includes('peanut') ||
      lower.includes('allergy') ||
      lower.includes('dairy') ||
      lower.includes('shellfish') ||
      lower.includes('egg')
    ) {
      return {
        wrapper: 'bg-rose-50 text-rose-800 border border-rose-200/90 shadow-2xs',
        dot: 'bg-rose-500',
      };
    }
    // Halal / Kosher
    if (lower.includes('halal') || lower.includes('kosher')) {
      return {
        wrapper: 'bg-sky-50 text-sky-800 border border-sky-200/90 shadow-2xs',
        dot: 'bg-sky-500',
      };
    }
    // Default luxury badge
    return {
      wrapper: 'bg-[#faf6f0] text-[#7d5f30] border border-[#ebd8b6] shadow-2xs',
      dot: 'bg-[#bd9661]',
    };
  };

  const padClass =
    size === 'xs'
      ? 'px-1.5 py-0.5 text-[9.5px]'
      : size === 'sm'
      ? 'px-2 py-0.5 text-[10px]'
      : 'px-2.5 py-0.5 text-[11px]';

  return (
    <div className={`flex flex-wrap gap-1.5 items-center ${className}`}>
      {items.map((item, idx) => {
        const style = getBadgeStyle(item);
        return (
          <span
            key={idx}
            className={`inline-flex items-center gap-1.5 rounded-md font-semibold whitespace-nowrap transition-colors select-none ${padClass} ${style.wrapper}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
            <span className="whitespace-nowrap">{item}</span>
          </span>
        );
      })}
    </div>
  );
}
