import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix setGridStyle
bad_grid_setter = """                  onClick={() => {
                    setGridStyle(gridStyle === 'dots'
                  ? 'bg-[#fbf8f2] [background-image:radial-gradient(#cbbda8_1.2px,transparent_1.2px)] [background-size:24px_24px]'
                  : gridStyle === 'lines'
                  ? 'bg-[#fbf8f2] [background-image:linear-gradient(to_right,#e4dbcd_1px,transparent_1px),linear-gradient(to_bottom,#e4dbcd_1px,transparent_1px)] [background-size:28px_28px]'
                  : 'bg-[#fbf8f2]');
                  }}"""

good_grid_setter = """                  onClick={() => {
                    setGridStyle(gridStyle === 'dots' ? 'lines' : gridStyle === 'lines' ? 'blank' : 'dots');
                  }}"""

if bad_grid_setter in content:
    content = content.replace(bad_grid_setter, good_grid_setter)
    print("Fixed setGridStyle call.")
else:
    print("Warning: bad_grid_setter not found")

# Now check the canvas container's className
canvas_marker = "{/* =============================================================== */}\n            <div\n              className={`flex-1 relative overflow-hidden flex items-center justify-center p-6"
idx = content.find(canvas_marker)
if idx != -1:
    end_bracket = content.find("`}\n              onClick={() => {", idx)
    actual_bg_expr = content[idx:end_bracket]
    print("Found canvas container className expression:")
    print(actual_bg_expr)
    
    clean_canvas_block = """{/* =============================================================== */}
            <div
              className={`flex-1 relative overflow-hidden flex items-center justify-center p-6 ${
                gridStyle === 'dots'
                  ? 'bg-[#fbf8f2] [background-image:radial-gradient(#cbbda8_1.2px,transparent_1.2px)] [background-size:24px_24px]'
                  : gridStyle === 'lines'
                  ? 'bg-[#fbf8f2] [background-image:linear-gradient(to_right,#e4dbcd_1px,transparent_1px),linear-gradient(to_bottom,#e4dbcd_1px,transparent_1px)] [background-size:28px_28px]'
                  : 'bg-[#fbf8f2]'
              }"""
    content = content[:idx] + clean_canvas_block + content[end_bracket:]
    print("Updated canvas container background to cremish.")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved file.")
