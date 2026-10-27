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
 * with refined editorial colors matching the Tap & Toast luxury brand palette.
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
        wrapper: 'bg-[#fbf7f0] text-[#6b4c1e] border border-[#ecdcc3]',
        dot: 'bg-[#b8863b]',
      };
    }
    // Vegan
    if (lower.includes('vegan')) {
      return {
        wrapper: 'bg-[#f3f7f5] text-[#244b3c] border border-[#d2e4dc]',
        dot: 'bg-[#3f7360]',
      };
    }
    // Vegetarian
    if (lower.includes('veg') || lower.includes('vegetarian')) {
      return {
        wrapper: 'bg-[#f5f8f3] text-[#2c4731] border border-[#d8e4d3]',
        dot: 'bg-[#4d7054]',
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
        wrapper: 'bg-[#fcf4f3] text-[#732d27] border border-[#ecd3cf]',
        dot: 'bg-[#a64840]',
      };
    }
    // Halal / Kosher
    if (lower.includes('halal') || lower.includes('kosher')) {
      return {
        wrapper: 'bg-[#f4f6fa] text-[#2d4361] border border-[#d7dfeb]',
        dot: 'bg-[#4a6b94]',
      };
    }
    // Default luxury neutral badge
    return {
      wrapper: 'bg-[#faf7f2] text-[#524436] border border-[#e8ded0]',
      dot: 'bg-[#bd9661]',
    };
  };

  const padClass =
    size === 'xs'
      ? 'px-1.5 py-0.5 text-[9.5px]'
      : size === 'sm'
      ? 'px-2 py-0.5 text-[10.5px]'
      : 'px-2.5 py-1 text-[11px]';

  return (
    <div className={`flex flex-wrap gap-1.5 items-center ${className}`}>
      {items.map((item, idx) => {
        const style = getBadgeStyle(item);
        return (
          <span
            key={idx}
            className={`inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap select-none shadow-2xs ${padClass} ${style.wrapper}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
            <span className="whitespace-nowrap">{item}</span>
          </span>
        );
      })}
    </div>
  );
}
