import re
import glob

files = [
    'd:/IE106/components/pages/home-page.tsx',
    'd:/IE106/components/music/music-card.tsx',
    'd:/IE106/components/music/track-row.tsx'
]

replacements = [
    (r"'rgba\(255,255,255,0\.95\)'", "'var(--vw-text-primary)'"),
    (r"'rgba\(255,255,255,0\.9\)'", "'var(--vw-text-primary)'"),
    (r"'rgba\(255,255,255,0\.65\)'", "'var(--vw-text-secondary)'"),
    (r"'rgba\(255,255,255,0\.6\)'", "'var(--vw-text-secondary)'"),
    (r"'rgba\(255,255,255,0\.55\)'", "'var(--vw-text-secondary)'"),
    (r"'rgba\(255,255,255,0\.45\)'", "'var(--vw-text-muted)'"),
    (r"'rgba\(255,255,255,0\.35\)'", "'var(--vw-text-muted)'"),
    (r"'rgba\(255,255,255,0\.25\)'", "'var(--vw-text-muted)'"),
    (r"'rgba\(255,255,255,0\.08\)'", "'var(--vw-border)'"),
    (r"'rgba\(255,255,255,0\.06\)'", "'var(--vw-border)'"),
    (r"'rgba\(255,255,255,0\.05\)'", "'rgba(255,255,255,0.12)'"),
    (r"'rgba\(255,255,255,0\.04\)'", "'rgba(255,255,255,0.1)'"),
    (r"'#1F162E'", "'var(--vw-surface)'"),
    (r"'#170F23'", "'var(--vw-bg)'")
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = re.sub(old, new, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated", file_path)
