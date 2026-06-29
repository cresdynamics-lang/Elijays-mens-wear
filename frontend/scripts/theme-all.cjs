const fs = require('fs');
const path = require('path');

const dirs = [
  'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\pages',
  'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\components'
];

const replacements = [
  [/bg-base-950\//g, 'bg-primary/'],
  [/bg-base-950(?=\s|$|\.|\/)/g, 'bg-primary dark:bg-base-950'],
  [/bg-base-900\//g, 'bg-utility-gray/'],
  [/bg-base-900(?=\s|$|\.|\/)/g, 'bg-utility-gray dark:bg-base-900'],
  [/text-white(?=[\s\.]|$)/g, 'text-secondary dark:text-white'],
  [/text-accent-100(?=[\s\.]|$)/g, 'text-secondary dark:text-accent-100'],
  [/text-accent-300(?=[\s\.]|$)/g, 'text-secondary dark:text-accent-300'],
  [/border-white\/5(?=\s|$)/g, 'border-utility-gray/60 dark:border-white/5'],
  [/border-accent-500\/10(?=\s|$)/g, 'border-utility-gray/60 dark:border-accent-500/10'],
  [/border-accent-500\/20(?=\s|$)/g, 'border-utility-gray/60 dark:border-accent-500/20'],
  [/border-neutral-900\/20(?=\s|$)/g, 'border-utility-gray/60 dark:border-neutral-900/20'],
  [/bg-base-950\/60/g, 'bg-utility-gray/60 dark:bg-base-950/60'],
  [/bg-base-950\/80/g, 'bg-utility-gray/80 dark:bg-base-950/80'],
  [/bg-base-950\/50/g, 'bg-utility-gray/50 dark:bg-base-950/50'],
  [/bg-base-950\/90/g, 'bg-utility-gray/90 dark:bg-base-950/90'],
];

dirs.forEach(dir => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
  files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let original = content;
    replacements.forEach(([pattern, replacement]) => {
      content = content.replace(pattern, replacement);
    });
    if (content !== original) {
      fs.writeFileSync(path.join(dir, file), content);
      console.log('Updated:', path.join(dir, file));
    }
  });
});
