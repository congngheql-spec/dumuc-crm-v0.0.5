import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Check,
  AlertTriangle,
  Save,
  Pencil,
} from 'lucide-react';
import type {
  PotentialCustomerItem,
  ServiceQualityStatus,
  ServiceQualityCallResult,
} from './ServiceQualityModule';
import type { HistoryItem, TaskItem, ActivityItem } from './EventsModule';

export interface EvaluationQuestionAnswer {
  selectedOptions: string[];
  note: string;
}

export interface ServiceQualityEvaluationData {
  answers: Record<string, EvaluationQuestionAnswer>;
  updatedAt?: string;
  updatedBy?: string;
}

interface EvaluationOption {
  label: string;
  isRedFlag?: boolean;
}

interface EvaluationQuestionConfig {
  id: string;
  index: number;
  category: string;
  pureQuestion?: string;
  cskhQuestion: string;
  selectionMode: 'multi' | 'single';
  tickLabel: string;
  options: EvaluationOption[];
  notePlaceholder: string;
  isSelfAssessment?: boolean;
}

export const SERVICE_QUALITY_QUESTIONS: EvaluationQuestionConfig[] = [
  {
    id: 'q1_repair_quality',
    index: 1,
    category: 'Chất lượng sửa chữa',
    pureQuestion:
      'Xe của anh/chị từ lúc hoàn tất sửa chữa đến nay có vận hành ổn định và không phát sinh vấn đề gì mới không?',
    cskhQuestion:
      '"Từ hôm lấy xe về tới nay, anh/chị chạy thấy xe êm chưa, có phát sinh tiếng kêu hay vấn đề gì mới không ạ?"',
    selectionMode: 'multi',
    tickLabel: 'Tick nhanh',
    options: [
      { label: 'Ổn định hoàn toàn' },
      { label: 'Chưa dứt lỗi cũ (Cờ đỏ)', isRedFlag: true },
      { label: 'Phát sinh lỗi/tiếng kêu mới (Cờ đỏ)', isRedFlag: true },
      { label: 'Chưa đi nhiều nên chưa rõ' },
    ],
    notePlaceholder: 'Mô tả ngắn hiện tượng thực tế khách gặp phải (nếu có).',
  },
  {
    id: 'q2_quotation_transparency',
    index: 2,
    category: 'Minh bạch và tuân thủ quy trình báo giá',
    pureQuestion:
      'Cố vấn dịch vụ của garage có báo giá minh bạch và giải thích rõ ràng từng hạng mục trước khi thực hiện sửa chữa không?',
    cskhQuestion:
      '"Hôm đó bạn cố vấn dịch vụ có báo giá rõ ràng và giải thích kỹ từng mục trước khi làm cho anh/chị không ạ?"',
    selectionMode: 'multi',
    tickLabel: 'Tick nhanh',
    options: [
      { label: 'Báo giá rõ ràng, minh bạch' },
      { label: 'Giải thích chưa dễ hiểu' },
      { label: 'Có phát sinh hạng mục nhưng chưa báo trước (Cờ đỏ)', isRedFlag: true },
    ],
    notePlaceholder: 'Tên hạng mục khách thấy chưa rõ hoặc phát sinh ngoài dự kiến (nếu có).',
  },
  {
    id: 'q3_payment_documents',
    index: 3,
    category: 'Thanh toán và chứng từ',
    pureQuestion:
      'Anh/chị đã nhận đầy đủ hóa đơn điện tử và phiếu bảo hành cho các hạng mục đã thực hiện tại garage chưa?',
    cskhQuestion:
      '"Anh/chị kiểm tra giúp em xem mình đã nhận đủ hóa đơn điện tử và phiếu bảo hành các hạng mục vừa làm chưa ạ?"',
    selectionMode: 'multi',
    tickLabel: 'Tick nhanh',
    options: [
      { label: 'Đã nhận đầy đủ' },
      { label: 'Chưa nhận hóa đơn điện tử' },
      { label: 'Chưa nhận phiếu bảo hành' },
      { label: 'Khách không có nhu cầu lấy hóa đơn' },
    ],
    notePlaceholder: 'Thông tin Email hoặc Zalo khách muốn nhận bù chứng từ (nếu thiếu).',
  },
  {
    id: 'q4_time_commitment',
    index: 4,
    category: 'Cam kết thời gian',
    pureQuestion:
      'Garage có bàn giao xe cho anh/chị đúng với thời gian đã hẹn ban đầu hay không?',
    cskhQuestion:
      '"Hôm vừa rồi xưởng giao xe cho anh/chị có đúng giờ hẹn ban đầu không, hay bị trễ hơn dự kiến ạ?"',
    selectionMode: 'multi',
    tickLabel: 'Tick nhanh',
    options: [
      { label: 'Đúng giờ hoặc sớm hơn hẹn' },
      { label: 'Trễ hẹn (có báo trước)' },
      { label: 'Trễ hẹn (không báo trước)' },
    ],
    notePlaceholder: 'Thời gian trễ thực tế hoặc lý do khách phản ánh thêm (nếu có).',
  },
  {
    id: 'q5_top_improvement',
    index: 5,
    category: 'Cải thiện ưu tiên số 1 hiện tại của garage',
    pureQuestion:
      'Anh/chị mong muốn garage ưu tiên cải thiện yếu tố nào nhất trong lần phục vụ tiếp theo?',
    cskhQuestion:
      '"Nếu chọn 1 điểm để xưởng làm tốt hơn ở lần sau, anh/chị muốn tụi em cải thiện điều gì nhất ạ — ví dụ về tư vấn, kỹ thuật hay phòng chờ?"',
    selectionMode: 'multi',
    tickLabel: 'Tick nhanh',
    options: [
      { label: 'Hài lòng, không cần cải thiện' },
      { label: 'Về dịch vụ' },
      { label: 'Về KTV' },
      { label: 'Về Cố vấn dịch vụ' },
      { label: 'Về thanh toán' },
      { label: 'Về giá' },
      { label: 'Về cơ sở vật chất tại xưởng' },
    ],
    notePlaceholder: 'Ghi ngắn gọn góp ý cụ thể của khách hàng (nếu có).',
  },
  {
    id: 'q6_extra_utilities',
    index: 6,
    category: 'Mong muốn mở rộng tiện ích',
    pureQuestion:
      'Anh/chị có nhu cầu sử dụng thêm tiện ích mở rộng nào từ garage trong thời gian tới không?',
    cskhQuestion:
      '"Nếu sắp tới xưởng mở thêm tiện ích như làm ngoài giờ, làm Chủ Nhật, giao nhận xe tận nhà, cứu hộ hay hỗ trợ đăng kiểm thì anh/chị thấy cái nào tiện cho mình nhất ạ?"',
    selectionMode: 'multi',
    tickLabel: 'Tick nhanh (chọn nhiều)',
    options: [
      { label: 'Làm ngoài giờ' },
      { label: 'Làm Chủ Nhật' },
      { label: 'Giao nhận xe tận nhà' },
      { label: 'Cứu hộ' },
      { label: 'Hỗ trợ đăng kiểm' },
      { label: 'Chưa có nhu cầu' },
    ],
    notePlaceholder: 'Nhu cầu khác hoặc thời điểm khách dự kiến cần sử dụng (nếu có).',
  },
  {
    id: 'q7_cskh_self_assessment',
    index: 7,
    category: 'Phần Chăm sóc khách hàng tự cảm nhận (1 câu)',
    cskhQuestion:
      'Qua giọng điệu và cách trả lời của khách hàng trong cuộc gọi, bạn cảm nhận mức độ hài lòng thực tế của khách hàng đối với lần làm xe này như thế nào?',
    selectionMode: 'single',
    tickLabel: 'Tick nhanh (chọn 1)',
    options: [
      { label: 'Rất thoải mái, thiện cảm cao' },
      { label: 'Bình thường, trả lời ngắn gọn' },
      { label: 'Có vẻ còn lăn tăn, ngại nói thẳng' },
      { label: 'Bức xúc, có nguy cơ không quay lại (Cờ đỏ)', isRedFlag: true },
    ],
    notePlaceholder:
      'Dấu hiệu cảm nhận được hoặc lưu ý quan trọng cho lần chăm sóc tiếp theo.',
    isSelfAssessment: true,
  },
];

const STATUS_OPTIONS: ServiceQualityStatus[] = [
  'Mới',
  'Đang thực hiện',
  'Hoàn thành',
  'Dừng',
];

const CALL_RESULT_OPTIONS: ServiceQualityCallResult[] = [
  'Từ chối',
  'Gọi lần 1',
  'Gọi lần 2',
  'Gọi lần 3',
  'Không nghe máy',
];

interface ServiceQualityEvaluationModalProps {
  record: PotentialCustomerItem;
  roDateInfo: {
    receiveDate: string;
    promisedDate: string;
    actualDate: string;
    daysAfterDeliveryLabel: string;
  };
  activeTab: 'activity_history' | 'history' | 'tasks';
  setActiveTab: (tab: 'activity_history' | 'history' | 'tasks') => void;
  activityHistory: ActivityItem[];
  internalNotes: HistoryItem[];
  tasks: TaskItem[];
  noteContent: string;
  setNoteContent: (val: string) => void;
  onSaveNote: () => void;
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
  onSaveEvaluation: (
    recordId: string,
    evaluationData: ServiceQualityEvaluationData,
    summaryText: string,
    hasRedFlag: boolean
  ) => void;
  onUpdateRecordField: (
    recordId: string,
    updates: Partial<PotentialCustomerItem>
  ) => void;
  onClose: () => void;
}

const buildEmptyAnswers = (
  existing?: Record<string, EvaluationQuestionAnswer>
): Record<string, EvaluationQuestionAnswer> => {
  const result: Record<string, EvaluationQuestionAnswer> = {};
  SERVICE_QUALITY_QUESTIONS.forEach((q) => {
    const prev = existing?.[q.id];
    result[q.id] = {
      selectedOptions: prev?.selectedOptions ? [...prev.selectedOptions] : [],
      note: prev?.note || '',
    };
  });
  return result;
};

export const ServiceQualityEvaluationModal: React.FC<
  ServiceQualityEvaluationModalProps
> = ({
  record,
  roDateInfo,
  activeTab,
  setActiveTab,
  activityHistory,
  internalNotes,
  tasks,
  noteContent,
  setNoteContent,
  onSaveNote,
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
  onSaveEvaluation,
  onUpdateRecordField,
  onClose,
}) => {
  const [answers, setAnswers] = useState<Record<string, EvaluationQuestionAnswer>>(
    () => buildEmptyAnswers(record.evaluationSurvey?.answers)
  );
  const [savedTimeLabel, setSavedTimeLabel] = useState<string>(
    record.evaluationSurvey?.updatedAt || ''
  );
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    setAnswers(buildEmptyAnswers(record.evaluationSurvey?.answers));
    setSavedTimeLabel(record.evaluationSurvey?.updatedAt || '');
    setIsDirty(false);
  }, [record.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleToggleOption = (
    question: EvaluationQuestionConfig,
    optionLabel: string
  ) => {
    setAnswers((prev) => {
      const current = prev[question.id] || { selectedOptions: [], note: '' };
      const exists = current.selectedOptions.includes(optionLabel);
      let nextSelected: string[];
      if (question.selectionMode === 'single') {
        nextSelected = exists ? [] : [optionLabel];
      } else {
        nextSelected = exists
          ? current.selectedOptions.filter((o) => o !== optionLabel)
          : [...current.selectedOptions, optionLabel];
      }
      return {
        ...prev,
        [question.id]: {
          ...current,
          selectedOptions: nextSelected,
        },
      };
    });
    setIsDirty(true);
  };

  const handleNoteChange = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const current = prev[questionId] || { selectedOptions: [], note: '' };
      return {
        ...prev,
        [questionId]: {
          ...current,
          note: value,
        },
      };
    });
    setIsDirty(true);
  };

  const { answeredCount, redFlagCount } = useMemo(() => {
    let answered = 0;
    let redFlags = 0;
    SERVICE_QUALITY_QUESTIONS.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) return;
      if (ans.selectedOptions.length > 0 || ans.note.trim().length > 0) {
        answered += 1;
      }
      q.options.forEach((opt) => {
        if (opt.isRedFlag && ans.selectedOptions.includes(opt.label)) {
          redFlags += 1;
        }
      });
    });
    return { answeredCount: answered, redFlagCount: redFlags };
  }, [answers]);

  const handleSave = () => {
    const nowLabel = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const summaryLines: string[] = [];
    SERVICE_QUALITY_QUESTIONS.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) return;
      if (ans.selectedOptions.length > 0 || ans.note.trim()) {
        const picked =
          ans.selectedOptions.length > 0 ? ans.selectedOptions.join(', ') : '(Chưa tick)';
        const notePart = ans.note.trim() ? ` — Ghi chú: ${ans.note.trim()}` : '';
        summaryLines.push(`${q.index}. ${q.category}: ${picked}${notePart}`);
      }
    });

    const summaryText =
      summaryLines.length > 0
        ? summaryLines.join('\n')
        : 'Cập nhật phiếu đánh giá chất lượng dịch vụ.';

    onSaveEvaluation(
      record.id,
      {
        answers,
        updatedAt: nowLabel,
        updatedBy: 'quych@pbsofu.vn',
      },
      summaryText,
      redFlagCount > 0
    );
    setSavedTimeLabel(nowLabel);
    setIsDirty(false);
  };

  const categoryQuestions = SERVICE_QUALITY_QUESTIONS.slice(0, 6);
  const selfAssessmentQuestion = SERVICE_QUALITY_QUESTIONS[6];
  const uncompletedTasksCount = tasks.filter((t) => !t.completed).length;
  const vehicleDisplay = [record.carBrand, record.carModel].filter(Boolean).join(' - ') || '-';
  const advisorDisplay = record.serviceAdvisor || record.createdBy || '-';

  return (
    <div className="fixed inset-0 z-[150] w-screen h-screen bg-slate-100 flex flex-col overflow-hidden text-slate-900">
      {/* Top Action Bar */}
      <header className="h-11 px-4 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <h2 className="text-[15px] font-bold text-slate-900 whitespace-nowrap shrink-0">
            Đánh giá chất lượng dịch vụ
          </h2>
          <span className="text-slate-300 select-none" aria-hidden="true">
            ·
          </span>
          <span className="text-[13px] font-mono font-bold text-[#1A73E8] whitespace-nowrap shrink-0">
            {record.originalRoCode || record.code}
          </span>
          <span className="text-slate-300 select-none" aria-hidden="true">
            ·
          </span>
          <span className="text-[13px] font-semibold text-slate-700 truncate">
            {record.fullName} ({record.licensePlate || 'Chưa có BSX'})
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {redFlagCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 tabular-nums">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              Cờ đỏ: {redFlagCount}
            </span>
          )}
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap shrink-0 tabular-nums">
            Đã ghi nhận <strong className="text-slate-900">{answeredCount}/7</strong> câu
          </span>
          {savedTimeLabel && !isDirty && (
            <span className="text-xs text-emerald-700 font-medium whitespace-nowrap shrink-0 tabular-nums">
              Đã lưu {savedTimeLabel}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1A73E8] hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isDirty ? 'Lưu đánh giá *' : 'Lưu đánh giá'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Đóng (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Đóng</span>
          </button>
        </div>
      </header>

      {/* KHU VỰC (1): THÔNG TIN CHUNG CỦA RECORD */}
      <section className="px-4 py-2 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-6 gap-x-4 gap-y-1.5">
          {/* Row 1 */}
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Khách hàng
            </div>
            <div className="text-[13px] font-bold text-slate-900 truncate" title={record.fullName}>
              {record.fullName}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Số điện thoại
            </div>
            <div className="text-[13px] font-bold text-[#1A73E8] tabular-nums truncate">
              {record.phone || '-'}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Biển số xe · Dòng xe
            </div>
            <div className="text-[13px] font-bold text-slate-900 truncate" title={`${record.licensePlate || '-'} · ${vehicleDisplay}`}>
              <span className="tabular-nums">{record.licensePlate || '-'}</span>
              <span className="text-slate-400 font-normal mx-1">·</span>
              <span className="font-semibold text-slate-700">{vehicleDisplay}</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Mã RO
            </div>
            <div className="text-[13px] font-mono font-bold text-slate-900 truncate">
              {record.originalRoCode || record.code || '-'}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Cố vấn dịch vụ
            </div>
            <div className="text-[13px] font-semibold text-slate-900 truncate" title={advisorDisplay}>
              {advisorDisplay}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Doanh thu RO
            </div>
            <div className="text-[13px] font-bold text-slate-900 tabular-nums truncate">
              {record.originalRoRevenue || '-'}
            </div>
          </div>

          {/* Row 2 */}
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Ngày nhận xe
            </div>
            <div className="text-[12.5px] font-semibold text-slate-800 tabular-nums truncate">
              {roDateInfo.receiveDate}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Ngày hẹn giao
            </div>
            <div className="text-[12.5px] font-semibold text-slate-800 tabular-nums truncate">
              {roDateInfo.promisedDate}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Ngày bàn giao thực tế
            </div>
            <div className="text-[12.5px] font-semibold text-slate-800 tabular-nums truncate">
              {roDateInfo.actualDate}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 leading-none mb-0.5">
              Số ngày sau bàn giao
            </div>
            <div className="text-[12.5px] font-bold text-slate-900 tabular-nums truncate">
              {roDateInfo.daysAfterDeliveryLabel}
            </div>
          </div>
          <div className="min-w-0 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap shrink-0">
              Trạng thái:
            </span>
            <select
              value={
                STATUS_OPTIONS.includes(record.status as ServiceQualityStatus)
                  ? record.status
                  : 'Mới'
              }
              onChange={(e) =>
                onUpdateRecordField(record.id, {
                  status: e.target.value as ServiceQualityStatus,
                })
              }
              className="flex-1 min-w-0 h-7 px-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded outline-none focus:border-[#1A73E8] cursor-pointer"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap shrink-0">
              Kết quả gọi:
            </span>
            <select
              value={
                CALL_RESULT_OPTIONS.includes(
                  record.callResult as ServiceQualityCallResult
                )
                  ? record.callResult
                  : 'Gọi lần 1'
              }
              onChange={(e) =>
                onUpdateRecordField(record.id, {
                  callResult: e.target.value as ServiceQualityCallResult,
                  callStatus: 'Đã gọi',
                })
              }
              className="flex-1 min-w-0 h-7 px-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded outline-none focus:border-[#1A73E8] cursor-pointer"
            >
              {CALL_RESULT_OPTIONS.map((res) => (
                <option key={res} value={res}>
                  {res}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* MAIN BODY: KHU VỰC (2) [LEFT/CENTER] + KHU VỰC (3) [RIGHT] */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* KHU VỰC (2): DANH SÁCH 7 CÂU HỎI HIỂN THỊ ĐỒNG LOẠT TRÊN 1 MÀN HÌNH */}
        <main className="flex-1 min-w-0 min-h-0 p-2.5 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 grid grid-cols-3 grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 overflow-hidden">
            {categoryQuestions.map((q) => {
              const ans = answers[q.id] || { selectedOptions: [], note: '' };
              const hasQuestionRedFlag = q.options.some(
                (o) => o.isRedFlag && ans.selectedOptions.includes(o.label)
              );
              const isAnswered =
                ans.selectedOptions.length > 0 || ans.note.trim().length > 0;

              return (
                <article
                  key={q.id}
                  className={`bg-white rounded-lg border px-3 py-2 flex flex-col justify-between gap-1.5 min-h-0 overflow-hidden transition-colors ${
                    hasQuestionRedFlag
                      ? 'border-red-300 bg-red-50/15'
                      : isAnswered
                      ? 'border-blue-300'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top: Title + Pure Question + CSKH Script */}
                  <div className="flex flex-col gap-1 min-h-0">
                    <div className="flex items-center justify-between gap-2 shrink-0">
                      <h3 className="text-[13px] xl:text-[14px] font-bold text-slate-900 leading-tight truncate">
                        {q.index}. {q.category}
                      </h3>
                      {hasQuestionRedFlag && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 whitespace-nowrap shrink-0">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          Cờ đỏ
                        </span>
                      )}
                    </div>

                    {q.pureQuestion && (
                      <p className="text-[11px] xl:text-[11.5px] text-slate-600 leading-[1.3]">
                        <span className="font-semibold text-slate-700">Thuần túy:</span>{' '}
                        {q.pureQuestion}
                      </p>
                    )}

                    <p className="text-[12px] xl:text-[13px] font-semibold text-[#0F294A] bg-blue-50/75 border border-blue-100 rounded-md px-2 py-1 leading-[1.32]">
                      <span className="text-[#1A73E8] font-bold">CSKH:</span>{' '}
                      {q.cskhQuestion}
                    </p>
                  </div>

                  {/* Middle: Tick nhanh options */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <div className="text-[10.5px] font-semibold text-slate-500 leading-none">
                      {q.tickLabel}:
                    </div>
                    <div className="flex flex-wrap gap-1 xl:gap-1.5">
                      {q.options.map((opt) => {
                        const checked = ans.selectedOptions.includes(opt.label);
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => handleToggleOption(q, opt.label)}
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[11.5px] xl:text-[12px] font-medium leading-tight transition-colors cursor-pointer text-left ${
                              checked
                                ? opt.isRedFlag
                                  ? 'bg-red-600 border-red-600 text-white font-semibold'
                                  : 'bg-[#1A73E8] border-[#1A73E8] text-white font-semibold'
                                : opt.isRedFlag
                                ? 'bg-red-50/60 border-red-200 text-red-800 hover:bg-red-50 hover:border-red-400'
                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-blue-50/50 hover:border-[#1A73E8]'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center shrink-0 ${
                                checked
                                  ? 'bg-white/20 border-white text-white'
                                  : opt.isRedFlag
                                  ? 'bg-white border-red-300'
                                  : 'bg-white border-slate-300'
                              }`}
                            >
                              {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom: Ghi chú input */}
                  <div className="shrink-0">
                    <input
                      type="text"
                      value={ans.note}
                      onChange={(e) => handleNoteChange(q.id, e.target.value)}
                      placeholder={`Ghi chú: ${q.notePlaceholder}`}
                      className="w-full h-7 xl:h-8 px-2.5 text-[11.5px] xl:text-[12px] text-slate-800 placeholder:text-slate-400 bg-slate-50/80 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-[#1A73E8] transition-colors"
                    />
                  </div>
                </article>
              );
            })}

            {/* Row 3 (Full Width): Câu 7 - Phần Chăm sóc khách hàng tự cảm nhận (1 câu) */}
            {(() => {
              const q = selfAssessmentQuestion;
              const ans = answers[q.id] || { selectedOptions: [], note: '' };
              const hasSelfRedFlag = q.options.some(
                (o) => o.isRedFlag && ans.selectedOptions.includes(o.label)
              );
              const isAnswered =
                ans.selectedOptions.length > 0 || ans.note.trim().length > 0;

              return (
                <article
                  className={`col-span-3 bg-white rounded-lg border px-3.5 py-2 flex flex-col gap-1.5 shrink-0 transition-colors ${
                    hasSelfRedFlag
                      ? 'border-red-300 bg-red-50/15'
                      : isAnswered
                      ? 'border-blue-300'
                      : 'border-slate-300'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <div className="flex items-baseline gap-2 min-w-0 flex-1">
                      <h3 className="text-[13.5px] xl:text-[14px] font-bold text-slate-900 whitespace-nowrap shrink-0">
                        {q.category}:
                      </h3>
                      <p className="text-[12.5px] xl:text-[13px] font-semibold text-[#0F294A] leading-snug">
                        {q.cskhQuestion}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap shrink-0">
                      {q.tickLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {q.options.map((opt) => {
                      const checked = ans.selectedOptions.includes(opt.label);
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleToggleOption(q, opt.label)}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-[12px] xl:text-[12.5px] font-medium leading-tight transition-colors cursor-pointer text-left ${
                            checked
                              ? opt.isRedFlag
                                ? 'bg-red-600 border-red-600 text-white font-semibold'
                                : 'bg-[#1A73E8] border-[#1A73E8] text-white font-semibold'
                              : opt.isRedFlag
                              ? 'bg-red-50/60 border-red-200 text-red-800 hover:bg-red-50 hover:border-red-400'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-blue-50/50 hover:border-[#1A73E8]'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              checked
                                ? 'border-white bg-white/20'
                                : opt.isRedFlag
                                ? 'border-red-400 bg-white'
                                : 'border-slate-400 bg-white'
                            }`}
                          >
                            {checked && (
                              <span className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </span>
                          <span className="truncate">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={ans.note}
                      onChange={(e) => handleNoteChange(q.id, e.target.value)}
                      placeholder={`Ghi chú: ${q.notePlaceholder}`}
                      className="w-full h-7 xl:h-8 px-2.5 text-[12px] text-slate-800 placeholder:text-slate-400 bg-slate-50/80 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-[#1A73E8] transition-colors"
                    />
                  </div>
                </article>
              );
            })()}
          </div>
        </main>

        {/* KHU VỰC (3): TAB LỊCH SỬ, GHI CHÚ NỘI BỘ, LỜI NHẮC & CÔNG VIỆC */}
        <aside className="w-[340px] xl:w-[375px] 2xl:w-[405px] shrink-0 bg-white border-l border-slate-200 flex flex-col min-h-0 overflow-hidden">
          <div className="px-2.5 pt-2 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('activity_history')}
              className={`pb-2 pt-1.5 px-1.5 text-[12px] font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'activity_history'
                  ? 'border-[#1A73E8] text-[#1A73E8]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Lịch sử
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`pb-2 pt-1.5 px-1.5 text-[12px] font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'history'
                  ? 'border-[#1A73E8] text-[#1A73E8]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Ghi chú nội bộ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={`pb-2 pt-1.5 px-1.5 text-[12px] font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'tasks'
                  ? 'border-[#1A73E8] text-[#1A73E8]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Lời nhắc &amp; Công việc ({uncompletedTasksCount})
            </button>
          </div>

          <div className="flex-1 min-h-0 p-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {activeTab === 'activity_history' && (
              <div>
                {activityHistory.length === 0 ? (
                  <div className="text-xs text-slate-500 py-8 text-center">
                    Chưa có dữ liệu lịch sử hoạt động
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {activityHistory.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900 leading-snug">
                            {item.action}
                          </span>
                          <span className="text-[11px] text-slate-500 whitespace-nowrap shrink-0 tabular-nums">
                            {item.timestamp}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#1A73E8] font-medium mb-1">
                          {item.author}
                        </div>
                        <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="flex flex-col gap-3">
                <div>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Thêm ghi chú nội bộ..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-none focus:border-[#1A73E8] resize-none mb-2"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onSaveNote}
                      disabled={!noteContent.trim()}
                      className="px-3.5 py-1.5 bg-[#1A73E8] hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      Lưu ghi chú
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    Danh sách ghi chú nội bộ
                  </h4>
                  {internalNotes.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      Chưa có ghi chú nội bộ
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {internalNotes.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-semibold text-[#1A73E8] truncate">
                              {item.author}
                            </span>
                            <span className="text-[11px] text-slate-500 whitespace-nowrap shrink-0 tabular-nums">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-2">
                    Lời nhắc &amp; Công việc
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={taskContent}
                      onChange={(e) => setTaskContent(e.target.value)}
                      placeholder="Thêm lời nhắc mới..."
                      className="flex-1 min-w-0 h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-none focus:border-[#1A73E8]"
                      onKeyDown={(e) => e.key === 'Enter' && onAddTask()}
                    />
                    <button
                      type="button"
                      onClick={onAddTask}
                      disabled={!taskContent.trim()}
                      className="px-3 h-8 bg-[#1A73E8] hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {tasks.length === 0 ? (
                  <div className="text-xs text-slate-500 py-6 text-center">
                    Chưa có lời nhắc &amp; công việc
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${
                          task.completed
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleTask(task.id)}
                          className="mt-0.5 w-4 h-4 text-[#1A73E8] border-slate-300 rounded focus:ring-[#1A73E8] cursor-pointer shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          {editingTaskId === task.id ? (
                            <div className="flex flex-col gap-1.5">
                              <input
                                type="text"
                                value={editTaskContent}
                                onChange={(e) => setEditTaskContent(e.target.value)}
                                className="w-full h-7 px-2 text-xs bg-white border border-slate-300 rounded outline-none focus:border-[#1A73E8]"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') onSaveEditTask();
                                  if (e.key === 'Escape') onCancelEditTask();
                                }}
                              />
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={onSaveEditTask}
                                  disabled={!editTaskContent.trim()}
                                  className="text-[11px] font-semibold px-2.5 py-1 bg-[#1A73E8] text-white rounded hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer"
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={onCancelEditTask}
                                  className="text-[11px] font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between gap-1.5">
                                <p
                                  className={`text-xs leading-snug break-words ${
                                    task.completed
                                      ? 'text-slate-400 line-through'
                                      : 'text-slate-800 font-medium'
                                  }`}
                                >
                                  {task.content}
                                </p>
                                {!task.completed && (
                                  <button
                                    type="button"
                                    onClick={() => onStartEditTask(task)}
                                    className="text-slate-400 hover:text-[#1A73E8] transition-colors shrink-0 cursor-pointer"
                                    title="Chỉnh sửa lời nhắc"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-2 mt-1 text-[11px] text-slate-500">
                                <span className="truncate font-medium text-[#1A73E8]">
                                  {task.author}
                                </span>
                                <span className="whitespace-nowrap shrink-0 tabular-nums">
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
        </aside>
      </div>
    </div>
  );
};
