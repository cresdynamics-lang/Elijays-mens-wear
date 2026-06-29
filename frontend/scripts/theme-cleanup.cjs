const fs = require('fs');
const path = require('path');

const dirs = [
  'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\pages',
  'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\components'
];

const replacements = [
  [/dark:bg-primary dark:bg-base-950/g, 'dark:bg-base-950'],
  [/dark:bg-utility-gray dark:bg-base-900/g, 'dark:bg-base-900'],
  [/bg-base-800(?=\s|$|\.|\/)/g, 'bg-utility-gray dark:bg-base-800'],
  [/bg-base-800\//g, 'bg-utility-gray/'],
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
