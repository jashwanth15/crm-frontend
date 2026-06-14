const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('alert(')) {
      if (!content.includes('react-hot-toast')) {
        const importMatch = content.match(/import .* from '.*';?\n/g);
        const importString = "import toast from 'react-hot-toast';\n";
        if (importMatch) {
          const lastImport = importMatch[importMatch.length - 1];
          content = content.replace(lastImport, lastImport + importString);
        } else {
          content = importString + content;
        }
      }

      content = content.replace(/alert\((.*)\)/g, (match, p1) => {
        if (p1.toLowerCase().includes('success') || p1.toLowerCase().includes('sent')) {
          return `toast.success(${p1})`;
        } else {
          return `toast.error(${p1})`;
        }
      });

      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
});
