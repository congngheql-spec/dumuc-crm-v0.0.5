import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  Car,
  FileText,
  Phone,
  Mail,
  Paperclip,
  Image as ImageIcon,
  FileSpreadsheet,
  Eye,
  Download,
  Check,
} from 'lucide-react';
import type { PotentialCustomerItem } from './FeedbackModule';
import type { HistoryItem, TaskItem, ActivityItem } from './EventsModule';

export const FEEDBACK_UNSATISFIED_OPTIONS = [
  'Nhân sự',
  'Thời gian giao nhận',
  'Báo giá',
  'Chất lượng dịch vụ',
  'Khác',
] as const;

export type FeedbackUnsatisfiedCategory =
  (typeof FEEDBACK_UNSATISFIED_OPTIONS)[number];

export interface FeedbackAttachmentItem {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf';
  caption: string;
  previewSvg: string;
}

export interface FeedbackRoDateInfo {
  receiveDate: string;
  promisedDate: string;
  actualDate: string;
  daysAfterDeliveryLabel: string;
}

interface FeedbackRecordDetailModalProps {
  currentGuest: PotentialCustomerItem;
  roDateInfo: FeedbackRoDateInfo;
  activeTab: 'activity_history' | 'history' | 'tasks';
  setActiveTab: (tab: 'activity_history' | 'history' | 'tasks') => void;
  onClose: () => void;
  activityHistory: ActivityItem[];
  notesHistory: HistoryItem[];
  noteContent: string;
  setNoteContent: (val: string) => void;
  onSaveNote: () => void;
  tasks: TaskItem[];
  taskContent: string;
  setTaskContent: (val: string) => void;
  onAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  editingTaskId: string | null;
  editTaskContent: string;
  setEditTaskContent: (val: string) => void;
  onStartEditTask: (task: TaskItem) => void;
  onSaveEditTask: () => void;
  onCancelEditTask: () => void;
}

const hashRecordId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const getDefaultUnsatisfiedCategories = (
  record: PotentialCustomerItem
): string[] => {
  if (record.feedbackUnsatisfiedCategories !== undefined) {
    return record.feedbackUnsatisfiedCategories;
  }
  const presets: string[][] = [
    ['Thời gian giao nhận', 'Chất lượng dịch vụ'],
    ['Báo giá', 'Nhân sự'],
    ['Chất lượng dịch vụ'],
    ['Thời gian giao nhận', 'Báo giá'],
    ['Nhân sự', 'Khác'],
  ];
  return presets[hashRecordId(record.id) % presets.length];
};

const getDefaultFeedbackContent = (record: PotentialCustomerItem): string => {
  if (record.feedbackContent) return record.feedbackContent;
  const carLabel = [record.carBrand, record.carModel]
    .filter(Boolean)
    .join(' ') || 'xe';
  const plateLabel = record.licensePlate ? ` (${record.licensePlate})` : '';
  const roLabel = record.originalRoCode || 'RO hiện tại';
  const templates = [
    `Xe ${carLabel}${plateLabel} làm dịch vụ theo phiếu ${roLabel} giao trễ hơn 2 giờ so với giờ hẹn ban đầu nhưng không được cố vấn thông báo trước. Ngoài ra sau khi nhận xe vẫn còn vết bụi sơn nhẹ ở cản trước, đề nghị xưởng kiểm tra và xử lý lại giúp.`,
    `Khi lập báo giá cho phiếu ${roLabel} có phát sinh thêm hạng mục thay lọc gió và vệ sinh kim phun nhưng chưa giải thích rõ chi phí trước khi thực hiện. Mong bộ phận CSKH rà soát lại báo giá và phản hồi sớm.`,
    `Sau khi hoàn tất bảo dưỡng cho xe ${carLabel}${plateLabel} (${roLabel}), lúc chạy tốc độ thấp vẫn nghe tiếng kêu lạch cạch nhẹ ở gầm trước bên phụ. Rất mong xưởng sắp xếp kiểm tra lại trong tuần này.`,
    `Quá trình tiếp nhận và bàn giao xe ${carLabel}${plateLabel} kéo dài, khách phải chờ lâu tại khu vực thanh toán. Đề nghị xưởng cải thiện quy trình giao nhận xe đúng hẹn hơn.`,
  ];
  return templates[hashRecordId(record.id) % templates.length];
};

const makeSvgDataUri = (svgBody: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">${svgBody}</svg>`
  )}`;

const getDefaultAttachments = (
  record: PotentialCustomerItem
): FeedbackAttachmentItem[] => {
  if (record.feedbackAttachments && record.feedbackAttachments.length > 0) {
    return record.feedbackAttachments;
  }
  const roTag = record.originalRoCode || 'RO-2405';
  const plateTag = record.licensePlate || '51K-889.21';
  return [
    {
      id: `${record.id}-att-1`,
      name: `anh-ngoai-that-${plateTag.replace(/[^a-zA-Z0-9]/g, '')}.jpg`,
      size: '1.4 MB',
      type: 'image',
      caption: `Ảnh khu vực cản trước xe ${plateTag}`,
      previewSvg: makeSvgDataUri(`
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#bg1)"/>
        <rect x="24" y="135" width="272" height="45" rx="6" fill="#94a3b8" opacity="0.35"/>
        <path d="M55 128 L88 78 C95 68 106 64 120 64 L215 64 C232 64 244 72 252 84 L274 114 C280 120 282 128 280 138 L48 138 C46 134 49 131 55 128 Z" fill="#334155"/>
        <path d="M100 84 L152 84 L152 106 L82 106 Z" fill="#93c5fd" opacity="0.8"/>
        <path d="M162 84 L222 84 L240 106 L162 106 Z" fill="#93c5fd" opacity="0.8"/>
        <circle cx="96" cy="142" r="22" fill="#1e293b"/>
        <circle cx="96" cy="142" r="11" fill="#cbd5e1"/>
        <circle cx="232" cy="142" r="22" fill="#1e293b"/>
        <circle cx="232" cy="142" r="11" fill="#cbd5e1"/>
        <circle cx="262" cy="122" r="16" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="4 3"/>
        <rect x="14" y="12" width="110" height="22" rx="4" fill="#1e293b" opacity="0.75"/>
        <text x="22" y="27" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">${plateTag}</text>
      `),
    },
    {
      id: `${record.id}-att-2`,
      name: `can-canh-vet-xuoc.jpg`,
      size: '980 KB',
      type: 'image',
      caption: 'Ảnh cận cảnh vị trí khách hàng phản ánh',
      previewSvg: makeSvgDataUri(`
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#475569"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#bg2)"/>
        <path d="M0 115 Q160 85 320 120 L320 200 L0 200 Z" fill="#334155"/>
        <path d="M105 92 Q158 106 218 96" fill="none" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M122 104 Q165 113 205 107" fill="none" stroke="#e2e8f0" stroke-width="1.5" stroke-linecap="round"/>
        <rect x="85" y="72" width="150" height="58" rx="8" fill="none" stroke="#facc15" stroke-width="2.5" stroke-dasharray="6 4"/>
        <rect x="14" y="12" width="96" height="22" rx="4" fill="#ef4444" opacity="0.9"/>
        <text x="22" y="27" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">Cận cảnh lỗi</text>
      `),
    },
    {
      id: `${record.id}-att-3`,
      name: `bao-gia-${roTag}.jpg`,
      size: '640 KB',
      type: 'image',
      caption: `Ảnh chụp phiếu báo giá ${roTag}`,
      previewSvg: makeSvgDataUri(`
        <rect width="320" height="200" fill="#f1f5f9"/>
        <rect x="52" y="14" width="216" height="172" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="68" y="28" width="90" height="10" rx="2" fill="#1A73E8"/>
        <rect x="200" y="28" width="52" height="10" rx="2" fill="#e2e8f0"/>
        <line x1="68" y1="50" x2="252" y2="50" stroke="#e2e8f0" stroke-width="1.5"/>
        <rect x="68" y="62" width="120" height="7" rx="2" fill="#94a3b8"/>
        <rect x="206" y="62" width="46" height="7" rx="2" fill="#64748b"/>
        <rect x="68" y="80" width="105" height="7" rx="2" fill="#94a3b8"/>
        <rect x="206" y="80" width="46" height="7" rx="2" fill="#64748b"/>
        <rect x="64" y="96" width="192" height="20" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1"/>
        <rect x="70" y="103" width="110" height="6" rx="2" fill="#b45309"/>
        <rect x="206" y="103" width="44" height="6" rx="2" fill="#b45309"/>
        <rect x="68" y="128" width="90" height="7" rx="2" fill="#94a3b8"/>
        <rect x="206" y="128" width="46" height="7" rx="2" fill="#64748b"/>
        <line x1="68" y1="150" x2="252" y2="150" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect x="174" y="160" width="78" height="12" rx="2" fill="#1e293b"/>
      `),
    },
    {
      id: `${record.id}-att-4`,
      name: `bien-ban-giao-xe-${roTag}.pdf`,
      size: '420 KB',
      type: 'pdf',
      caption: `Biên bản kiểm tra & bàn giao xe (${roTag})`,
      previewSvg: makeSvgDataUri(`
        <rect width="320" height="200" fill="#fef2f2"/>
        <rect x="86" y="20" width="148" height="160" rx="8" fill="#ffffff" stroke="#fecaca" stroke-width="2"/>
        <rect x="116" y="42" width="88" height="28" rx="4" fill="#ef4444"/>
        <text x="160" y="61" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="bold" fill="#ffffff">PDF</text>
        <rect x="106" y="88" width="108" height="8" rx="2" fill="#cbd5e1"/>
        <rect x="106" y="106" width="88" height="8" rx="2" fill="#e2e8f0"/>
        <rect x="106" y="124" width="98" height="8" rx="2" fill="#e2e8f0"/>
        <rect x="106" y="146" width="60" height="10" rx="2" fill="#fca5a5"/>
      `),
    },
  ];
};

export const FeedbackRecordDetailModal: React.FC<
  FeedbackRecordDetailModalProps
> = ({
  currentGuest,
  roDateInfo,
  activeTab,
  setActiveTab,
  onClose,
  activityHistory,
  notesHistory,
  noteContent,
  setNoteContent,
  onSaveNote,
  tasks,
  taskContent,
  setTaskContent,
  onAddTask,
  onToggleTask,
  editingTaskId,
  editTaskContent,
  setEditTaskContent,
  onStartEditTask,
  onSaveEditTask,
  onCancelEditTask,
}) => {
  const [previewAttachment, setPreviewAttachment] =
    useState<FeedbackAttachmentItem | null>(null);

  const selectedCategories = getDefaultUnsatisfiedCategories(currentGuest);
  const feedbackContent = getDefaultFeedbackContent(currentGuest);
  const attachments = getDefaultAttachments(currentGuest);

  const handleDownloadAttachment = (file: FeedbackAttachmentItem) => {
    const triggerDownload = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    if (file.type === 'image') {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  triggerDownload(blob, file.name);
                } else {
                  const svgText = decodeURIComponent(
                    file.previewSvg.replace(/^data:image\/svg\+xml;utf8,/, '')
                  );
                  triggerDownload(
                    new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }),
                    file.name
                  );
                }
              },
              'image/jpeg',
              0.92
            );
            return;
          }
        } catch {
          // Fallback below
        }
        const svgText = decodeURIComponent(
          file.previewSvg.replace(/^data:image\/svg\+xml;utf8,/, '')
        );
        triggerDownload(
          new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }),
          file.name
        );
      };
      img.src = file.previewSvg;
    } else {
      const content = `Tệp đính kèm phản ánh\nTên tệp: ${file.name}\nMô tả: ${file.caption}\nKhách hàng: ${currentGuest.fullName}\nRO: ${currentGuest.originalRoCode || '-'}\nBiển số xe: ${currentGuest.licensePlate || '-'}\nNgày tạo phản ánh: ${currentGuest.registrationDate || '-'}\n`;
      triggerDownload(
        new Blob([content], { type: 'application/octet-stream' }),
        file.name
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col w-screen h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            Thông tin Khách hàng tiềm năng
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main 2-Column Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Column: Feedback Details (Single-screen, no vertical scroll) */}
        <div className="w-[54%] border-r border-gray-200 px-5 py-3.5 flex flex-col gap-2.5 overflow-hidden bg-white min-h-0">
          {/* Row 1: Ngày tạo phản ánh */}
          <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 flex items-center justify-between shrink-0">
            <span className="text-xs font-medium text-gray-500">
              Ngày tạo phản ánh
            </span>
            <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {currentGuest.registrationDate || '-'}
            </span>
          </div>

          {/* Row 2: Biển số xe, Hiệu xe, Dòng xe */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 min-w-0">
              <div className="text-[11px] text-gray-500 mb-0.5">Biển số xe</div>
              <div
                className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 truncate"
                title={currentGuest.licensePlate || '-'}
              >
                <Car className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">
                  {currentGuest.licensePlate || '-'}
                </span>
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 min-w-0">
              <div className="text-[11px] text-gray-500 mb-0.5">Hiệu xe</div>
              <div
                className="text-sm font-semibold text-gray-800 truncate"
                title={currentGuest.carBrand || '-'}
              >
                {currentGuest.carBrand || '-'}
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 min-w-0">
              <div className="text-[11px] text-gray-500 mb-0.5">Dòng xe</div>
              <div
                className="text-sm font-semibold text-gray-800 truncate"
                title={currentGuest.carModel || '-'}
              >
                {currentGuest.carModel || '-'}
              </div>
            </div>
          </div>

          {/* Row 3: RO, Ngày tiếp nhận, Ngày giao xe thực tế */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 min-w-0">
              <div className="text-[11px] text-gray-500 mb-0.5">RO</div>
              <div
                className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 truncate"
                title={currentGuest.originalRoCode || '-'}
              >
                <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">
                  {currentGuest.originalRoCode || '-'}
                </span>
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 min-w-0">
              <div className="text-[11px] text-gray-500 mb-0.5">
                Ngày tiếp nhận
              </div>
              <div className="text-sm font-semibold text-gray-800 truncate">
                {roDateInfo.receiveDate}
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 min-w-0">
              <div className="text-[11px] text-gray-500 mb-0.5">
                Ngày giao xe thực tế
              </div>
              <div className="text-sm font-semibold text-gray-800 truncate">
                {roDateInfo.actualDate}
              </div>
            </div>
          </div>

          {/* Row 4: Khách hàng, Số điện thoại, Email */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 min-w-0">
              <div className="text-[11px] text-gray-500 mb-0.5">Khách hàng</div>
              <div
                className="text-sm font-semibold text-gray-900 truncate"
                title={currentGuest.fullName || '-'}
              >
                {currentGuest.fullName || '-'}
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 min-w-0">
              <div className="text-[11px] text-gray-500 mb-0.5">
                Số điện thoại
              </div>
              <div
                className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 truncate"
                title={currentGuest.phone || '-'}
              >
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{currentGuest.phone || '-'}</span>
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200/80 min-w-0">
              <div className="text-[11px] text-gray-500 mb-0.5">Email</div>
              <div
                className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 truncate"
                title={currentGuest.email || '-'}
              >
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{currentGuest.email || '-'}</span>
              </div>
            </div>
          </div>

          {/* Row 5: Anh / Chị chưa hài lòng ở hạng mục (Dạng tick vuông - read-only) */}
          <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200/80 shrink-0">
            <div className="text-xs font-semibold text-gray-700 mb-2">
              Anh / Chị chưa hài lòng ở hạng mục:
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {FEEDBACK_UNSATISFIED_OPTIONS.map((option) => {
                const isChecked = selectedCategories.includes(option);
                return (
                  <div
                    key={option}
                    className="inline-flex items-center gap-2 select-none cursor-default"
                  >
                    <span
                      role="checkbox"
                      aria-checked={isChecked}
                      aria-readonly="true"
                      aria-disabled="true"
                      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span
                      className={`text-xs ${
                        isChecked
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-500 font-medium'
                      }`}
                    >
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 6: Nội dung */}
          <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200/80 flex flex-col flex-1 min-h-[76px] overflow-hidden">
            <div className="text-xs font-semibold text-gray-700 mb-1.5 shrink-0">
              Nội dung:
            </div>
            <div className="text-sm text-gray-800 leading-relaxed bg-white border border-gray-200 rounded-md px-3 py-2 flex-1 overflow-hidden">
              <p className="line-clamp-4 whitespace-pre-wrap">
                {feedbackContent}
              </p>
            </div>
          </div>

          {/* Row 7: Tệp đính kèm (hiển thị dạng grid) */}
          <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200/80 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <Paperclip className="w-3.5 h-3.5 text-gray-500" />
                <span>Tệp đính kèm</span>
                <span className="text-[11px] font-medium text-gray-400">
                  ({attachments.length})
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="group bg-white border border-gray-200 hover:border-[#1A73E8] rounded-lg overflow-hidden text-left transition-all flex flex-col shadow-2xs"
                >
                  <div
                    onClick={() => setPreviewAttachment(file)}
                    className="relative h-[74px] w-full bg-gray-100 overflow-hidden cursor-pointer"
                    title={`Xem trước ${file.name}`}
                  >
                    <img
                      src={file.previewSvg}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewAttachment(file);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-white/95 hover:bg-white text-gray-800 hover:text-[#1A73E8] flex items-center justify-center shadow-xs cursor-pointer"
                        title="Xem trước"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadAttachment(file);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-white/95 hover:bg-white text-gray-800 hover:text-[#1A73E8] flex items-center justify-center shadow-xs cursor-pointer"
                        title="Tải về"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="px-2 py-1.5 min-w-0">
                    <div className="flex items-center gap-1">
                      {file.type === 'pdf' ? (
                        <FileSpreadsheet className="w-3 h-3 text-red-500 shrink-0" />
                      ) : (
                        <ImageIcon className="w-3 h-3 text-[#1A73E8] shrink-0" />
                      )}
                      <span
                        className="text-[11px] font-medium text-gray-800 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <span className="text-[10px] text-gray-400">
                        {file.size}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewAttachment(file)}
                          className="p-0.5 text-gray-400 hover:text-[#1A73E8] rounded transition-colors cursor-pointer"
                          title="Xem trước"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadAttachment(file)}
                          className="p-0.5 text-gray-400 hover:text-[#1A73E8] rounded transition-colors cursor-pointer"
                          title="Tải về"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tabs (Lịch sử, Ghi chú nội bộ, Lời nhắc & Công việc) */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50/40 overflow-hidden">
          <div className="px-6 pt-4 border-b border-gray-200 bg-white shrink-0">
            <div className="flex gap-6">
              <button
                type="button"
                className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'activity_history'
                    ? 'border-[#1A73E8] text-[#1A73E8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('activity_history')}
              >
                Lịch sử
              </button>
              <button
                type="button"
                className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'border-[#1A73E8] text-[#1A73E8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('history')}
              >
                Ghi chú nội bộ
              </button>
              <button
                type="button"
                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'tasks'
                    ? 'border-[#1A73E8] text-[#1A73E8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('tasks')}
              >
                Lời nhắc &amp; Công việc
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {tasks.filter((t) => !t.completed).length}
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'activity_history' && (
              <div>
                {activityHistory.length === 0 ? (
                  <div className="text-sm text-gray-500 py-8 text-center">
                    Chưa có dữ liệu lịch sử hoạt động
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activityHistory.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">
                              {item.action}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                              {item.author}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <div className="mb-6">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Thêm ghi chú..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] resize-y mb-3"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onSaveNote}
                      disabled={!noteContent.trim()}
                      className="px-4 py-2 bg-[#1A73E8] hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Lưu ghi chú
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-800 mb-4">
                  Lịch sử
                </h3>
                {notesHistory.length === 0 ? (
                  <div className="text-sm text-gray-500 py-4 text-center">
                    Chưa có lịch sử trao đổi
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notesHistory.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">
                              Ghi chú
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                              {item.author}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={taskContent}
                    onChange={(e) => setTaskContent(e.target.value)}
                    placeholder="Thêm lời nhắc mới..."
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                    onKeyDown={(e) => e.key === 'Enter' && onAddTask()}
                  />
                  <button
                    type="button"
                    onClick={onAddTask}
                    disabled={!taskContent.trim()}
                    className="px-4 py-2 bg-[#1A73E8] hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <div className="text-sm text-gray-500 py-4 text-center">
                    Chưa có lời nhắc &amp; công việc
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          task.completed
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white border-gray-200 shadow-xs'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleTask(task.id)}
                          className="mt-1 w-4 h-4 text-[#1A73E8] border-gray-300 rounded focus:ring-[#1A73E8] cursor-pointer"
                        />
                        <div className="flex-1">
                          {editingTaskId === task.id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                value={editTaskContent}
                                onChange={(e) =>
                                  setEditTaskContent(e.target.value)
                                }
                                className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') onSaveEditTask();
                                  if (e.key === 'Escape') onCancelEditTask();
                                }}
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={onSaveEditTask}
                                  disabled={!editTaskContent.trim()}
                                  className="text-xs px-3 py-1 bg-[#1A73E8] text-white rounded hover:bg-blue-600 disabled:bg-blue-300 cursor-pointer"
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={onCancelEditTask}
                                  className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-sm ${
                                    task.completed
                                      ? 'text-gray-400 line-through'
                                      : 'text-gray-800'
                                  }`}
                                >
                                  {task.content}
                                </p>
                                {!task.completed && (
                                  <button
                                    type="button"
                                    onClick={() => onStartEditTask(task)}
                                    className="text-gray-400 hover:text-[#1A73E8] transition-colors cursor-pointer"
                                    title="Chỉnh sửa lời nhắc"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                  {task.author}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {task.timestamp}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attachment Preview Lightbox */}
      {previewAttachment && (
        <div
          className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-6"
          onClick={() => setPreviewAttachment(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-800 truncate">
                  {previewAttachment.name}
                </div>
                <div className="text-xs text-gray-500">
                  {previewAttachment.caption} • {previewAttachment.size}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadAttachment(previewAttachment)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A73E8] hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  title="Tải tệp về"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải về
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                  title="Đóng xem trước"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5 bg-gray-100 flex items-center justify-center">
              <img
                src={previewAttachment.previewSvg}
                alt={previewAttachment.name}
                className="max-h-[65vh] w-auto rounded-lg shadow-sm border border-gray-200 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
