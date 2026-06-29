const fs = require('fs');
const path = require('path');

const dirs = [
  'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\components',
  'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\pages'
];

const replacements = [
  [/text-accent-500\/30\b/g, 'text-secondary dark:text-accent-500\/30'],
  [/text-accent-500\/40\b/g, 'text-secondary dark:text-accent-500\/40'],
  [/text-accent-500\/50\b/g, 'text-secondary dark:text-accent-500\/50'],
  [/text-accent-500\/60\b/g, 'text-secondary dark:text-accent-500\/60'],
  [/text-accent-500\/70\b/g, 'text-secondary dark:text-accent-500\/70'],
  [/text-accent-500\/80\b/g, 'text-secondary dark:text-accent-500\/80'],
  [/text-accent-100\b(?=[\s\.]|$)/g, 'text-secondary dark:text-accent-100'],
  [/text-accent-300\b(?=[\s\.]|$)/g, 'text-secondary dark:text-accent-300'],
  [/text-white\b(?=[\s\.]|$)/g, 'text-secondary dark:text-white'],
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
