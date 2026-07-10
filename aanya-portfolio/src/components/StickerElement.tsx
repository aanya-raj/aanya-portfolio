import { cn } from '@/lib/utils';

interface StickerElementProps {
  children: React.ReactNode;
  rotation?: number;
  className?: string;
  variant?: 'shadow' | 'tape' | 'pin';
}

export function StickerElement({
  children,
  rotation = 0,
  className = '',
  variant = 'shadow',
}: StickerElementProps) {
  const variantStyles = {
    shadow: 'drop-shadow-[2px_3px_4px_rgba(0,0,0,0.2)]',
    tape: `before:content-[""] before:absolute before:-top-2 before:left-1/2
      before:-translate-x-1/2 before:w-8 before:h-3 before:bg-sparkle/40
      before:rounded-sm before:rotate-[-2deg]`,
    pin: `before:content-["📌"] before:absolute before:-top-3 before:left-1/2
      before:-translate-x-1/2 before:text-sm`,
  };

  return (
    <div
      className={cn(
        'relative inline-block select-none',
        variantStyles[variant],
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children}
    </div>
  );
}
