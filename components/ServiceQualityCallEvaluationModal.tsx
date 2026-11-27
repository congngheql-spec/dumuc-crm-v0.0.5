import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  X,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Eye,
  EyeOff,
} from 'lucide-react';
import { auth } from '../firebase';
import type {
  PotentialCustomerItem,
  ServiceQualityCallResult,
  ServiceQualityStatus,
} from './ServiceQualityModule';
import type { HistoryItem, TaskItem, ActivityItem } from './EventsModule';

export interface SurveyQuestionAnswer {
  selected: string[];
  note: string;
}

export interface ServiceQualitySurveyData {
  answers: Record<string, SurveyQuestionAnswer>;
  updatedAt?: string;
}

interface SurveyQuestionDef {
  id: string;
  order: number;
  category: string;
  questionLabel: string;
  question: string;
  cskhQuestion?: string;
  tickLabel: string;
  selectionMode: 'single' | 'multi';
  options: string[];
  isFullWidth?: boolean;
}

export const SERVICE_QUALITY_SURVEY_QUESTIONS: SurveyQuestionDef[] = [
  {
    id: 'repair_quality',
    order: 1,
    category: 'Chất lượng sửa chữa',
    questionLabel: 'Câu hỏi',
    question:
      'Xe của anh/chị từ lúc hoàn tất sửa chữa đến nay có vận hành ổn định và có phát sinh vấn đề gì mới không?',
    cskhQuestion:
      'Từ hôm lấy xe về tới nay, anh/chị chạy thấy ổn định hay vấn đề gì mới không ạ?',
    tickLabel: 'Tick nhanh',
    selectionMode: 'multi',
    options: ['Ổn định', 'Có phát sinh', 'Chưa đi nhiều nên chưa rõ'],
  },
  {
    id: 'quote_transparency',
    order: 2,
    category: 'Minh bạch và tuân thủ quy trình báo giá',
    questionLabel: 'Câu hỏi',
    question:
      'Cố vấn dịch vụ của garage có báo giá minh bạch và giải thích rõ ràng từng hạng mục trước khi thực hiện không?',
    cskhQuestion:
      'Hôm đó bạn cố vấn dịch vụ có báo giá rõ ràng và giải thích kỹ từng mục trước khi làm cho anh/chị không ạ?',
    tickLabel: 'Tick nhanh',
    selectionMode: 'multi',
    options: [
      'Báo giá rõ ràng',
      'Giải thích chưa dễ hiểu',
      'Có phát sinh hạng mục nhưng chưa báo trước',
    ],
  },
  {
    id: 'payment_documents',
    order: 3,
    category: 'Thanh toán và chứng từ',
    questionLabel: 'Câu hỏi',
    question:
      'Anh/chị đã nhận đầy đủ hóa đơn điện tử và giấy tờ liên quan cho các hạng mục đã thực hiện tại garage chưa?',
    cskhQuestion:
      'Anh/chị kiểm tra giúp em xem mình đã nhận đủ hóa đơn điện tử và giấy tờ các hạng mục vừa làm chưa ạ?',
    tickLabel: 'Tick nhanh',
    selectionMode: 'multi',
    options: [
      'Đã nhận đầy đủ',
      'Chưa nhận hóa đơn điện tử',
      'Khách không có nhu cầu lấy hóa đơn',
    ],
  },
  {
    id: 'time_commitment',
    order: 4,
    category: 'Cam kết thời gian',
    questionLabel: 'Câu hỏi thuần túy',
    question:
      'Garage có bàn giao xe cho anh/chị đúng với thời gian đã hẹn ban đầu hay không?',
    cskhQuestion:
      'Hôm vừa rồi xưởng giao xe cho anh/chị có đúng giờ hẹn ban đầu không, hay bị trễ hơn dự kiến ạ?',
    tickLabel: 'Tick nhanh',
    selectionMode: 'multi',
    options: [
      'Đúng giờ hoặc sớm hơn hẹn',
      'Trễ hẹn (có báo trước)',
      'Trễ hẹn (không báo trước)',
    ],
  },
  {
    id: 'priority_improvement',
    order: 5,
    category: 'Cải thiện ưu tiên số 1 hiện tại của garage',
    questionLabel: 'Câu hỏi',
    question:
      'Anh/chị mong muốn garage ưu tiên cải thiện yếu tố nào nhất trong lần phục vụ tiếp theo?',
    cskhQuestion:
      'Nếu chọn 1 điểm để xưởng làm tốt hơn ở lần sau, anh/chị muốn tụi em cải thiện điều gì nhất ạ — ví dụ về tư vấn, kỹ thuật hay phòng chờ?',
    tickLabel: 'Tick nhanh',
    selectionMode: 'multi',
    options: [
      'Hài lòng, không cần cải thiện',
      'Về dịch vụ',
      'Về KTV',
      'Về Cố vấn dịch vụ',
      'Về thanh toán',
      'Về giá',
      'Về cơ sở vật chất tại xưởng',
    ],
  },
  {
    id: 'extended_utilities',
    order: 6,
    category: 'Mong muốn mở rộng tiện ích',
    questionLabel: 'Câu hỏi',
    question:
      'Anh/chị có nhu cầu sử dụng thêm tiện ích mở rộng nào từ garage trong thời gian tới không?',
    cskhQuestion:
      'Nếu sắp tới xưởng mở thêm tiện ích như làm ngoài giờ, làm Chủ Nhật, giao nhận xe tận nhà, cứu hộ hay hỗ trợ đăng kiểm thì anh/chị thấy cái nào tiện cho mình nhất ạ?',
    tickLabel: 'Tick nhanh (chọn nhiều)',
    selectionMode: 'multi',
    options: [
      'Làm ngoài giờ',
      'Làm Chủ Nhật',
      'Giao nhận xe tận nhà',
      'Cứu hộ',
      'Hỗ trợ đăng kiểm',
      'Chưa có nhu cầu',
    ],
  },
  {
    id: 'cskh_feeling',
    order: 7,
    category: 'Chăm sóc khách hàng tự cảm nhận về Khách hàng',
    questionLabel: 'Câu hỏi',
    question:
      'Qua giọng điệu và cách trả lời của khách hàng trong cuộc gọi, bạn cảm nhận mức độ hài lòng thực tế của khách hàng đối với lần làm xe này như thế nào?',
    tickLabel: 'Tick nhanh (chọn 1)',
    selectionMode: 'single',
    options: [
      'Rất thoải mái, thiện cảm cao',
      'Bình thường, trả lời ngắn gọn',
      'Có vẻ còn lăn tăn, ngại nói thẳng',
      'Bức xúc, có nguy cơ không quay lại',
    ],
    isFullWidth: true,
  },
];

const CALL_RESULTS_LIST: ServiceQualityCallResult[] = [
  'Từ chối',
  'Gọi lần 1',
  'Gọi lần 2',
  'Gọi lần 3',
  'Không nghe máy',
];

const STATUS_LIST: ServiceQualityStatus[] = [
  'Mới',
  'Đang thực hiện',
  'Hoàn thành',
  'Dừng',
];

const normalizeCallResultValue = (val?: string): ServiceQualityCallResult => {
  if (val && (CALL_RESULTS_LIST as string[]).includes(val)) {
    return val as ServiceQualityCallResult;
  }
  if (val === 'Không liên hệ được lần 1') return 'Gọi lần 1';
  if (val === 'Không liên hệ được lần 2') return 'Gọi lần 2';
  if (val === 'Không liên hệ được lần 3') return 'Gọi lần 3';
  if (val === 'Sai số điện thoại') return 'Không nghe máy';
  return 'Gọi lần 1';
};

const normalizeStatusValue = (val?: string): ServiceQualityStatus => {
  if (val && (STATUS_LIST as string[]).includes(val)) {
    return val as ServiceQualityStatus;
  }
  if (val === 'Đang theo dõi') return 'Đang thực hiện';
  if (val === 'Khách hàng đã đặt lịch') return 'Hoàn thành';
  if (val === 'Khách hàng từ chối') return 'Dừng';
  return 'Mới';
};

const extractLast5PlateDigits = (plate?: string): string => {
  if (!plate) return '[5 số cuối biển số]';
  const digits = plate.replace(/[^\d]/g, '');
  if (digits.length >= 5) {
    const last5 = digits.slice(-5);
    return `${last5.slice(0, 3)}.${last5.slice(3)}`;
  }
  return plate;
};

const formatWeekdayAndDate = (dateStr?: string): string => {
  if (!dateStr) return '[Thứ/Ngày]';
  const match = dateStr.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return dateStr;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  const dt = new Date(year, month - 1, day);
  if (isNaN(dt.getTime())) return dateStr;
  const weekdays = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  return `${weekdays[dt.getDay()]} (${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')})`;
};

const createEmptyAnswers = (): Record<string, SurveyQuestionAnswer> => {
  const map: Record<string, SurveyQuestionAnswer> = {};
  SERVICE_QUALITY_SURVEY_QUESTIONS.forEach((q) => {
    map[q.id] = { selected: [], note: '' };
  });
  return map;
};

const mergeWithInitialSurvey = (
  existing?: ServiceQualitySurveyData
): Record<string, SurveyQuestionAnswer> => {
  const base = createEmptyAnswers();
  if (!existing?.answers) return base;
  SERVICE_QUALITY_SURVEY_QUESTIONS.forEach((q) => {
    const saved = existing.answers[q.id];
    if (saved) {
      base[q.id] = {
        selected: Array.isArray(saved.selected) ? [...saved.selected] : [],
        note: typeof saved.note === 'string' ? saved.note : '',
      };
    }
  });
  return base;
};

interface ServiceQualityCallEvaluationModalProps {
  record: PotentialCustomerItem;
  onClose: () => void;
  onCallStatusChange: (
    id: string,
    newStatus: PotentialCustomerItem['callStatus']
  ) => void;
  onCallResultChange: (
    id: string,
    newResult: PotentialCustomerItem['callResult']
  ) => void;
  onStatusChange: (
    id: string,
    newStatus: ServiceQualityStatus
  ) => void;
  onSaveSurvey: (
    id: string,
    surveyData: ServiceQualitySurveyData,
    logActivity?: boolean
  ) => void;
  activeTab: 'activity_history' | 'history' | 'tasks';
  setActiveTab: (tab: 'activity_history' | 'history' | 'tasks') => void;
  activities: ActivityItem[];
  notes: HistoryItem[];
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
}

export const ServiceQualityCallEvaluationModal: React.FC<
  ServiceQualityCallEvaluationModalProps
> = ({
  record,
  onClose,
  onCallStatusChange,
  onCallResultChange,
  onStatusChange,
  onSaveSurvey,
  activeTab,
  setActiveTab,
  activities,
  notes,
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
}) => {
  const [answers, setAnswers] = useState<Record<string, SurveyQuestionAnswer>>(
    () => mergeWithInitialSurvey(record.serviceQualitySurvey)
  );
  const [savedNotice, setSavedNotice] = useState<string>('');
  const [showCskhSuggestion, setShowCskhSuggestion] = useState<boolean>(true);

  // Pagination states for Zone (3) to ensure ZERO vertical scrollbars
  const [activityPage, setActivityPage] = useState<number>(1);
  const [notePage, setNotePage] = useState<number>(1);
  const [taskPage, setTaskPage] = useState<number>(1);

  // Refs for dynamic max-fit typography scaling (largest possible legible size with zero overflow/clipping)
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const zone2Ref = useRef<HTMLElement>(null);
  const zone2ContentRef = useRef<HTMLDivElement>(null);
  const zone3TabsRef = useRef<HTMLDivElement>(null);
  const zone3BodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnswers(mergeWithInitialSurvey(record.serviceQualitySurvey));
    setShowCskhSuggestion(true);
    setActivityPage(1);
    setNotePage(1);
    setTaskPage(1);
  }, [record.id]);

  // Dynamically compute the LARGEST base font size that fits 100% of Zone (1) and (2)
  // on a single screen with ZERO horizontal/vertical scrollbars, ZERO clipping, and ZERO overlap,
  // then independently guarantee Zone (3) tabs and body fit cleanly without shrinking Zone (2).
  useLayoutEffect(() => {
    const modalEl = modalRef.current;
    const headerEl = headerRef.current;
    const zone2El = zone2Ref.current;
    const zone2ContentEl = zone2ContentRef.current;
    const zone3TabsEl = zone3TabsRef.current;
    const zone3BodyEl = zone3BodyRef.current;
    if (!modalEl || !headerEl || !zone2El || !zone2ContentEl) return;

    const fitToViewport = () => {
      if (zone3TabsEl) zone3TabsEl.style.fontSize = '';
      if (zone3BodyEl) zone3BodyEl.style.fontSize = '';

      let lo = 8.5;
      let hi = showCskhSuggestion ? 22 : 26;

      const fitsAt = (sizePx: number): boolean => {
        modalEl.style.fontSize = `${sizePx}px`;
        headerEl.style.fontSize = `${Math.min(sizePx, 15)}px`;
        const z2HeightOk = zone2ContentEl.offsetHeight <= zone2El.clientHeight;
        const z2WidthOk = zone2ContentEl.scrollWidth <= zone2El.clientWidth + 1;
        const headerWidthOk = headerEl.scrollWidth <= headerEl.clientWidth + 1;
        return z2HeightOk && z2WidthOk && headerWidthOk;
      };

      let finalSize = hi;
      if (!fitsAt(hi)) {
        for (let i = 0; i < 12; i++) {
          const mid = (lo + hi) / 2;
          if (fitsAt(mid)) {
            lo = mid;
          } else {
            hi = mid;
          }
        }
        finalSize = Math.max(8.5, Math.floor((lo - 0.12) * 10) / 10);
      }
      modalEl.style.fontSize = `${finalSize}px`;
      headerEl.style.fontSize = `${Math.min(finalSize, 15)}px`;

      // Independently ensure Zone (3) tabs never overflow horizontally
      if (zone3TabsEl && zone3TabsEl.scrollWidth > zone3TabsEl.clientWidth + 1) {
        const ratio = (zone3TabsEl.clientWidth / zone3TabsEl.scrollWidth) * 0.96;
        zone3TabsEl.style.fontSize = `${Math.max(10, Math.floor(finalSize * ratio * 10) / 10)}px`;
      }

      // Independently ensure Zone (3) body never overflows vertically
      if (zone3BodyEl && zone3BodyEl.scrollHeight > zone3BodyEl.clientHeight + 1) {
        const ratio = (zone3BodyEl.clientHeight / zone3BodyEl.scrollHeight) * 0.96;
        zone3BodyEl.style.fontSize = `${Math.max(10, Math.floor(finalSize * ratio * 10) / 10)}px`;
      }
    };

    fitToViewport();

    const ro = new ResizeObserver(() => {
      fitToViewport();
    });
    ro.observe(modalEl);

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        fitToViewport();
      });
    }

    return () => {
      ro.disconnect();
    };
  }, [
    record.id,
    savedNotice,
    showCskhSuggestion,
    activeTab,
    activities.length,
    notes.length,
    tasks.length,
    editingTaskId,
  ]);

  const cskhAgentName =
    auth.currentUser?.displayName ||
    (auth.currentUser?.email ? auth.currentUser.email.split('@')[0] : '') ||
    'CSKH';

  const customerDisplayName = record.fullName || '[Tên khách]';
  const garageDisplayName = record.garageName || 'Ô tô Du Mục';
  const last5Plate = extractLast5PlateDigits(record.licensePlate);
  const serviceLabel =
    record.demands && record.demands.length > 0
      ? record.demands[0].toLowerCase()
      : 'bảo dưỡng / làm dịch vụ';
  const deliveryDayLabel = formatWeekdayAndDate(
    record.actualDeliveryDate || record.endDate || record.registrationDate
  );

  const persistAnswers = (
    nextAnswers: Record<string, SurveyQuestionAnswer>,
    logActivity = false
  ) => {
    const timestamp = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    onSaveSurvey(
      record.id,
      {
        answers: nextAnswers,
        updatedAt: timestamp,
      },
      logActivity
    );
    if (logActivity) {
      setSavedNotice(`Đã lưu lúc ${timestamp.slice(0, 5)}`);
    }
  };

  const handleToggleOption = (
    question: SurveyQuestionDef,
    option: string
  ) => {
    setAnswers((prev) => {
      const current = prev[question.id] || { selected: [], note: '' };
      let nextSelected: string[];
      if (question.selectionMode === 'single') {
        nextSelected = current.selected.includes(option) ? [] : [option];
      } else {
        nextSelected = current.selected.includes(option)
          ? current.selected.filter((item) => item !== option)
          : [...current.selected, option];
      }
      const nextAnswers = {
        ...prev,
        [question.id]: {
          ...current,
          selected: nextSelected,
        },
      };
      persistAnswers(nextAnswers, false);
      return nextAnswers;
    });
  };

  const handleNoteChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { selected: [], note: '' }),
        note: value,
      },
    }));
  };

  const handleNoteBlur = () => {
    persistAnswers(answers, false);
  };

  const handleExplicitSave = () => {
    persistAnswers(answers, true);
  };

  const handleCloseModal = () => {
    persistAnswers(answers, false);
    onClose();
  };

  const normalizedCallResult = normalizeCallResultValue(record.callResult);
  const normalizedStatus = normalizeStatusValue(record.status);
  const incompleteTasksCount = tasks.filter((t) => !t.completed).length;

  // Pagination helpers for Zone (3) (sized so large font never overflows vertically)
  const ACTIVITY_PAGE_SIZE = 4;
  const NOTE_PAGE_SIZE = 3;
  const TASK_PAGE_SIZE = 4;

  const totalActivityPages = Math.max(
    1,
    Math.ceil(activities.length / ACTIVITY_PAGE_SIZE)
  );
  const safeActivityPage = Math.min(activityPage, totalActivityPages);
  const visibleActivities = activities.slice(
    (safeActivityPage - 1) * ACTIVITY_PAGE_SIZE,
    safeActivityPage * ACTIVITY_PAGE_SIZE
  );

  const totalNotePages = Math.max(1, Math.ceil(notes.length / NOTE_PAGE_SIZE));
  const safeNotePage = Math.min(notePage, totalNotePages);
  const visibleNotes = notes.slice(
    (safeNotePage - 1) * NOTE_PAGE_SIZE,
    safeNotePage * NOTE_PAGE_SIZE
  );

  const totalTaskPages = Math.max(1, Math.ceil(tasks.length / TASK_PAGE_SIZE));
  const safeTaskPage = Math.min(taskPage, totalTaskPages);
  const visibleTasks = tasks.slice(
    (safeTaskPage - 1) * TASK_PAGE_SIZE,
    safeTaskPage * TASK_PAGE_SIZE
  );

  const gridQuestions = SERVICE_QUALITY_SURVEY_QUESTIONS.filter(
    (q) => !q.isFullWidth
  );
  const feelingQuestion = SERVICE_QUALITY_SURVEY_QUESTIONS.find(
    (q) => q.isFullWidth
  );

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[150] w-screen h-screen bg-slate-100 flex flex-col overflow-hidden font-sans text-slate-900"
    >
      {/* ================================================================= */}
      {/* KHU VỰC (1): THÔNG TIN CHUNG CỦA RECORD & TRẠNG THÁI CUỘC GỌI     */}
      {/* ================================================================= */}
      <header
        ref={headerRef}
        className="bg-white border-b border-slate-300 px-[1em] py-[0.45em] shrink-0 overflow-hidden"
      >
        {/* Dòng 1: Thông tin khách hàng, xe, RO & nút thao tác */}
        <div className="flex items-center justify-between gap-[0.8em] min-w-0">
          <div className="flex items-center flex-wrap gap-x-[0.55em] gap-y-[0.15em] min-w-0 flex-1 leading-tight">
            <span className="text-[1.12em] font-bold text-slate-950 whitespace-nowrap">
              {record.fullName || '-'}
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="text-[1.12em] font-bold text-[#1A73E8] tabular-nums whitespace-nowrap">
              {record.phone || 'Chưa có SĐT'}
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="text-[1.04em] font-bold text-slate-900 tabular-nums whitespace-nowrap">
              {record.licensePlate || '-'}
            </span>
            <span className="text-[0.95em] text-slate-700 whitespace-nowrap">
              {[record.carBrand, record.carModel].filter(Boolean).join(' - ') ||
                '-'}
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="text-[0.98em] font-bold text-slate-900 tabular-nums whitespace-nowrap">
              RO: {record.originalRoCode || record.code || '-'}
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="text-[0.95em] text-slate-700 whitespace-nowrap">
              CVDV:{' '}
              <strong className="font-semibold text-slate-950">
                {record.serviceAdvisor || '-'}
              </strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="text-[0.95em] text-slate-700 tabular-nums whitespace-nowrap">
              Giao xe:{' '}
              <strong className="font-semibold text-slate-950">
                {record.actualDeliveryDate || record.endDate || '-'}
              </strong>
            </span>
            <span className="text-slate-300 hidden xl:inline" aria-hidden="true">
              ·
            </span>
            <span className="text-[0.95em] text-slate-700 tabular-nums whitespace-nowrap hidden xl:inline">
              Doanh thu:{' '}
              <strong className="font-semibold text-slate-950">
                {record.originalRoRevenue || '-'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-[0.5em] shrink-0">
            {savedNotice && (
              <span className="text-[0.88em] font-semibold text-emerald-700 whitespace-nowrap flex items-center gap-[0.25em]">
                <Check className="w-[1em] h-[1em]" />
                {savedNotice}
              </span>
            )}
            <button
              type="button"
              onClick={handleExplicitSave}
              className="inline-flex items-center gap-[0.35em] px-[0.9em] py-[0.4em] bg-[#1A73E8] hover:bg-blue-700 text-white text-[0.92em] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Save className="w-[1em] h-[1em]" />
              <span>Lưu đánh giá</span>
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="inline-flex items-center gap-[0.3em] px-[0.8em] py-[0.4em] bg-slate-100 hover:bg-slate-200 text-slate-800 text-[0.92em] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Đóng"
            >
              <X className="w-[1.05em] h-[1.05em]" />
              <span>Đóng</span>
            </button>
          </div>
        </div>

        {/* Dòng 2: Trạng thái cuộc gọi, Kết quả cuộc gọi, Trạng thái */}
        <div className="mt-[0.4em] pt-[0.4em] border-t border-slate-100 flex items-center justify-between gap-[0.8em] min-w-0">
          <div className="flex items-center flex-wrap gap-x-[1.1em] gap-y-[0.3em] min-w-0">
            {/* Trạng thái cuộc gọi */}
            <div className="flex items-center gap-[0.45em] shrink-0">
              <label
                htmlFor="sq-eval-call-status"
                className="text-[0.95em] font-bold text-slate-800 whitespace-nowrap"
              >
                Trạng thái cuộc gọi:
              </label>
              <select
                id="sq-eval-call-status"
                value={record.callStatus || 'Chưa gọi'}
                onChange={(e) =>
                  onCallStatusChange(
                    record.id,
                    e.target.value as PotentialCustomerItem['callStatus']
                  )
                }
                className={`h-[2.1em] px-[0.65em] text-[0.95em] font-bold rounded-md border outline-none cursor-pointer transition-colors ${
                  record.callStatus === 'Đã gọi'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:border-emerald-500'
                    : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-[#1A73E8]'
                }`}
              >
                <option value="Chưa gọi">Chưa gọi</option>
                <option value="Đã gọi">Đã gọi</option>
              </select>
            </div>

            {/* Kết quả cuộc gọi */}
            <div className="flex items-center gap-[0.45em] shrink-0">
              <label
                htmlFor="sq-eval-call-result"
                className="text-[0.95em] font-bold text-slate-800 whitespace-nowrap"
              >
                Kết quả cuộc gọi:
              </label>
              <select
                id="sq-eval-call-result"
                value={normalizedCallResult}
                onChange={(e) =>
                  onCallResultChange(
                    record.id,
                    e.target.value as ServiceQualityCallResult
                  )
                }
                className={`h-[2.1em] px-[0.65em] text-[0.95em] font-bold rounded-md border outline-none cursor-pointer transition-colors ${
                  normalizedCallResult === 'Từ chối'
                    ? 'bg-red-50 text-red-700 border-red-300 focus:border-red-500'
                    : normalizedCallResult === 'Không nghe máy'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 focus:border-amber-500'
                    : 'bg-blue-50 text-blue-800 border-blue-300 focus:border-[#1A73E8]'
                }`}
              >
                {CALL_RESULTS_LIST.map((res) => (
                  <option key={res} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </div>

            {/* Trạng thái */}
            <div className="flex items-center gap-[0.45em] shrink-0">
              <label
                htmlFor="sq-eval-status"
                className="text-[0.95em] font-bold text-slate-800 whitespace-nowrap"
              >
                Trạng thái:
              </label>
              <select
                id="sq-eval-status"
                value={normalizedStatus}
                onChange={(e) =>
                  onStatusChange(
                    record.id,
                    e.target.value as ServiceQualityStatus
                  )
                }
                className={`h-[2.1em] px-[0.65em] text-[0.95em] font-bold rounded-md border outline-none cursor-pointer transition-colors ${
                  normalizedStatus === 'Hoàn thành'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:border-emerald-500'
                    : normalizedStatus === 'Đang thực hiện'
                    ? 'bg-blue-50 text-blue-800 border-blue-300 focus:border-[#1A73E8]'
                    : normalizedStatus === 'Dừng'
                    ? 'bg-red-50 text-red-700 border-red-300 focus:border-red-500'
                    : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-[#1A73E8]'
                }`}
              >
                {STATUS_LIST.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút nổi bật: Hiện / Ẩn gợi ý cách hỏi */}
            <button
              type="button"
              onClick={() => setShowCskhSuggestion((prev) => !prev)}
              className={`h-[2.2em] px-[0.95em] inline-flex items-center gap-[0.45em] text-[0.95em] font-extrabold rounded-md border-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                showCskhSuggestion
                  ? 'bg-[#0F294A] hover:bg-slate-800 text-white border-[#0F294A]'
                  : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
              }`}
            >
              {showCskhSuggestion ? (
                <>
                  <EyeOff className="w-[1.1em] h-[1.1em] shrink-0" />
                  <span>Ẩn gợi ý cách hỏi</span>
                </>
              ) : (
                <>
                  <Eye className="w-[1.1em] h-[1.1em] shrink-0" />
                  <span>Hiện gợi ý cách hỏi</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[0.92em] text-slate-700 whitespace-nowrap shrink-0 hidden lg:block">
            Xưởng:{' '}
            <span className="font-bold text-slate-900">
              {record.garageName || '-'}
            </span>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* PHẦN THÂN CHÍNH: KHU VỰC (2) BÊN TRÁI + KHU VỰC (3) BÊN PHẢI      */}
      {/* ================================================================= */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* =============================================================== */}
        {/* KHU VỰC (2): DANH SÁCH CÂU HỎI & GHI NHẬN ĐỒNG LOẠT 1 MÀN HÌNH  */}
        {/* =============================================================== */}
        <section
          ref={zone2Ref}
          className="flex-1 min-w-0 h-full overflow-hidden bg-slate-100 flex flex-col justify-center"
        >
          <div
            ref={zone2ContentRef}
            className="w-full p-[0.55em] flex flex-col gap-[0.45em]"
          >
            {/* Câu mở đầu dành cho CSKH */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-[0.85em] py-[0.45em]">
              <p className="text-[1.03em] leading-[1.35] text-slate-950">
                <span className="font-bold text-[#0F4C81] mr-[0.4em]">
                  CSKH · Mở đầu:
                </span>
                &ldquo;Dạ em chào anh/chị{' '}
                <strong className="text-[#0F4C81]">{customerDisplayName}</strong>,
                em là <strong className="text-[#0F4C81]">{cskhAgentName}</strong>{' '}
                bên Chăm sóc khách hàng Garage{' '}
                <strong className="text-[#0F4C81]">{garageDisplayName}</strong> ạ.
                Em gọi hỏi thăm chiếc{' '}
                <strong className="text-[#0F4C81] tabular-nums">
                  {last5Plate}
                </strong>{' '}
                mình mới{' '}
                <strong className="text-[#0F4C81]">{serviceLabel}</strong> hôm{' '}
                <strong className="text-[#0F4C81]">{deliveryDayLabel}</strong> xem
                mấy hôm nay chạy có ổn không. Em xin anh/chị khoảng 1 phút được
                không ạ?&rdquo;
              </p>
            </div>

            {/* Danh sách toàn bộ 7 hạng mục câu hỏi dạng chiều ngang hoàn toàn (mỗi câu 1 hàng ngang trọn vẹn) */}
            <div className="flex flex-col gap-[0.38em]">
              {gridQuestions.map((q) => {
                const ans = answers[q.id] || { selected: [], note: '' };
                return (
                  <div
                    key={q.id}
                    className="w-full bg-white border border-slate-300 rounded-lg overflow-hidden flex items-stretch"
                  >
                    {/* 1. Câu hỏi thứ mấy + Hạng mục (Cột tiêu đề bên trái của hàng ngang) */}
                    <div className="w-[15%] min-w-[10.5em] max-w-[14.5em] shrink-0 px-[0.65em] py-[0.35em] bg-slate-100 border-r border-slate-200 flex flex-col justify-center gap-[0.22em]">
                      <span className="self-start inline-flex items-center justify-center px-[0.55em] py-[0.08em] rounded bg-[#0F294A] text-white text-[0.88em] font-extrabold tracking-wide tabular-nums shrink-0">
                        Câu {q.order}
                      </span>
                      <h3 className="text-[0.98em] font-bold text-slate-950 leading-[1.2]">
                        {q.category}
                      </h3>
                    </div>

                    {/* Phần nội dung ngang bên phải: Hàng trên (Câu hỏi | CSKH hỏi) + Hàng dưới (Tick nhanh | Ghi chú) */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      {/* 2. Câu hỏi & 3. CSKH hỏi (Hiển thị ngang tách bạch, nổi bật rõ ràng) */}
                      <div
                        className={`px-[0.5em] py-[0.28em] grid gap-[0.45em] items-stretch ${
                          showCskhSuggestion && q.cskhQuestion
                            ? 'grid-cols-2'
                            : 'grid-cols-1'
                        }`}
                      >
                        {/* 2. Câu hỏi (Nổi bật, tách bạch rõ ràng) */}
                        <div className="px-[0.6em] py-[0.28em] rounded-md bg-[#FEF3C7] border-2 border-[#D97706] shadow-2xs flex items-center">
                          <p
                            className={
                              showCskhSuggestion
                                ? 'text-[0.94em] font-bold text-[#451A03] leading-[1.26]'
                                : 'text-[1.02em] font-bold text-[#451A03] leading-[1.3]'
                            }
                          >
                            <span className="inline-block px-[0.42em] py-[0.05em] mr-[0.38em] rounded bg-[#B45309] text-white text-[0.84em] font-extrabold tracking-wide align-baseline">
                              {q.questionLabel}
                            </span>
                            {q.question}
                          </p>
                        </div>

                        {/* 3. CSKH hỏi (Hiển thị mặc định, nổi bật và tách bạch rõ ràng) */}
                        {showCskhSuggestion && q.cskhQuestion && (
                          <div className="px-[0.6em] py-[0.28em] rounded-md bg-[#DBEAFE] border-2 border-[#2563EB] shadow-2xs flex items-center">
                            <p className="text-[0.98em] font-bold text-[#0C2D57] leading-[1.26]">
                              <span className="inline-block px-[0.42em] py-[0.05em] mr-[0.38em] rounded bg-[#1D4ED8] text-white text-[0.85em] font-extrabold tracking-wide align-baseline">
                                CSKH hỏi
                              </span>
                              &ldquo;{q.cskhQuestion}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 4. Tick nhanh & 5. Ghi chú (Cùng nằm trên 1 hàng ngang) */}
                      <div className="px-[0.65em] py-[0.26em] bg-white border-t border-slate-200/80 flex items-center justify-between gap-[0.65em]">
                        {/* 4. Tick nhanh */}
                        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-[0.75em] gap-y-[0.18em]">
                          <span className="text-[0.88em] font-extrabold text-emerald-800 shrink-0">
                            {q.tickLabel}:
                          </span>
                          {q.options.map((option) => {
                            const checked = ans.selected.includes(option);
                            return (
                              <label
                                key={option}
                                className={`inline-flex items-center gap-[0.32em] cursor-pointer select-none text-[0.95em] leading-[1.22] transition-colors ${
                                  checked
                                    ? 'text-[#1A73E8] font-bold'
                                    : 'text-slate-900 hover:text-slate-950 font-semibold'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => handleToggleOption(q, option)}
                                  className="w-[1.04em] h-[1.04em] rounded border-slate-400 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer shrink-0"
                                />
                                <span>{option}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* 5. Ghi chú */}
                        <div className="w-[26%] min-w-[12.5em] max-w-[20em] shrink-0 pl-[0.6em] border-l border-slate-200 flex items-center gap-[0.4em]">
                          <span className="text-[0.86em] font-bold text-slate-600 shrink-0">
                            Ghi chú:
                          </span>
                          <input
                            type="text"
                            value={ans.note}
                            onChange={(e) => handleNoteChange(q.id, e.target.value)}
                            onBlur={handleNoteBlur}
                            placeholder="Ghi nhận thêm chi tiết..."
                            className="flex-1 min-w-0 h-[1.85em] px-[0.5em] text-[0.9em] text-slate-950 bg-slate-50 focus:bg-white border border-slate-300 rounded focus:border-[#1A73E8] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Hạng mục 7 (Chiều ngang hoàn toàn): Chăm sóc khách hàng tự cảm nhận về Khách hàng */}
              {feelingQuestion && (() => {
                const ans = answers[feelingQuestion.id] || {
                  selected: [],
                  note: '',
                };
                return (
                  <div className="w-full bg-amber-50/70 border border-amber-300/80 rounded-lg px-[0.85em] py-[0.45em] flex flex-col gap-[0.32em]">
                    <div className="text-[1.02em] leading-[1.3]">
                      <span className="font-bold text-slate-950">
                        {feelingQuestion.order}. {feelingQuestion.category}:
                      </span>{' '}
                      <span className="text-slate-800 font-semibold">
                        {feelingQuestion.question}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-[0.8em] flex-wrap">
                      <div className="flex items-center flex-wrap gap-x-[0.95em] gap-y-[0.22em]">
                        <span className="text-[0.92em] font-bold text-slate-800 shrink-0">
                          {feelingQuestion.tickLabel}:
                        </span>
                        {feelingQuestion.options.map((option) => {
                          const checked = ans.selected.includes(option);
                          return (
                            <label
                              key={option}
                              className={`inline-flex items-center gap-[0.35em] cursor-pointer select-none text-[0.98em] leading-[1.25] transition-colors ${
                                checked
                                  ? 'text-[#1A73E8] font-bold'
                                  : 'text-slate-900 hover:text-slate-950 font-semibold'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  handleToggleOption(feelingQuestion, option)
                                }
                                className="w-[1.08em] h-[1.08em] rounded border-slate-400 text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer shrink-0"
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-[0.45em] min-w-[16em] flex-1 max-w-[26em]">
                        <span className="text-[0.9em] font-semibold text-slate-700 shrink-0">
                          Ghi chú:
                        </span>
                        <input
                          type="text"
                          value={ans.note}
                          onChange={(e) =>
                            handleNoteChange(feelingQuestion.id, e.target.value)
                          }
                          onBlur={handleNoteBlur}
                          placeholder="Ghi chú cảm nhận..."
                          className="flex-1 h-[2em] px-[0.55em] text-[0.92em] text-slate-950 bg-white border border-amber-300 rounded focus:border-[#1A73E8] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* KHU VỰC (3): TAB LỊCH SỬ, GHI CHÚ NỘI BỘ, LỜI NHẮC & CÔNG VIỆC  */}
        {/* =============================================================== */}
        <aside className="w-[24%] min-w-[280px] max-w-[420px] h-full bg-white border-l border-slate-300 flex flex-col overflow-hidden">
          {/* Thanh Tab */}
          <div className="px-[0.65em] pt-[0.55em] border-b border-slate-200 bg-slate-50/70 shrink-0">
            <div
              ref={zone3TabsRef}
              className="flex items-center justify-between gap-[0.45em]"
            >
              <button
                type="button"
                onClick={() => setActiveTab('activity_history')}
                className={`pb-[0.55em] text-[0.88em] font-bold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
                className={`pb-[0.55em] text-[0.88em] font-bold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
                className={`pb-[0.55em] text-[0.88em] font-bold border-b-2 transition-colors flex items-center gap-[0.3em] whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'tasks'
                    ? 'border-[#1A73E8] text-[#1A73E8]'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Lời nhắc &amp; Công việc</span>
                <span className="text-[0.82em] font-bold text-amber-800 bg-amber-100 px-[0.4em] py-[0.05em] rounded tabular-nums">
                  {incompleteTasksCount}
                </span>
              </button>
            </div>
          </div>

          {/* Nội dung Tab (Không dùng thanh cuộn dọc/ngang; có phân trang gọn khi nhiều dòng) */}
          <div
            ref={zone3BodyRef}
            className="flex-1 min-h-0 p-[0.7em] flex flex-col overflow-hidden"
          >
            {/* TAB 1: Lịch sử */}
            {activeTab === 'activity_history' && (
              <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
                {activities.length === 0 ? (
                  <div className="text-[0.95em] text-slate-500 py-[2em] text-center">
                    Chưa có dữ liệu lịch sử hoạt động
                  </div>
                ) : (
                  <div className="space-y-[0.5em] overflow-hidden">
                    {visibleActivities.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50/80 p-[0.65em] rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center justify-between gap-[0.4em] mb-[0.2em]">
                          <span className="text-[0.92em] font-bold text-slate-900 truncate">
                            {item.action}
                          </span>
                          <span className="text-[0.8em] text-slate-500 tabular-nums shrink-0">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-[0.88em] text-slate-700 leading-[1.3] line-clamp-2 whitespace-pre-wrap">
                          {item.content}
                        </p>
                        <div className="mt-[0.25em] text-[0.8em] text-blue-700 font-semibold truncate">
                          {item.author}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {totalActivityPages > 1 && (
                  <div className="pt-[0.5em] mt-[0.5em] border-t border-slate-100 flex items-center justify-between text-[0.86em] text-slate-600 shrink-0">
                    <span className="tabular-nums">
                      Trang {safeActivityPage}/{totalActivityPages} ({activities.length})
                    </span>
                    <div className="flex items-center gap-[0.3em]">
                      <button
                        type="button"
                        disabled={safeActivityPage <= 1}
                        onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                        className="p-[0.25em] rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        aria-label="Trang trước"
                      >
                        <ChevronLeft className="w-[1em] h-[1em]" />
                      </button>
                      <button
                        type="button"
                        disabled={safeActivityPage >= totalActivityPages}
                        onClick={() =>
                          setActivityPage((p) =>
                            Math.min(totalActivityPages, p + 1)
                          )
                        }
                        className="p-[0.25em] rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        aria-label="Trang sau"
                      >
                        <ChevronRight className="w-[1em] h-[1em]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Ghi chú nội bộ */}
            {activeTab === 'history' && (
              <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
                <div className="flex flex-col min-h-0 overflow-hidden">
                  <div className="mb-[0.65em] shrink-0">
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Thêm ghi chú nội bộ..."
                      rows={2}
                      className="w-full px-[0.65em] py-[0.45em] bg-white border border-slate-300 rounded-lg text-[0.94em] text-slate-900 focus:outline-none focus:border-[#1A73E8] resize-none"
                    />
                    <div className="flex justify-end mt-[0.35em]">
                      <button
                        type="button"
                        onClick={() => {
                          onSaveNote();
                          setNotePage(1);
                        }}
                        disabled={!noteContent.trim()}
                        className="px-[0.85em] py-[0.35em] bg-[#1A73E8] hover:bg-blue-700 disabled:bg-blue-300 text-white text-[0.88em] font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        Lưu ghi chú
                      </button>
                    </div>
                  </div>

                  <div className="text-[0.88em] font-bold text-slate-700 mb-[0.45em] shrink-0">
                    Danh sách ghi chú ({notes.length})
                  </div>

                  {notes.length === 0 ? (
                    <div className="text-[0.95em] text-slate-500 py-[1em] text-center">
                      Chưa có ghi chú nội bộ
                    </div>
                  ) : (
                    <div className="space-y-[0.5em] overflow-hidden">
                      {visibleNotes.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-50/80 p-[0.65em] rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center justify-between gap-[0.4em] mb-[0.2em]">
                            <span className="text-[0.84em] font-bold text-blue-700 truncate">
                              {item.author}
                            </span>
                            <span className="text-[0.8em] text-slate-500 tabular-nums shrink-0">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-[0.92em] text-slate-800 leading-[1.3] line-clamp-2 whitespace-pre-wrap">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {totalNotePages > 1 && (
                  <div className="pt-[0.5em] mt-[0.5em] border-t border-slate-100 flex items-center justify-between text-[0.86em] text-slate-600 shrink-0">
                    <span className="tabular-nums">
                      Trang {safeNotePage}/{totalNotePages} ({notes.length})
                    </span>
                    <div className="flex items-center gap-[0.3em]">
                      <button
                        type="button"
                        disabled={safeNotePage <= 1}
                        onClick={() => setNotePage((p) => Math.max(1, p - 1))}
                        className="p-[0.25em] rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        aria-label="Trang trước"
                      >
                        <ChevronLeft className="w-[1em] h-[1em]" />
                      </button>
                      <button
                        type="button"
                        disabled={safeNotePage >= totalNotePages}
                        onClick={() =>
                          setNotePage((p) => Math.min(totalNotePages, p + 1))
                        }
                        className="p-[0.25em] rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        aria-label="Trang sau"
                      >
                        <ChevronRight className="w-[1em] h-[1em]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Lời nhắc & Công việc */}
            {activeTab === 'tasks' && (
              <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
                <div className="flex flex-col min-h-0 overflow-hidden">
                  <div className="flex gap-[0.4em] mb-[0.65em] shrink-0">
                    <input
                      type="text"
                      value={taskContent}
                      onChange={(e) => setTaskContent(e.target.value)}
                      placeholder="Thêm lời nhắc mới..."
                      className="flex-1 min-w-0 h-[2.2em] px-[0.65em] bg-white border border-slate-300 rounded-md text-[0.94em] text-slate-900 focus:outline-none focus:border-[#1A73E8]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && taskContent.trim()) {
                          onAddTask();
                          setTaskPage(1);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onAddTask();
                        setTaskPage(1);
                      }}
                      disabled={!taskContent.trim()}
                      className="px-[0.85em] h-[2.2em] bg-[#1A73E8] hover:bg-blue-700 disabled:bg-blue-300 text-white text-[0.9em] font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>

                  {tasks.length === 0 ? (
                    <div className="text-[0.95em] text-slate-500 py-[1.5em] text-center">
                      Chưa có lời nhắc &amp; công việc
                    </div>
                  ) : (
                    <div className="space-y-[0.5em] overflow-hidden">
                      {visibleTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-start gap-[0.55em] p-[0.65em] rounded-lg border ${
                            task.completed
                              ? 'bg-slate-50 border-slate-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggleTask(task.id)}
                            className="mt-[0.15em] w-[1.1em] h-[1.1em] text-[#1A73E8] border-slate-300 rounded focus:ring-[#1A73E8] cursor-pointer shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            {editingTaskId === task.id ? (
                              <div className="flex flex-col gap-[0.4em]">
                                <input
                                  type="text"
                                  value={editTaskContent}
                                  onChange={(e) =>
                                    setEditTaskContent(e.target.value)
                                  }
                                  className="w-full px-[0.55em] py-[0.3em] text-[0.92em] bg-white border border-slate-300 rounded focus:outline-none focus:border-[#1A73E8]"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') onSaveEditTask();
                                    if (e.key === 'Escape') onCancelEditTask();
                                  }}
                                />
                                <div className="flex items-center gap-[0.4em]">
                                  <button
                                    type="button"
                                    onClick={onSaveEditTask}
                                    disabled={!editTaskContent.trim()}
                                    className="text-[0.85em] px-[0.65em] py-[0.25em] bg-[#1A73E8] text-white rounded hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer"
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    type="button"
                                    onClick={onCancelEditTask}
                                    className="text-[0.85em] px-[0.65em] py-[0.25em] bg-slate-100 text-slate-700 rounded hover:bg-slate-200 cursor-pointer"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-[0.4em]">
                                  <p
                                    className={`text-[0.94em] leading-[1.3] line-clamp-2 ${
                                      task.completed
                                        ? 'text-slate-400 line-through'
                                        : 'text-slate-900 font-semibold'
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
                                      <Pencil className="w-[1em] h-[1em]" />
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center justify-between gap-[0.4em] mt-[0.25em] text-[0.8em]">
                                  <span className="text-blue-700 font-semibold truncate">
                                    {task.author}
                                  </span>
                                  <span className="text-slate-400 tabular-nums shrink-0">
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

                {totalTaskPages > 1 && (
                  <div className="pt-[0.5em] mt-[0.5em] border-t border-slate-100 flex items-center justify-between text-[0.86em] text-slate-600 shrink-0">
                    <span className="tabular-nums">
                      Trang {safeTaskPage}/{totalTaskPages} ({tasks.length})
                    </span>
                    <div className="flex items-center gap-[0.3em]">
                      <button
                        type="button"
                        disabled={safeTaskPage <= 1}
                        onClick={() => setTaskPage((p) => Math.max(1, p - 1))}
                        className="p-[0.25em] rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        aria-label="Trang trước"
                      >
                        <ChevronLeft className="w-[1em] h-[1em]" />
                      </button>
                      <button
                        type="button"
                        disabled={safeTaskPage >= totalTaskPages}
                        onClick={() =>
                          setTaskPage((p) => Math.min(totalTaskPages, p + 1))
                        }
                        className="p-[0.25em] rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        aria-label="Trang sau"
                      >
                        <ChevronRight className="w-[1em] h-[1em]" />
                      </button>
                    </div>
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
