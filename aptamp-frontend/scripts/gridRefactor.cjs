// scripts/gridRefactor.cjs
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. If there's import Grid2 from '@mui/material/Grid2', rename to import Grid from '@mui/material/Grid'
  if (content.includes("from '@mui/material/Grid2'") || content.includes('from "@mui/material/Grid2"')) {
    content = content.replace(/from\s+['"]@mui\/material\/Grid2['"]/g, "from '@mui/material/Grid'");
    content = content.replace(/import\s+Grid2\s+from/g, "import Grid from");
    changed = true;
  }

  // 2. Rename <Grid2 ...> and </Grid2> back to <Grid ...> and </Grid>
  if (content.includes('<Grid2') || content.includes('</Grid2>')) {
    content = content.replace(/<Grid2(\s|>)/g, '<Grid$1');
    content = content.replace(/<\/Grid2>/g, '</Grid>');
    changed = true;
  }

  // 3. Make sure Grid is imported from '@mui/material/Grid' and not mixed
  const importMuiRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@mui\/material['"]/g;
  content = content.replace(importMuiRegex, (match, p1) => {
    let imports = p1.split(',').map(s => s.trim());
    if (imports.includes('Grid')) {
      changed = true;
      imports = imports.filter(i => i !== 'Grid');
      let newImport = '';
      if (imports.length > 0) {
        newImport = `import { ${imports.join(', ')} } from '@mui/material';\n`;
      }
      newImport += `import Grid from '@mui/material/Grid';`;
      return newImport;
    }
    return match;
  });

  // 4. Remove item prop on Grid
  const itemRegex = /\sitem(\s|>|=\{[^}]+\})/g;
  if (itemRegex.test(content)) {
    content = content.replace(itemRegex, '$1').replace(/\sitem(?=\s|>)/g, '');
    changed = true;
  }

  // 5. Convert size props if not already converted
  const gridTagRegex = /<Grid([^2][^>]*)/g;
  content = content.replace(gridTagRegex, (match, p1) => {
    let tagContent = p1;
    let sizes = {};
    const bps = ['xs', 'sm', 'md', 'lg', 'xl'];
    let tagChanged = false;

    bps.forEach(bp => {
      const bpRegex = new RegExp(`\\b${bp}=\\{([^}]+)\\}\\s*|\\b${bp}=["']([^"']+)["']\\s*`, 'g');
      tagContent = tagContent.replace(bpRegex, (m, braceVal, strVal) => {
        const val = (braceVal || strVal).trim();
        sizes[bp] = val;
        tagChanged = true;
        return ''; // remove from tag
      });
    });

    if (tagChanged) {
      changed = true;
      const sizePairs = Object.entries(sizes).map(([k, v]) => `${k}: ${v}`).join(', ');
      tagContent += ` size={{ ${sizePairs} }}`;
    }
    return `<Grid${tagContent}`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated to standard Grid:', file);
  }
});

console.log('Grid refactor to standard Grid finished.');
