const fs = require('fs');
const path = './components/EventsModule.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update interface
content = content.replace(
  "isLocked: boolean;",
  "isLocked: boolean;\n  source: 'Landing Page' | 'Thủ công';"
);

// Update MOCK_EVENTS
content = content.replace(/isLocked: (true|false),/g, (match) => {
  const source = Math.random() > 0.5 ? 'Landing Page' : 'Thủ công';
  return `${match}\n    source: '${source}',`;
});

fs.writeFileSync(path, content);
