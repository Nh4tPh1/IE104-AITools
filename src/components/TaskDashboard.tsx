'use client';

import React, { useState } from 'react';

export interface TaskItemData {
  id: string;
  title: string;
  is_done: boolean;
  score: number;
  duration: number;
  keywords: string[];
  rubric: string;
}

const initialTasks: TaskItemData[] = [
  {
    id: '1',
    title: 'So sánh cơ chế lưu trữ trình duyệt & XSS',
    is_done: false,
    score: 3.5,
    duration: 90,
    keywords: ['Cơ chế lưu trữ', 'Lifespan', 'Dung lượng ~4KB vs 5MB', 'HttpOnly, XSS'],
    rubric: 'Nêu rõ Cookie gửi tự động kèm request HTTP (~4KB). LocalStorage lưu trữ vĩnh viễn (~5MB). Không lưu JWT trong LocalStorage vì nguy cơ XSS.',
  },
  {
    id: '2',
    title: 'Giải thích nguyên lý Virtual DOM trong React và cách tối ưu re-render',
    is_done: true,
    score: 3.5,
    duration: 90,
    keywords: ['Virtual DOM', 'Reconciliation', 'Memoization'],
    rubric: 'Trình bày đúng cơ chế Diffing algorithm và cách sử dụng useMemo, useCallback để tránh re-render thừa.',
  },
];

export default function TaskDashboard() {
  // State danh sách công việc / câu hỏi
  const [tasks, setTasks] = useState<TaskItemData[]>(initialTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // State thêm mới
  const [newTitle, setNewTitle] = useState('');
  const [addError, setAddError] = useState('');

  // State chỉnh sửa
  const [editingId, setEditingId] = useState<string | null>('1');
  const [editTitle, setEditTitle] = useState('');
  const [editError, setEditError] = useState('');

  // Form cấu hình bài tập chung
  const [examTitle, setExamTitle] = useState('Kiểm tra Vấn đáp Giữa kỳ: Kiến trúc Web Frontend hiện đại');
  const [deadline, setDeadline] = useState('23:59 - 25/11/2026');
  const [maxRetakes, setMaxRetakes] = useState('3');

  // 1. Thêm mới có validate 1-120 ký tự sau trim
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (trimmed.length < 1 || trimmed.length > 120) {
      setAddError('Tên câu hỏi/công việc sau khi cắt khoảng trắng phải dài từ 1–120 ký tự.');
      return;
    }

    const newTask: TaskItemData = {
      id: Date.now().toString(),
      title: trimmed,
      is_done: false,
      score: 3.0,
      duration: 90,
      keywords: ['Thuật ngữ cốt lõi'],
      rubric: 'Hướng dẫn chấm cho câu hỏi mới...',
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setAddError('');
    setEditingId(newTask.id);
  };

  // 2. Toggle hoàn thành
  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, is_done: !t.is_done } : t)));
  };

  // 3. Xóa có xác nhận (confirm)
  const handleDeleteTask = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${title}"?`)) {
      setTasks(tasks.filter((t) => t.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  // 4. Bắt đầu sửa
  const handleStartEdit = (task: TaskItemData) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditError('');
  };

  // 5. Lưu sửa
  const handleSaveEdit = (id: string) => {
    const trimmed = editTitle.trim();
    if (trimmed.length < 1 || trimmed.length > 120) {
      setEditError('Tên phải từ 1–120 ký tự.');
      return;
    }

    setTasks(tasks.map((t) => (t.id === id ? { ...t, title: trimmed } : t)));
    setEditError('');
  };

  // Lọc
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.is_done;
    if (filter === 'completed') return t.is_done;
    return true;
  });

  const totalScore = tasks.reduce((sum, item) => sum + item.score, 0);

  return (
    <div className="bg-[#f9f9ff] text-[#111c2d] min-h-screen flex flex-col font-sans antialiased">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40 bg-white border-b border-[#c7c4d7] shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#4338ca] text-white flex items-center justify-center font-bold text-lg">
              🎙️
            </div>
            <span className="text-lg font-bold text-[#2a14b4] tracking-tight">OralEval IE104</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-[#464554]">
            <a href="#" className="hover:text-[#2a14b4] transition-colors">Cohorts</a>
            <a href="#" className="hover:text-[#2a14b4] transition-colors">Assessments</a>
            <a href="#" className="hover:text-[#2a14b4] transition-colors">Analytics</a>
            <a href="#" className="hover:text-[#2a14b4] transition-colors">Rubrics</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded bg-[#dee8ff] text-[#2a14b4] font-semibold border border-[#c7c4d7]/70">
            Dữ liệu tạm (Lab 1)
          </span>
          <div className="w-8 h-8 rounded-full bg-[#4338ca] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-[#dee8ff]">
            SJ
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex flex-1 w-full min-h-[calc(100vh-64px)]">
        {/* SIDEBAR BÊN TRÁI */}
        <aside className="w-64 h-full flex flex-col justify-between p-4 border-r border-[#c7c4d7] bg-white shrink-0 hidden lg:flex sticky top-16" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 px-2 pt-1">
              <div className="w-9 h-9 rounded-lg bg-[#dee8ff] flex items-center justify-center text-[#2a14b4] font-bold">
                🏛️
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#2a14b4] leading-tight">OralEval IE104</span>
                <span className="text-[11px] text-[#464554]">Higher Ed Assessment</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#4338ca] text-white text-xs font-semibold hover:bg-[#2a14b4] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2a14b4]"
            >
              + New Assessment
            </button>

            <nav className="flex flex-col gap-1 text-xs font-medium text-[#464554]">
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f3ff]">
                <span>📊</span> Dashboard
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f3ff]">
                <span>🎙️</span> Active Exams
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#dee8ff] text-[#2a14b4] font-bold">
                <span>📝</span> Question Builder
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f3ff]">
                <span>✅</span> Evaluation Hub
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f3ff]">
                <span>🎓</span> Gradebook
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-1 pt-3 border-t border-[#c7c4d7] text-xs text-[#464554]">
            <a href="#" className="flex items-center gap-2 px-2 py-1.5 hover:text-[#2a14b4]">
              <span>📖</span> Documentation
            </a>
            <a href="#" className="flex items-center gap-2 px-2 py-1.5 hover:text-[#2a14b4]">
              <span>⚙️</span> Settings
            </a>
          </div>
        </aside>

        {/* WORKSPACE CHÍNH */}
        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-6 border-b border-[#c7c4d7] gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs text-[#464554] mb-1">
                <span>Lớp IE104.N21</span>
                <span>&gt;</span>
                <span className="text-[#2a14b4] font-semibold">Tạo bài kiểm tra vấn đáp mới</span>
              </nav>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-[#111c2d]">Cấu hình Đề thi &amp; Danh sách việc học</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#dee8ff] text-[#2a14b4] border border-[#c7c4d7] font-semibold">
                  Module 2.4 - Giảng viên
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end md:self-auto">
              <button
                type="button"
                className="px-3.5 py-2 rounded-lg border border-[#c7c4d7] bg-white text-xs font-semibold hover:bg-[#f0f3ff] focus:outline-none focus:ring-2 focus:ring-[#2a14b4]"
              >
                💾 Lưu nháp
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[#4338ca] text-white text-xs font-semibold hover:bg-[#2a14b4] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2a14b4]"
              >
                🚀 Xuất bản bài tập
              </button>
            </div>
          </div>

          {/* BENTO ARCHITECTURE (8/4 COLS) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* CỘT TRÁI (8 COLS) */}
            <div className="xl:col-span-8 space-y-6">
              {/* PHẦN 1: THÔNG TIN BÀI TẬP */}
              <section className="bg-white border border-[#c7c4d7] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#c7c4d7]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#2a14b4]">⚙️️</span>
                    <h2 className="text-sm font-bold text-[#111c2d]">Phần 1: Thông tin chung bài tập</h2>
                  </div>
                  <span className="text-[11px] text-[#464554]">Bắt buộc thiết lập</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label htmlFor="assignment-title" className="block font-semibold mb-1">
                      Tên bài tập vấn đáp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="assignment-title"
                      type="text"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-[#c7c4d7] bg-white text-xs outline-none focus:border-[#2a14b4] focus:ring-2 focus:ring-[#2a14b4]/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="deadline-input" className="block font-semibold mb-1">
                        Hạn nộp (Deadline) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="deadline-input"
                        type="text"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#c7c4d7] bg-white text-xs font-mono outline-none focus:border-[#2a14b4]"
                      />
                    </div>
                    <div>
                      <label htmlFor="retakes-select" className="block font-semibold mb-1">
                        Số lần sinh viên được ghi âm lại
                      </label>
                      <select
                        id="retakes-select"
                        value={maxRetakes}
                        onChange={(e) => setMaxRetakes(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#c7c4d7] bg-white text-xs outline-none focus:border-[#2a14b4]"
                      >
                        <option value="1">1 lần (Nghiêm ngặt)</option>
                        <option value="2">2 lần</option>
                        <option value="3">3 lần (Khuyên dùng)</option>
                        <option value="5">5 lần</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* PHẦN 2: DANH SÁCH CÂU HỎI VẤN ĐÁP (CRUD THEO PROMPT) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#2a14b4]">📋</span>
                    <h2 className="text-sm font-bold text-[#111c2d]">Phần 2: Danh sách câu hỏi vấn đáp</h2>
                  </div>

                  {/* BỘ LỌC 3 TRẠNG THÁI */}
                  <div className="flex items-center p-1 rounded-lg bg-[#f0f3ff] border border-[#c7c4d7] text-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#2a14b4] ${
                        filter === 'all' ? 'bg-white text-[#2a14b4] shadow-sm' : 'text-[#464554]'
                      }`}
                    >
                      Tất cả ({tasks.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilter('pending')}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#2a14b4] ${
                        filter === 'pending' ? 'bg-white text-[#2a14b4] shadow-sm' : 'text-[#464554]'
                      }`}
                    >
                      Chưa xong ({tasks.filter((t) => !t.is_done).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilter('completed')}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#2a14b4] ${
                        filter === 'completed' ? 'bg-white text-[#2a14b4] shadow-sm' : 'text-[#464554]'
                      }`}
                    >
                      Đã xong ({tasks.filter((t) => t.is_done).length})
                    </button>
                  </div>
                </div>

                {/* FORM THÊM MỚI (VALIDATE 1–120 KÝ TỰ, BÁO LỖI SÁT Ô NHẬP) */}
                <form onSubmit={handleAddTask} className="p-4 rounded-xl border-2 border-dashed border-[#c7c4d7] bg-white space-y-2">
                  <label htmlFor="new-task-input" className="block text-xs font-bold text-[#111c2d]">
                    Thêm câu hỏi / công việc mới <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="new-task-input"
                      type="text"
                      value={newTitle}
                      onChange={(e) => {
                        setNewTitle(e.target.value);
                        if (addError) setAddError('');
                      }}
                      placeholder="Nhập tên câu hỏi hoặc việc cần làm (1–120 ký tự)..."
                      className={`flex-1 px-3.5 py-2.5 rounded-lg border bg-[#f9f9ff] text-xs outline-none transition-colors ${
                        addError ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-[#c7c4d7] focus:border-[#2a14b4] focus:ring-2 focus:ring-[#2a14b4]/20'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#4338ca] text-white text-xs font-semibold hover:bg-[#2a14b4] shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2a14b4]"
                    >
                      + Thêm công việc
                    </button>
                  </div>
                  {addError && <p className="text-[11px] text-red-600 font-medium pl-1">{addError}</p>}
                </form>

                {/* TRẠNG THÁI RỖNG (EMPTY STATE) */}
                {filteredTasks.length === 0 ? (
                  <div className="p-8 text-center rounded-xl border-2 border-dashed border-[#c7c4d7] bg-white">
                    <p className="text-xs text-gray-500 font-semibold">Chưa có công việc nào trong danh mục này.</p>
                    <p className="text-[11px] text-gray-400 mt-1">Hãy thêm câu hỏi mới vào form phía trên!</p>
                  </div>
                ) : (
                  filteredTasks.map((task, index) => {
                    const isExpanded = editingId === task.id;

                    return (
                      <article
                        key={task.id}
                        data-testid="task-item"
                        className={`bg-white rounded-xl shadow-sm transition-all overflow-hidden border ${
                          isExpanded ? 'border-2 border-[#2a14b4]/60' : 'border-[#c7c4d7]'
                        }`}
                      >
                        {/* Header Thẻ */}
                        <div className="bg-[#dee8ff]/50 px-4 py-3 border-b border-[#c7c4d7] flex items-center justify-between">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                            <label htmlFor={`check-${task.id}`} className="sr-only">
                              Đánh dấu hoàn thành {task.title}
                            </label>
                            <input
                              id={`check-${task.id}`}
                              type="checkbox"
                              checked={task.is_done}
                              onChange={() => handleToggleTask(task.id)}
                              className="w-4 h-4 rounded text-[#2a14b4] focus:ring-[#2a14b4] cursor-pointer"
                            />
                            <span className="w-5 h-5 rounded bg-[#2a14b4] text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                              0{index + 1}
                            </span>
                            <span className={`text-xs font-bold truncate ${task.is_done ? 'line-through text-gray-400' : 'text-[#2a14b4]'}`}>
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => (isExpanded ? setEditingId(null) : handleStartEdit(task))}
                              className="px-2 py-1 text-xs text-[#464554] hover:text-[#2a14b4] rounded hover:bg-white focus:outline-none focus:ring-1 focus:ring-[#2a14b4]"
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id, task.title)}
                              className="px-2 py-1 text-xs text-red-600 hover:text-red-700 rounded hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-400"
                            >
                              🗑️ Xóa
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(isExpanded ? null : task.id)}
                              className="p-1 text-xs text-[#464554]"
                            >
                              {isExpanded ? '▲' : '▼'}
                            </button>
                          </div>
                        </div>

                        {/* Thân thẻ câu hỏi khi mở rộng */}
                        {isExpanded ? (
                          <div className="p-5 space-y-4 text-xs">
                            <div>
                              <label htmlFor={`edit-text-${task.id}`} className="block font-semibold mb-1">
                                Sửa tiêu đề câu hỏi (1–120 ký tự) <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                id={`edit-text-${task.id}`}
                                rows={2}
                                value={editTitle}
                                onChange={(e) => {
                                  setEditTitle(e.target.value);
                                  if (editError) setEditError('');
                                }}
                                className="w-full p-2.5 rounded-lg border border-[#c7c4d7] bg-white outline-none focus:border-[#2a14b4]"
                              />
                              {editError && <p className="text-[11px] text-red-600 mt-1">{editError}</p>}
                            </div>

                            {/* Tham số thời gian & điểm */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3.5 rounded-lg bg-[#f0f3ff] border border-[#c7c4d7]">
                              <div className="md:col-span-7 space-y-1.5">
                                <span className="block font-semibold">Thời gian nói tối đa</span>
                                <div className="flex items-center gap-2">
                                  <button type="button" className="px-2.5 py-1 bg-white border border-[#c7c4d7] rounded">60s</button>
                                  <button type="button" className="px-2.5 py-1 bg-[#4338ca] text-white rounded font-bold">90s</button>
                                  <button type="button" className="px-2.5 py-1 bg-white border border-[#c7c4d7] rounded">120s</button>
                                </div>
                              </div>
                              <div className="md:col-span-5 space-y-1.5">
                                <span className="block font-semibold">Trọng số điểm</span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    defaultValue={task.score}
                                    className="w-14 px-2 py-1 text-center font-bold font-mono border rounded bg-white"
                                  />
                                  <span>/ 10 điểm</span>
                                </div>
                              </div>
                            </div>

                            {/* Barem & Từ khóa AI */}
                            <div className="p-4 rounded-xl border border-[#2a14b4]/20 bg-[#f0f3ff]/60 space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-[#c7c4d7]">
                                <span className="font-bold text-[#2a14b4]">Cấu hình Barem &amp; Từ khóa cho AI</span>
                                <span className="text-[10px] text-emerald-600 font-bold">● OralLLM Sẵn sàng</span>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {task.keywords.map((kw, i) => (
                                  <span key={i} className="px-2 py-1 rounded bg-white border border-[#c7c4d7] text-[11px] flex items-center gap-1">
                                    <span className="text-emerald-600">✓</span> {kw}
                                  </span>
                                ))}
                              </div>

                              <div>
                                <label htmlFor={`rubric-${task.id}`} className="block font-semibold mb-1">
                                  Hướng dẫn chấm cho LLM:
                                </label>
                                <textarea
                                  id={`rubric-${task.id}`}
                                  rows={3}
                                  defaultValue={task.rubric}
                                  className="w-full p-2.5 rounded-lg border border-[#c7c4d7] bg-white text-[11px]"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1.5 rounded-lg border border-[#c7c4d7] bg-white font-medium focus:outline-none focus:ring-1 focus:ring-gray-400"
                              >
                                Thu gọn
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(task.id)}
                                className="px-4 py-1.5 rounded-lg bg-[#2a14b4] text-white font-semibold shadow-sm hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#2a14b4]"
                              >
                                Lưu thay đổi
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            {/* CỘT PHẢI (4 COLS): TIẾN ĐỘ & BAREM MẪU */}
            <div className="xl:col-span-4 space-y-5">
              <div className="bg-white border border-[#c7c4d7] rounded-xl p-5 shadow-sm space-y-3.5 text-xs">
                <h3 className="font-bold text-[#111c2d] text-sm flex items-center gap-2">
                  <span>📊</span> Phân bổ trọng số bài thi
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-[#464554]">
                    <span>Số lượng câu hỏi:</span>
                    <span className="font-bold text-[#111c2d] font-mono">{tasks.length} câu</span>
                  </div>
                  <div className="flex justify-between text-[#464554]">
                    <span>Đã hoàn thành:</span>
                    <span className="font-bold text-emerald-600 font-mono">
                      {tasks.filter((t) => t.is_done).length} / {tasks.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#464554]">
                    <span>Tổng điểm đã cấu hình:</span>
                    <span className="font-bold text-[#2a14b4] font-mono">{totalScore.toFixed(1)} / 10.0 điểm</span>
                  </div>

                  <div className="w-full bg-[#dee8ff] rounded-full h-2 overflow-hidden mt-1">
                    <div
                      className="bg-[#2a14b4] h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((totalScore / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-[#f0f3ff] rounded-lg border border-[#c7c4d7] text-[11px] text-[#464554]">
                  💡 Dữ liệu lưu trong <strong>React State</strong> (Bộ nhớ tạm của Bài 1). Reload trang sẽ hoàn nguyên về mẫu ban đầu.
                </div>
              </div>

              <div className="bg-white border border-[#c7c4d7] rounded-xl p-5 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#111c2d] text-sm flex items-center gap-2">
                    <span>📚</span> Mẫu Barem Chuẩn gợi ý
                  </h3>
                  <span className="text-[10px] text-[#2a14b4] font-bold">Khoa HTTT</span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-[#c7c4d7] hover:border-[#2a14b4] transition-colors cursor-pointer bg-[#f9f9ff]">
                    <div className="font-semibold text-[#111c2d]">Kiến trúc Web &amp; Security</div>
                    <p className="text-[11px] text-[#464554] mt-0.5 line-clamp-1">Đánh giá Cookie, Token Auth, HTTPS handshake...</p>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#c7c4d7] hover:border-[#2a14b4] transition-colors cursor-pointer bg-[#f9f9ff]">
                    <div className="font-semibold text-[#111c2d]">React &amp; Virtual DOM Lifecycle</div>
                    <p className="text-[11px] text-[#464554] mt-0.5 line-clamp-1">Fiber reconciler, memoization, batching updates...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}