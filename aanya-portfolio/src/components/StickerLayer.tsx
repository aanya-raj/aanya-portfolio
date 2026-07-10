import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import { useAdmin, type PlacedSticker } from '@/lib/admin-context';
import { useLocation } from 'react-router-dom';

export function StickerLayer() {
  const { state, isEditMode, updateSticker, removeSticker } = useAdmin();
  const location = useLocation();

  // Determine current page
  const currentPage = location.pathname === '/'
    ? 'home'
    : location.pathname.replace('/', '').split('/')[0] || 'home';

  const visibleStickers = state.stickers.filter(
    (s) => s.page === 'all' || s.page === currentPage
  );

  if (visibleStickers.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[50]">
      {visibleStickers.map((sticker) => (
        <StickerItem
          key={sticker.sticker_id}
          sticker={sticker}
          isEditMode={isEditMode}
          onUpdate={updateSticker}
          onRemove={removeSticker}
        />
      ))}
    </div>
  );
}

interface StickerItemProps {
  sticker: PlacedSticker;
  isEditMode: boolean;
  onUpdate: (id: string, updates: Partial<PlacedSticker>) => void;
  onRemove: (id: string) => void;
}

function StickerItem({ sticker, isEditMode, onUpdate, onRemove }: StickerItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = useCallback((_: any, info: any) => {
    setIsDragging(false);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Convert current pixel position to percentage
    const currentX = (sticker.x / 100) * vw + info.offset.x;
    const currentY = (sticker.y / 100) * vh + info.offset.y;
    const newX = Math.max(0, Math.min(100, (currentX / vw) * 100));
    const newY = Math.max(0, Math.min(100, (currentY / vh) * 100));
    onUpdate(sticker.sticker_id, { x: newX, y: newY });
  }, [sticker, onUpdate]);

  const handleRotate = () => {
    onUpdate(sticker.sticker_id, { rotation: sticker.rotation + 15 });
  };

  const handleScaleUp = () => {
    onUpdate(sticker.sticker_id, { scale: Math.min(sticker.scale + 0.2, 3) });
  };

  const handleScaleDown = () => {
    onUpdate(sticker.sticker_id, { scale: Math.max(sticker.scale - 0.2, 0.3) });
  };

  return (
    <motion.div
      ref={containerRef}
      drag={isEditMode}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      className={`absolute ${isEditMode ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : ''}`}
      style={{
        left: `${sticker.x}%`,
        top: `${sticker.y}%`,
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
        zIndex: sticker.zIndex,
      }}
      whileHover={isEditMode ? { scale: sticker.scale * 1.05 } : {}}
    >
      {/* The sticker content */}
      <div className="relative group">
        {sticker.type === 'emoji' ? (
          <span className="text-4xl select-none drop-shadow-[2px_3px_4px_rgba(0,0,0,0.2)]">
            {sticker.src}
          </span>
        ) : (
          <img
            src={sticker.src}
            alt="sticker"
            className="w-16 h-16 object-contain drop-shadow-[2px_3px_4px_rgba(0,0,0,0.2)]"
            draggable={false}
          />
        )}

        {/* Edit controls - only in edit mode */}
        {isEditMode && !isDragging && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2
            flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity
            bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-1.5 py-1 shadow-card">
            <button
              onClick={handleRotate}
              className="p-1 hover:bg-electric/10 rounded text-[var(--text-muted)] hover:text-electric transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-3 h-3" />
            </button>
            <button
              onClick={handleScaleUp}
              className="p-1 hover:bg-electric/10 rounded text-[var(--text-muted)] hover:text-electric transition-colors"
              title="Bigger"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={handleScaleDown}
              className="p-1 hover:bg-electric/10 rounded text-[var(--text-muted)] hover:text-electric transition-colors"
              title="Smaller"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => onRemove(sticker.sticker_id)}
              className="p-1 hover:bg-pink-accent/10 rounded text-[var(--text-muted)] hover:text-pink-accent transition-colors"
              title="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
