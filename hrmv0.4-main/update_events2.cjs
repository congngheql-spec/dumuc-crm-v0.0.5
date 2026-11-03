const fs = require('fs');
const path = './components/EventsModule.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update interface
content = content.replace(
  "source: 'Landing Page' | 'Thủ công';",
  "source: 'Landing Page' | 'Thủ công';\n  callStatus: 'Chưa gọi' | 'Đã gọi';\n  callResult: 'Rỗng' | 'Đồng ý tham gia' | 'Từ chối' | 'Sai số điện thoại' | 'Không liên hệ được lần 1' | 'Không liên hệ được lần 2' | 'Không liên hệ được lần 3';"
);

// Update MOCK_EVENTS
content = content.replace(/source: '(Landing Page|Thủ công)',/g, (match) => {
  return `${match}\n    callStatus: 'Chưa gọi',\n    callResult: 'Rỗng',`;
});

fs.writeFileSync(path, content);
