const fs = require('fs');
const path = require('path');

const adminDir = 'C:\\Users\\Spine\\Elijays-Mens-Wear\\frontend\\src\\components\\admin';
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.jsx'));

const replacements = [
  [/dark:bg-primary dark:bg-base-950/g, 'dark:bg-base-950'],
  [/dark:bg-utility-gray dark:bg-base-900/g, 'dark:bg-base-900'],
  [/bg-base-800(?=\s|$|\.|\/)/g, 'bg-utility-gray dark:bg-base-800'],
  [/bg-base-800\//g, 'bg-utility-gray/'],
  [/dark:bg-base-950\//g, 'dark:bg-base-950/'],
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
