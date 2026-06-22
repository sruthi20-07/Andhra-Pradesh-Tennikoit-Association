// scripts/gridRefactor.js
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

  // Replace import { Grid, ... } from '@mui/material'; with separate import or Grid2
  // Let's check if the file imports Grid from @mui/material
  // e.g. import { Grid, Box, ... } from '@mui/material'; or import Grid from '@mui/material/Grid';
  
  // Rule: replace direct imports of Grid
  // Case 1: import { ..., Grid, ... } from '@mui/material';
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
      newImport += `import Grid2 from '@mui/material/Grid2';`;
      return newImport;
    }
    return match;
  });

  // Case 2: import Grid from '@mui/material/Grid';
  const directGridRegex = /import\s+Grid\s+from\s+['"]@mui\/material\/Grid['"]/g;
  if (directGridRegex.test(content)) {
    content = content.replace(directGridRegex, "import Grid2 from '@mui/material/Grid2'");
    changed = true;
  }

  // Case 3: import { Grid } from '@mui/material';
  const singleGridRegex = /import\s+\{\s*Grid\s*\}\s+from\s+['"]@mui\/material['"]/g;
  if (singleGridRegex.test(content)) {
    content = content.replace(singleGridRegex, "import Grid2 from '@mui/material/Grid2'");
    changed = true;
  }

  // Replace component usage <Grid ...> with <Grid2 ...>
  // and </Grid> with </Grid2>
  if (content.includes('<Grid') || content.includes('</Grid>')) {
    content = content.replace(/<Grid(\s|>)/g, '<Grid2$1');
    content = content.replace(/<\/Grid>/g, '</Grid2>');
    changed = true;
  }

  // Remove item prop on Grid2
  // e.g. item, item={true}, item={false}
  const itemRegex = /\sitem(\s|>|=\{[^}]+\})/g;
  if (itemRegex.test(content)) {
    content = content.replace(itemRegex, '$1').replace(/\sitem(?=\s|>)/g, '');
    changed = true;
  }

  // Convert breakpoint sizing props
  // e.g. xs={12} sm={6} md={4}
  // Let's match Grid2 components and replace breakpoint props with size={{ ... }}
  // To keep it simple and robust, let's find xs={...}, sm={...}, md={...}, lg={...}, xl={...}
  // and convert them to size={{ xs: ..., sm: ..., md: ..., lg: ..., xl: ... }}
  // We can do this component by component or with a regex.
  // Let's find tags like <Grid2 ...>
  const gridTagRegex = /<Grid2([^>]*)/g;
  content = content.replace(gridTagRegex, (match, p1) => {
    let tagContent = p1;
    let sizes = {};
    const bps = ['xs', 'sm', 'md', 'lg', 'xl'];
    let tagChanged = false;

    bps.forEach(bp => {
      // match e.g. xs={12} or xs={2.4} or xs={true} or xs="12" or xs={ { xs: 12 } } etc.
      // let's match both braces and strings
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
    return `<Grid2${tagContent}`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});

console.log('Grid refactor finished.');
