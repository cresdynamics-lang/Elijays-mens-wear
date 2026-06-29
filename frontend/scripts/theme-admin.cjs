const fs = require('fs');
const path = require('path');

const adminDir = 'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\components\\admin';
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.jsx'));

const replacements = [
  [/bg-base-950(?=\s|$|\.|\/)/g, 'bg-primary dark:bg-base-950'],
  [/bg-base-950\//g, 'bg-primary/'],
  [/bg-base-900(?=\s|$|\.|\/)/g, 'bg-utility-gray dark:bg-base-900'],
  [/bg-base-900\//g, 'bg-utility-gray/'],
  [/text-white(?=[\s\.]|$)/g, 'text-secondary dark:text-white'],
  [/text-accent-100(?=[\s\.]|$)/g, 'text-secondary dark:text-accent-100'],
  [/text-accent-300(?=[\s\.]|$)/g, 'text-secondary dark:text-accent-300'],
  [/border-white\/5(?=\s|$)/g, 'border-utility-gray/60 dark:border-white/5'],
  [/border-accent-500\/10(?=\s|$)/g, 'border-utility-gray/60 dark:border-accent-500/10'],
  [/border-accent-500\/20(?=\s|$)/g, 'border-utility-gray/60 dark:border-accent-500/20'],
  [/border-neutral-900\/20(?=\s|$)/g, 'border-utility-gray/60 dark:border-neutral-900/20'],
];

files.forEach(file => {
  let content = fs.readFileSync(path.join(adminDir, file), 'utf8');
  let original = content;
  replacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
  });
  if (content !== original) {
    fs.writeFileSync(path.join(adminDir, file), content);
    console.log('Updated:', file);
  }
});
