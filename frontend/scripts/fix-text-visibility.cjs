const fs = require('fs');
const path = require('path');

const adminDir = 'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\components\\admin';
const pagesDir = 'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\pages';

const replacements = [
  [/text-accent-500\/30\b/g, 'text-secondary\/70 dark:text-accent-500\/30'],
  [/text-accent-500\/40\b/g, 'text-secondary\/60 dark:text-accent-500\/40'],
  [/text-accent-500\/50\b/g, 'text-secondary\/50 dark:text-accent-500\/50'],
  [/text-accent-500\/60\b/g, 'text-secondary\/70 dark:text-accent-500\/60'],
  [/text-accent-500\/70\b/g, 'text-secondary dark:text-accent-500\/70'],
  [/text-accent-500\/80\b/g, 'text-secondary dark:text-accent-500\/80'],
  [/text-accent-100\b/g, 'text-secondary dark:text-accent-100'],
  [/text-accent-300\b/g, 'text-secondary dark:text-accent-300'],
  [/text-white\b(?=[\s\.]|$)/g, 'text-secondary dark:text-white'],
  [/text-base-400\b/g, 'text-secondary\/70 dark:text-base-400'],
  [/text-base-500\b/g, 'text-secondary dark:text-base-500'],
  [/text-base-600\b/g, 'text-secondary dark:text-base-600'],
  [/text-base-700\b/g, 'text-secondary dark:text-base-700'],
  [/text-green-400\b/g, 'text-green-600 dark:text-green-400'],
  [/text-red-400\b/g, 'text-red-600 dark:text-red-400'],
  [/text-red-300\b/g, 'text-red-600 dark:text-red-300'],
  [/text-amber-400\b/g, 'text-amber-600 dark:text-amber-400'],
  [/text-amber-400\/70\b/g, 'text-amber-600 dark:text-amber-400\/70'],
  [/border-accent-500\/10\b/g, 'border-utility-gray\/60 dark:border-accent-500\/10'],
  [/border-accent-500\/20\b/g, 'border-utility-gray\/60 dark:border-accent-500\/20'],
  [/border-white\/5\b/g, 'border-utility-gray\/60 dark:border-white\/5'],
  [/border-neutral-900\/20\b/g, 'border-utility-gray\/60 dark:border-neutral-900\/20'],
];

const dirs = [adminDir, pagesDir];
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
