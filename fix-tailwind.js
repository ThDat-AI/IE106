const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex to find things like w-(--sidebar-width) and convert to w-[var(--sidebar-width)]
  // Match prefix like w-, min-w-, max-h-, origin-, px- followed by (--) and then some word ending with )
  const regex = /([a-z0-9-]+)-\(--([a-zA-Z0-9-]+)\)/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '$1-[var(--$2)]');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'components'));
console.log('Done');
