import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Edit3, Eye, LogOut, Download, Upload, RotateCcw,
  Sticker, Image, SmilePlus, ChevronUp, ChevronDown,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';
import { useLocation, Link } from 'react-router-dom';

const EMOJI_PALETTE = ['✦', '⚡', '🔮', '💫', '🌙', '🧠', '🔥', '💜', '🎯', '📌', '🌊', '⚖️', '🚀', '💬', '🎨', '📚', '🚗', '👗', '🏆', '📄', '💡', '🌸', '⭐'];

export function AdminToolbar() {
  const {
    isAdmin, isEditMode, toggleEditMode, logout,
    addSticker, uploadStickerImage, exportAll, importAll, resetToDefaults,
  } = useAdmin();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');

  if (!isAdmin) return null;

  const currentPage = location.pathname === '/'
    ? 'home'
    : location.pathname.replace('/', '').split('/')[0] || 'home';

  const handleAddEmoji = (emoji: string) => {
    addSticker({
      src: emoji,
      type: 'emoji',
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50 + (Math.random() - 0.5) * 20,
      rotation: (Math.random() - 0.5) * 20,
      scale: 1,
      page: currentPage,
      zIndex: 50,
    });
    setShowEmojiPicker(false);
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const url = await uploadStickerImage(file);
      if (url) {
        addSticker({
          src: url,
          type: 'image',
          x: 50 + (Math.random() - 0.5) * 20,
          y: 50 + (Math.random() - 0.5) * 20,
          rotation: (Math.random() - 0.5) * 10,
          scale: 1,
          page: currentPage,
          zIndex: 50,
        });
      }
    };
    input.click();
  };

  const handleExport = async () => {
    const json = await exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-content-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (await importAll(importJson)) {
      setShowImport(false);
      setImportJson('');
      alert('Content imported successfully!');
    } else {
      alert('Invalid JSON. Please check the format.');
    }
  };

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setImportJson(reader.result as string);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
      {/* Main floating toolbar */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-20 right-4 z-[100] flex flex-col items-end gap-2"
      >
        {/* Toggle bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl
            bg-[var(--bg-elevated)] border border-[var(--border)] shadow-card
            text-sm font-medium text-[var(--text-secondary)]
            hover:border-electric/30 hover:text-electric transition-all"
        >
          <Settings className="w-4 h-4" />
          Admin
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="w-56 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]
                shadow-float overflow-hidden"
            >
              {/* Edit mode toggle */}
              <button
                onClick={toggleEditMode}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors
                  ${isEditMode
                    ? 'bg-electric/10 text-electric'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                  }`}
              >
                {isEditMode ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
              </button>

              <div className="border-t border-[var(--border)]" />

              {/* Sticker tools */}
              <div className="px-4 py-2">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Stickers
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                      bg-[var(--bg-elevated)] border border-[var(--border)]
                      text-xs text-[var(--text-secondary)] hover:border-electric/30 hover:text-electric transition-all"
                  >
                    <SmilePlus className="w-3.5 h-3.5" />
                    Emoji
                  </button>
                  <button
                    onClick={handleAddImage}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                      bg-[var(--bg-elevated)] border border-[var(--border)]
                      text-xs text-[var(--text-secondary)] hover:border-electric/30 hover:text-electric transition-all"
                  >
                    <Image className="w-3.5 h-3.5" />
                    Image
                  </button>
                </div>
              </div>

              <div className="border-t border-[var(--border)]" />

              {/* Content management */}
              <div className="px-4 py-2">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Content
                </p>
                <div className="space-y-1">
                  <Link
                    to="/admin"
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                      text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    Content Editor
                  </Link>
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                      text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Export JSON
                  </button>
                  <button
                    onClick={() => setShowImport(!showImport)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                      text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    Import JSON
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Reset all content to defaults? This cannot be undone.')) {
                        resetToDefaults();
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                      text-pink-accent hover:bg-pink-accent/5 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Defaults
                  </button>
                </div>
              </div>

              <div className="border-t border-[var(--border)]" />

              {/* Logout */}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm
                  text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-pink-accent transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emoji picker dropdown */}
        <AnimatePresence>
          {showEmojiPicker && isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-56 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]
                shadow-float p-3"
            >
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Pick an emoji sticker (placed on: {currentPage})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_PALETTE.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddEmoji(emoji)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center
                      hover:bg-electric/10 border border-transparent hover:border-electric/20
                      transition-all text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Import modal */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowImport(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg mx-4 rounded-2xl border border-[var(--border)]
                bg-[var(--bg-secondary)] p-6 shadow-float"
            >
              <h3 className="font-display text-lg text-[var(--text-primary)] mb-4">
                Import Content
              </h3>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleImportFile}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]
                    text-sm text-[var(--text-secondary)] hover:border-electric/30 transition-all"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Choose .json file
                </button>
              </div>

              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Or paste JSON here..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]
                  text-sm text-[var(--text-primary)] font-mono placeholder:text-[var(--text-muted)]
                  focus:outline-none focus:border-electric/50 resize-none"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowImport(false)}
                  className="px-4 py-2 rounded-xl text-sm text-[var(--text-muted)]
                    hover:text-[var(--text-primary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importJson.trim()}
                  className="px-4 py-2 rounded-xl bg-electric text-white text-sm font-medium
                    hover:bg-electric/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Import
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit mode indicator bar */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            exit={{ y: -40 }}
            className="fixed top-0 left-0 right-0 z-[99] h-8 bg-electric/10 border-b border-electric/20
              flex items-center justify-center"
          >
            <span className="text-xs font-mono text-electric">
              ✦ EDIT MODE — drag stickers to reposition · hover stickers for controls
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
