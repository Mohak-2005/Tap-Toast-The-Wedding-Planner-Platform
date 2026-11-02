import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''                {/* Redo */}
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`p-1 rounded transition-colors ${
                    historyIndex < history.length - 1 ? 'text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] cursor-pointer' : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 7v6h-6" />
                    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
                  </svg>
                </button>
              </div>'''

replacement = target + '''

              {/* Canvas Status Indicator */}
              <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#15110e]/80 border border-[#3d3024] text-[11px] text-[#8b7b6b]">
                <span className="text-[#bd9661]">✦</span>
                <span>Equal Dual-Card Whiteboard Studio</span>
              </div>
            </div>'''

if target not in content:
    print("Target not found!")
    sys.exit(1)

content = content.replace(target, replacement, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added missing </div> for canvas container.")
