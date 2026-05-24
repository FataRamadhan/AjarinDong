'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Star,
  User,
  Calendar,
  MessageSquare,
  Bell,
  BookOpen,
  Award,
  Download,
  TrendingUp,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  DollarSign,
  X,
  Send,
  RefreshCw,
  SlidersHorizontal,
  Filter,
  CalendarDays,
  Menu,
  BookMarked,
  Layers,
  ThumbsUp,
  CalendarCheck
} from 'lucide-react';

// Core types for application state
// standalone helper pure abstractions to satisfy ESLint rules
function generateId(prefix: string): string {
  const randNumStr = Math.random().toString(36).substring(2, 9);
  const nowMs = typeof Date !== 'undefined' ? Date.now() : 0;
  return `${prefix}-${randNumStr}-${nowMs}`;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getFutureDateString(daysAhead: number): string {
  return new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function getCurrentTimeString(): string {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Mentor {
  id: string;
  name: string;
  photoUrl: string;
  expertise: string[];
  rate: number; // in IDR
  rating: number;
  reviewCount: number;
  experience: number; // in years
  bio: string;
  reviews: Review[];
}

interface ScheduledSession {
  id: string;
  mentorId: string;
  mentorName: string;
  date: string;
  time: string;
  topic: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  rate: number;
}

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'REMINDER' | 'SUCCESS' | 'SYS';
  read: boolean;
}

interface LearningGoal {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  targetDate: string;
}

export default function AjarinDongPage() {
  // 1. Initial High-Quality Mock Mentors Data
  const [mentors, setMentors] = useState<Mentor[]>(() => {
    const list: Mentor[] = [
      {
        id: 'mentor-1',
        name: 'Budi Santoso, M.T.',
        photoUrl: 'https://picsum.photos/seed/budi/150/150',
        expertise: ['Matematika', 'Fisika', 'Persiapan UTBK'],
        rate: 85000,
        rating: 4.9,
        reviewCount: 48,
        experience: 6,
        bio: 'Lulusan S2 Teknik Mesin ITB. Spesialisasi mengajar konsep rumit Fisika & Matematika menjadi sederhana dengan analogi kehidupan nyata.',
        reviews: [
          { id: 'rev-1', studentName: 'Rian Wijaya', rating: 5, comment: 'Penjelasan kalkulus mas Budi sangat jernih! Saya dari tidak mengerti langsung bisa mengerjakan latihan soal ujian nasional.', date: '2026-05-18' },
          { id: 'rev-2', studentName: 'Zahra A.', rating: 5, comment: 'Sangat sabar membimbing materi kinematika dasar. Terima kasih banyak mas!', date: '2026-05-10' },
          { id: 'rev-3', studentName: 'Fadel R.', rating: 4, comment: 'Penyampaian asik, asalkan rajin mencatat trik cepat yang didiskusikan sewaktu les.', date: '2026-04-28' }
        ]
      },
      {
        id: 'mentor-2',
        name: 'Amanda Kirana, B.Sc.',
        photoUrl: 'https://picsum.photos/seed/amanda/150/150',
        expertise: ['Web Development', 'Pemrograman Python', 'UI/UX Design'],
        rate: 95000,
        rating: 4.8,
        reviewCount: 32,
        experience: 4,
        bio: 'Software Engineer & Designer. Kunci belajar coding adalah praktek langsung. Mari rancang studi kasus portofolio impian Anda bersama saya!',
        reviews: [
          { id: 'rev-4', studentName: 'Dewi Lestari', rating: 5, comment: 'Sesi pembuatan website portofolio dari nol lancar sekali. Penjelasan kak Amanda mudah dipahami pemula.', date: '2026-05-20' },
          { id: 'rev-5', studentName: 'Andika P.', rating: 4, comment: 'Materi HTML & CSS solid, ulasan UI/UX sangat mencerahkan untuk memandu karir desainer grafis.', date: '2026-05-14' }
        ]
      },
      {
        id: 'mentor-3',
        name: 'Dr. Irfan Wijaya',
        photoUrl: 'https://picsum.photos/seed/irfan/150/150',
        expertise: ['Data Science', 'Machine Learning', 'Statistika Dasar'],
        rate: 120000,
        rating: 5.0,
        reviewCount: 54,
        experience: 9,
        bio: 'Dosen akademis sekaligus konsultan Kecerdasan Buatan (AI). Mengajarkan pemodelan statistik, matematika komputasi bersahabat untuk pemula.',
        reviews: [
          { id: 'rev-6', studentName: 'Sultan Al-Fatih', rating: 5, comment: 'Luar biasa komprehensif. Teori dasar di balik algoritma dibedah dengan matematika sederhana tetapi sangat dalam.', date: '2026-05-22' },
          { id: 'rev-7', studentName: 'Citra Kirana', rating: 5, comment: 'Belajar analisis regresi mendalam untuk keperluan skripsi jadi seru sekali, dapet masukan riset premium.', date: '2026-05-16' }
        ]
      },
      {
        id: 'mentor-4',
        name: 'Siti Sarah, M.Pd.',
        photoUrl: 'https://picsum.photos/seed/siti/150/150',
        expertise: ['Bahasa Inggris Akademik', 'TOEFL Preparation', 'Public Speaking'],
        rate: 75000,
        rating: 4.7,
        reviewCount: 29,
        experience: 5,
        bio: 'Ahli tata bahasa Inggris bersertifikasi resmi. Bimbingan fokus menembus skor TOEFL >600 untuk menunjang syarat pengajuan beasiswa.',
        reviews: [
          { id: 'rev-8', studentName: 'Dimas Aditya', rating: 5, comment: 'Skor TOEFL saya melompat dari 510 ke 595 setelah 6 kali sesi bimbingan bersama mam Sarah! Sangat rekomen.', date: '2026-05-11' },
          { id: 'rev-9', studentName: 'Nadya R.', rating: 4, comment: 'Sesi speaking interaktif membuat draf wawancara jauh lebih profesional dan meningkatkan kepercayaan diri.', date: '2026-05-02' }
        ]
      },
      {
        id: 'mentor-5',
        name: 'Rian Pratama, S.Kom.',
        photoUrl: 'https://picsum.photos/seed/rian/150/150',
        expertise: ['Dasar Algoritma', 'Struktur Data', 'Matematika Diskrit'],
        rate: 80000,
        rating: 4.9,
        reviewCount: 21,
        experience: 3,
        bio: 'Juara Olimpiade Informatika Daerah. Pemecahan logika algoritma rumit dikonversi menjadi draf langkah demi langkah yang seru.',
        reviews: [
          { id: 'rev-10', studentName: 'Bagas Kusuma', rating: 5, comment: 'Logika rekursi yang menyeramkan dibahas tuntas hanya dengan ilustrasi kertas sederhana. Sangat kreatif!', date: '2026-05-15' }
        ]
      }
    ];

    // Try loads from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ajarindong_mentors');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (_) {
          return list;
        }
      }
    }
    return list;
  });

  // Save mentors whenever updated
  useEffect(() => {
    localStorage.setItem('ajarindong_mentors', JSON.stringify(mentors));
  }, [mentors]);

  // 2. Active Tab Selection
  const [activeTab, setActiveTab] = useState<'explore' | 'schedule' | 'chat' | 'progress'>('explore');

  // 3. Exploring & Recommendation Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [maxRate, setMaxRate] = useState<number>(150000);
  const [selectedMentorForSession, setSelectedMentorForSession] = useState<Mentor | null>(null);

  // 4. Session Scheduling Form State
  const [scheduleDate, setScheduleDate] = useState('2026-05-25');
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [scheduleTopic, setScheduleTopic] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  // 5. Scheduled Sessions State
  const [sessions, setSessions] = useState<ScheduledSession[]>(() => {
    const initialSessions: ScheduledSession[] = [
      {
        id: 'session-demo-1',
        mentorId: 'mentor-1',
        mentorName: 'Budi Santoso, M.T.',
        date: '2026-05-26...',
        time: '14:00',
        topic: 'Latihan Soal Limit Trigonometri & Kalkulus Dasar',
        status: 'UPCOMING',
        rate: 85000
      },
      {
        id: 'session-demo-2',
        mentorId: 'mentor-2',
        mentorName: 'Amanda Kirana, B.Sc.',
        date: '2026-05-15',
        time: '19:00',
        topic: 'Pengenalan Flexbox & CSS Grid responsif',
        status: 'COMPLETED',
        rate: 95000
      }
    ];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ajarindong_sessions');
      if (saved) {
        try { return JSON.parse(saved); } catch (_) { return initialSessions; }
      }
    }
    return initialSessions;
  });

  useEffect(() => {
    localStorage.setItem('ajarindong_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // 6. Transparent Reviews Form state
  const [activeMentorForReview, setActiveMentorForReview] = useState<Mentor | null>(null);
  const [newReviewerName, setNewReviewerName] = useState('Fata Ramadan');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // 7. System Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const list: SystemNotification[] = [
      {
        id: 'notif-1',
        title: 'Pengingat Pembelajaran',
        message: 'Info Jadwal: Sesi tutor Fisika dengan pak Budi Santoso akan berjalan dalam 2 hari.',
        timestamp: '30 menit yang lalu',
        type: 'REMINDER',
        read: false
      },
      {
        id: 'notif-2',
        title: 'Akreditasi Ulasan',
        message: 'Terima kasih atas ulasan profesional Anda terhadap mentor Amanda Kirana, B.Sc.',
        timestamp: '1 hari yang lalu',
        type: 'SUCCESS',
        read: true
      }
    ];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ajarindong_notifications');
      if (saved) {
        try { return JSON.parse(saved); } catch (_) { return list; }
      }
    }
    return list;
  });

  useEffect(() => {
    localStorage.setItem('ajarindong_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // 8. Learning Goals State for analytical dashboard
  const [goals, setGoals] = useState<LearningGoal[]>(() => {
    const list: LearningGoal[] = [
      { id: 'goal-1', title: 'Paham turunan turunan fungsi aljabar', subject: 'Matematika', completed: true, targetDate: '2026-05-20' },
      { id: 'goal-2', title: 'Membuat Navbar adaptif dengan HTML/CSS', subject: 'Web Development', completed: false, targetDate: '2026-05-28' },
      { id: 'goal-3', title: 'Belajar manipulasi Pandas DataFrame di Jupyter Notebook', subject: 'Data Science', completed: false, targetDate: '2026-06-02' }
    ];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ajarindong_goals');
      if (saved) {
        try { return JSON.parse(saved); } catch (_) { return list; }
      }
    }
    return list;
  });

  useEffect(() => {
    localStorage.setItem('ajarindong_goals', JSON.stringify(goals));
  }, [goals]);

  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalSubject, setNewGoalSubject] = useState('Matematika');

  // 9. Real-time Smart Chat State
  const [chatRooms, setChatRooms] = useState<Record<string, { sender: 'user' | 'mentor'; text: string; time: string }[]>>(() => {
    const fallback: Record<string, { sender: 'user' | 'mentor'; text: string; time: string }[]> = {
      'mentor-1': [
        { sender: 'mentor', text: 'Halo murid hebat! Selamat datang di ruang bimbingan saya. Ada materi ujian atau konsep matematika yang ingin ditanyakan hari ini?', time: '09:00' }
      ],
      'mentor-2': [
        { sender: 'mentor', text: 'Hai! Siap membangun produk web impianmu? Silakan ceritakan ide project-mu atau sampaikan kesulitan coding-mu di sini.', time: '10:04' }
      ]
    };
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ajarindong_chat_rooms');
      if (saved) {
        try { return JSON.parse(saved); } catch (_) { return fallback; }
      }
    }
    return fallback;
  });

  useEffect(() => {
    localStorage.setItem('ajarindong_chat_rooms', JSON.stringify(chatRooms));
  }, [chatRooms]);

  const [activeChatMentorId, setActiveChatMentorId] = useState<string>('mentor-1');
  const [currentChatMessage, setCurrentChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Categories extracted dynamically
  const categories = ['Semua', 'Matematika', 'Fisika', 'Persiapan UTBK', 'Web Development', 'Pemrograman Python', 'UI/UX Design', 'Data Science', 'Machine Learning', 'Bahasa Inggris Akademik', 'TOEFL Preparation'];

  // Calculate dynamic stats for Detailed Dashboard Analytics
  const totalCompletedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
  const totalUpcomingSessions = sessions.filter(s => s.status === 'UPCOMING').length;
  
  // Calculate hours studied (1.5h simulation per completed session + goals completed)
  const totalHoursStudied = (totalCompletedSessions * 1.5) + (goals.filter(g => g.completed).length * 1.0);
  const totalStreakDays = 5 + (totalCompletedSessions > 0 ? totalCompletedSessions : 0);
  
  // Progress score calculated out of checked goals weight
  const finishedGoalsCount = goals.filter(g => g.completed).length;
  const totalGoalsCount = goals.length;
  const goalCompletionPercentage = totalGoalsCount > 0 ? Math.round((finishedGoalsCount / totalGoalsCount) * 100) : 0;

  // Add customized scheduled session
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentorForSession) return;

    const newSession: ScheduledSession = {
      id: generateId('session'),
      mentorId: selectedMentorForSession.id,
      mentorName: selectedMentorForSession.name,
      date: scheduleDate,
      time: scheduleTime,
      topic: scheduleTopic || 'Konsultasi Belajar & Diskusi Materi Umum',
      status: 'UPCOMING',
      rate: selectedMentorForSession.rate
    };

    // Add session to array
    setSessions(prev => [newSession, ...prev]);

    // Add automatic reminder notification
    const formattedDateStr = new Date(scheduleDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const newNotif: SystemNotification = {
      id: generateId('notif'),
      title: 'Jadwal Baru Terdaftar!',
      message: `Notifikasi Otomatis: Diskusi privat dengan ${selectedMentorForSession.name} telah didaftarkan untuk hari ${formattedDateStr} jam ${scheduleTime} WIB.`,
      timestamp: 'Baru saja',
      type: 'SUCCESS',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Show success banner state
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      setSelectedMentorForSession(null);
      setScheduleTopic('');
      // Swap immediately to Schedule tab to see the outcome
      setActiveTab('schedule');
    }, 2800);
  };

  // Generate real dynamic calendar ICS elements inside client side code
  const handleExportIcsFile = (session: ScheduledSession) => {
    // Basic ICS generation mapping
    const dateClean = session.date.replace(/-/g, ''); // YYYYMMDD
    const hour = session.time.substring(0, 2);
    const min = session.time.substring(3, 5);
    const startStr = `${dateClean}T${hour}${min}00`;
    
    // Add 1 hour duration
    const endHour = (parseInt(hour) + 1).toString().padStart(2, '0');
    const endStr = `${dateClean}T${endHour}${min}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AjarinDong//Mentor Private Session//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:session-${session.id}@ajarindong.com`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:AjarinDong - Sesi Diskusi Privat dengan ${session.mentorName}`,
      `DESCRIPTION:Pembahasan materi: ${session.topic}. Semoga belajarnya menyenangkan!`,
      'LOCATION:Ruang Belajar Virtual AjarinDong',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AjarinDong_Materi_${session.mentorName.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Trigger toast notification
    const addedNotif: SystemNotification = {
      id: generateId('notif-ics'),
      title: 'Kalender Tersinkronisasi',
      message: `File Kalender (.ics) berhasil diekspor untuk sesi dengan ${session.mentorName}. Jalankan untuk sinkronisasi perangkat asli!`,
      timestamp: 'Baru saja',
      type: 'SYS',
      read: false
    };
    setNotifications(prev => [addedNotif, ...prev]);
  };

  // Add transparent peer rating review action
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMentorForReview || !newReviewComment.trim()) return;

    const newRevObj: Review = {
      id: generateId('rev'),
      studentName: newReviewerName || 'Siswa Mandiri',
      rating: newReviewRating,
      comment: newReviewComment,
      date: getTodayString()
    };

    // Recalculate global target rating
    const updatedMentors = mentors.map(m => {
      if (m.id === activeMentorForReview.id) {
        const nextReviews = [newRevObj, ...m.reviews];
        const avgRating = parseFloat(
          (nextReviews.reduce((sum, r) => sum + r.rating, 0) / nextReviews.length).toFixed(1)
        );
        return {
          ...m,
          reviews: nextReviews,
          reviewCount: nextReviews.length,
          rating: avgRating
        };
      }
      return m;
    });

    setMentors(updatedMentors);

    // Add alert notification
    const addRevNotif: SystemNotification = {
      id: generateId('notif-rev'),
      title: 'Ulasan Publik Diterbitkan',
      message: `Terima kasih! Ulasan transparan Anda untuk ${activeMentorForReview.name} berhasil disimpan dan meningkatkan kredibilitas mentor.`,
      timestamp: 'Baru saja',
      type: 'SUCCESS',
      read: false
    };
    setNotifications(prev => [addRevNotif, ...prev]);

    // Reset inputs
    setNewReviewComment('');
    setActiveMentorForReview(null);
  };

  // Sending student chat messages via standard mock fallback or Server Side Gemini API route
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatMessage.trim()) return;

    const currentMentor = mentors.find(m => m.id === activeChatMentorId);
    if (!currentMentor) return;

    const userMsg = {
      sender: 'user' as const,
      text: currentChatMessage,
      time: getCurrentTimeString()
    };

    const updatedRoomMsgs = [...(chatRooms[activeChatMentorId] || []), userMsg];

    setChatRooms(prev => ({
      ...prev,
      [activeChatMentorId]: updatedRoomMsgs
    }));

    setCurrentChatMessage('');
    setChatLoading(true);

    try {
      // Direct call to our custom server side endpoint Proxy secure model gemini-3.5-flash
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentor: currentMentor,
          messages: updatedRoomMsgs.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setChatRooms(prev => ({
          ...prev,
          [activeChatMentorId]: [
            ...updatedRoomMsgs,
            {
              sender: 'mentor',
              text: data.text,
              time: getCurrentTimeString()
            }
          ]
        }));
      } else {
        throw new Error(data.error || "Gagal memproses respon AI.");
      }
    } catch (err) {
      console.warn("API Error. Falling back to structured professional bot response: ", err);
      // Fallback friendly support tutor message logic if api is not configured yet
      setTimeout(() => {
        setChatRooms(prev => ({
          ...prev,
          [activeChatMentorId]: [
            ...updatedRoomMsgs,
            {
              sender: 'mentor',
              text: `Halo! Pertanyaan tentang "${userMsg.text}" adalah topik luar biasa. Mari jadwalkan sesi diskusi privat 1 jam untuk kita bedah mendalam langkah demi langkah secara interaktif! Sembari menunggu, cobalah cari konsep dasarnya dan kabari saya.`,
              time: getCurrentTimeString()
            }
          ]
        }));
      }, 1500);
    } finally {
      setChatLoading(false);
    }
  };

  // Add learning goals checkbox update
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal: LearningGoal = {
      id: generateId('goal'),
      title: newGoalText,
      subject: newGoalSubject,
      completed: false,
      targetDate: getFutureDateString(5)
    };

    setGoals(prev => [...prev, newGoal]);
    setNewGoalText('');
  };

  const toggleGoalCompletion = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextStatus = !g.completed;
        if (nextStatus) {
          // Trigger automatic celebration notification
          const finishedNotif: SystemNotification = {
            id: generateId('notif-goal'),
            title: 'Hore! Target Belajar Tercapai',
            message: `Notifikasi Otomatis: Selamat! Anda telah menyelesaikan tugas "${g.title}" pada kategori ${g.subject}. Terus pertahankan ritme belajar ini!`,
            timestamp: 'Baru saja',
            type: 'SUCCESS',
            read: false
          };
          setNotifications(prevNotif => [finishedNotif, ...prevNotif]);
        }
        return { ...g, completed: nextStatus };
      }
      return g;
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Toggle notifications read status
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Filter mentors based on search queries and category filters
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          mentor.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Semua' || mentor.expertise.includes(selectedCategory);
    const matchesRate = mentor.rate <= maxRate;

    return matchesSearch && matchesCategory && matchesRate;
  });

  return (
    <div className="flex flex-col min-h-screen text-[#1C1C1C] bg-[#FBF9F6] selection:bg-[#EDE9E3] selection:text-[#1C1C1C] font-sans border-8 border-white" id="ajarin_dong_root">
      
      {/* 1. Header Navigation Workspace */}
      <header className="sticky top-0 z-40 bg-[#FBF9F6]/90 backdrop-blur-md border-b border-[#E5E1DA]" id="header_navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between" id="header_container">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('explore')} id="app_branding">
            <div className="text-xl font-serif font-bold italic tracking-tighter text-[#1C1C1C] border border-[#1C1C1C] px-2 py-0.5" id="logo_shape">
              AD
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-serif italic font-semibold leading-none tracking-tight text-[#1C1C1C]" id="logo_text">
                Ajarin<span className="font-sans not-italic font-black text-[#4B5E40]">Dong.</span>
              </h1>
              <p className="text-[9px] text-[#8C857D] font-mono tracking-widest uppercase mt-0.5" id="logo_sub">
                Pusat Mentorship Eksklusif
              </p>
            </div>
          </div>

          {/* Quick Tab Select Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-widest font-bold" id="desktop_nav">
            <button
              id="tab_nav_explore"
              onClick={() => setActiveTab('explore')}
              className={`pb-1 transition-all duration-200 flex items-center space-x-1.5 border-b-2 cursor-pointer ${
                activeTab === 'explore' ? 'border-[#1C1C1C] text-[#1C1C1C]' : 'border-transparent text-[#8C857D] hover:text-[#1C1C1C]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari Mentor</span>
            </button>
            <button
              id="tab_nav_schedule"
              onClick={() => setActiveTab('schedule')}
              className={`pb-1 transition-all duration-200 flex items-center space-x-1.5 relative border-b-2 cursor-pointer ${
                activeTab === 'schedule' ? 'border-[#1C1C1C] text-[#1C1C1C]' : 'border-transparent text-[#8C857D] hover:text-[#1C1C1C]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal Saya</span>
              {totalUpcomingSessions > 0 && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#4B5E40] text-[9px] font-bold text-white font-mono">
                  {totalUpcomingSessions}
                </span>
              )}
            </button>
            <button
              id="tab_nav_chat"
              onClick={() => setActiveTab('chat')}
              className={`pb-1 transition-all duration-200 flex items-center space-x-1.5 border-b-2 cursor-pointer ${
                activeTab === 'chat' ? 'border-[#1C1C1C] text-[#1C1C1C]' : 'border-transparent text-[#8C857D] hover:text-[#1C1C1C]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Obrolan</span>
            </button>
            <button
              id="tab_nav_progress"
              onClick={() => setActiveTab('progress')}
              className={`pb-1 transition-all duration-200 flex items-center space-x-1.5 border-b-2 cursor-pointer ${
                activeTab === 'progress' ? 'border-[#1C1C1C] text-[#1C1C1C]' : 'border-transparent text-[#8C857D] hover:text-[#1C1C1C]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Progres</span>
            </button>
          </nav>

          {/* Right Action: Notifications & Profile */}
          <div className="flex items-center space-x-3" id="header_right_workspace">
            
            {/* Real-time Notification bell with dropdown */}
            <div className="relative" id="notif_dropdown_container">
              <button
                id="notif_trigger"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className={`w-10 h-10 border border-[#E5E1DA] flex items-center justify-center relative transition-colors ${
                  notifDropdownOpen ? 'bg-[#EDE9E3] text-[#1C1C1C]' : 'bg-white text-[#8C857D] hover:bg-[#FBF9F6]'
                }`}
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2.5 right-2.5 flex h-2 w-2" id="active_notif_dot">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4B5E40] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4B5E40]"></span>
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5E1DA] rounded-sm shadow-md overflow-hidden z-50 animate-fade-in"
                    id="notif_dropdown"
                  >
                    <div className="px-4 py-3 bg-[#F1EFE9] border-b border-[#E5E1DA] flex items-center justify-between" id="notif_dropdown_header">
                      <span className="text-xs font-semibold text-[#8C857D] font-mono uppercase tracking-wider">Notifikasi Reminder</span>
                      {notifications.some(n => !n.read) && (
                        <button
                          id="mark_all_read"
                          onClick={handleMarkAllNotificationsAsRead}
                          className="text-[10px] uppercase tracking-wider font-bold text-[#4B5E40] hover:text-[#1C1C1C] transition-colors"
                        >
                          Tandai dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E1DA]" id="notif_dropdown_list">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-[#8C857D] text-sm font-serif italic">Tidak ada notifikasi aktif.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 transition-colors ${notif.read ? 'bg-white' : 'bg-[#EDE9E3]/30'}`}
                            id={`notif_item_${notif.id}`}
                          >
                            <div className="flex items-start space-x-3">
                              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                notif.type === 'SUCCESS' ? 'bg-[#4B5E40]' : notif.type === 'REMINDER' ? 'bg-orange-600' : 'bg-stone-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-[#1C1C1C] font-serif">{notif.title}</h4>
                                <p className="text-xs text-[#8C857D] mt-0.5 whitespace-normal leading-relaxed">{notif.message}</p>
                                <span className="text-[10px] text-[#8C857D]/60 font-mono mt-1 block">{notif.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-[#F1EFE9] text-center border-t border-[#E5E1DA]" id="notif_dropdown_footer">
                      <span className="text-[9px] uppercase tracking-widest text-[#8C857D]/80">Notifikasi otomatis terekam secara real-time</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 border border-[#E5E1DA] bg-white rounded-sm" id="user_profile_badge">
              <div className="w-7 h-7 bg-[#EDE9E3] flex items-center justify-center text-[#1C1C1C] font-mono font-bold text-xs" id="avatar_initial">
                FR
              </div>
              <div className="hidden sm:block text-left" id="user_profile_info">
                <span className="text-xs font-serif font-bold italic block text-[#1C1C1C] leading-tight">Fata Ramadan</span>
                <span className="text-[9px] text-[#8C857D] font-mono uppercase block leading-none">Siswa Mandiri</span>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* 2. Success Feedback Overlay when confirming scheduler */}
      <AnimatePresence>
        {successAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50"
            id="success_booking_overlay"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-2xl border border-slate-100"
              id="success_booking_card"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4" id="success_booking_icon">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900" id="success_booking_title">Sesi Diskusi Terjadwal!</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed" id="success_booking_description">
                Notifikasi otomatis berhasil dipicu. Jadwal bimbingan privat Anda telah disinkronisasikan ke dalam dasbor personal Anda.
              </p>
              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-mono" id="success_booking_metadata">
                Mentor: {selectedMentorForSession?.name}<br />
                Waktu: {scheduleDate} pada pukul {scheduleTime} WIB
              </div>
              <div className="mt-6 flex items-center justify-center text-xs text-indigo-600 font-medium" id="success_booking_loader">
                <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                <span>Memuat dasbor jadwal bimbingan...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Body Container Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" id="main_body">
        
        {/* TAB INTERACTION CONTROLLERS FOR MOBILE (Floating Bottom or top layout) */}
        <div className="md:hidden flex space-x-1 mb-6 p-1 bg-white border border-[#E5E1DA] rounded-sm" id="mobile_tab_bar_control">
          <button
            id="mobile_tab_explore"
            onClick={() => setActiveTab('explore')}
            className={`flex-1 py-2 text-xs font-semibold rounded-sm text-center transition-all cursor-pointer ${
              activeTab === 'explore' ? 'bg-[#4B5E40] text-white' : 'text-[#8C857D]'
            }`}
          >
            🧭 Cari
          </button>
          <button
            id="mobile_tab_schedule"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 text-xs font-semibold rounded-sm text-center transition-all cursor-pointer ${
              activeTab === 'schedule' ? 'bg-[#4B5E40] text-white' : 'text-[#8C857D]'
            }`}
          >
            📅 Jadwal ({totalUpcomingSessions})
          </button>
          <button
            id="mobile_tab_chat"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 text-xs font-semibold rounded-sm text-center transition-all cursor-pointer ${
              activeTab === 'chat' ? 'bg-[#4B5E40] text-white' : 'text-[#8C857D]'
            }`}
          >
            💬 Chat
          </button>
          <button
            id="mobile_tab_progress"
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-2 text-xs font-semibold rounded-sm text-center transition-all cursor-pointer ${
              activeTab === 'progress' ? 'bg-[#4B5E40] text-white' : 'text-[#8C857D]'
            }`}
          >
            📈 Progres
          </button>
        </div>

        {/* VIEW 1: EXPLORE MENTORS & SEARCH WORKSPACE */}
        {activeTab === 'explore' && (
          <div className="space-y-6" id="explore_view_container">
            
            {/* Promotional Banner */}
            <div className="relative bg-white border border-[#E5E1DA] text-[#1C1C1C] p-8 sm:p-12 rounded-sm overflow-hidden" id="hero_promo_banner">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-[#8C857D]" id="hero_banner_decorator">
                <Sparkles className="w-40 h-40" />
              </div>
              <div className="relative max-w-2xl" id="hero_banner_content">
                <span className="bg-[#EDE9E3] text-[#8C857D] font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-sm border border-[#D9D1C5] inline-block mb-4">
                  AjarinDong Learning Space
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif italic font-light tracking-tight leading-tight text-[#1C1C1C]">
                  Temukan mentor berpengalaman &amp; akses konsultasi bimbingan secara eksklusif.
                </h2>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8C857D] mt-4 font-bold font-mono">
                  Sesi privat interaktif • Terjadwal otomatis • Platform transparan
                </p>
              </div>
            </div>

            {/* Smart Filters and Search Bar Container */}
            <div className="bg-white p-4 sm:p-6 rounded-sm border border-[#E5E1DA] space-y-4" id="filters_box_card">
              <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4" id="filters_row">
                
                {/* Search Bar Input */}
                <div className="flex-1 relative" id="search_input_wrap">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#8C857D]" />
                  <input
                    id="mentor_search_field"
                    type="text"
                    placeholder="Cari mentor berdasarkan nama, keahlian khusus, atau topik matematika/coding..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FBF9F6] border border-[#E5E1DA] rounded-sm text-xs focus:outline-none focus:border-[#1C1C1C] transition-all font-medium placeholder-[#8C857D]/50 text-[#1C1C1C]"
                  />
                </div>

                {/* Pricing Filter */}
                <div className="min-w-64 bg-[#FBF9F6] border border-[#E5E1DA] rounded-sm px-4 py-2 flex items-center justify-between" id="price_range_wrap">
                  <div className="text-xs text-left" id="price_label_col">
                    <span className="text-[9px] text-[#8C857D] tracking-widest font-mono uppercase block">Tarif Maksimal</span>
                    <span className="text-xs font-serif font-bold text-[#1C1C1C]">Rp {maxRate.toLocaleString('id-ID')} / jam</span>
                  </div>
                  <input
                    id="mentor_price_range"
                    type="range"
                    min="70000"
                    max="150000"
                    step="5000"
                    value={maxRate}
                    onChange={(e) => setMaxRate(parseInt(e.target.value))}
                    className="w-28 accent-[#4B5E40] cursor-pointer"
                  />
                </div>

              </div>

              {/* Tag Categories Selection */}
              <div className="flex flex-col space-y-2" id="categories_tags_container">
                <span className="text-xs font-semibold text-[#8C857D] font-mono uppercase tracking-wider flex items-center">
                  <Filter className="w-3 h-3 mr-1.5 text-[#8C857D]" />
                  Kategori Keahlian Mentor
                </span>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none" id="category_tags_scroller">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      id={`category_tag_btn_${cat.replace(/\s+/g, '_')}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-none text-xs tracking-wider transition-all cursor-pointer flex-shrink-0 whitespace-nowrap uppercase font-bold font-sans ${
                        selectedCategory === cat
                          ? 'bg-[#4B5E40] text-white font-semibold'
                          : 'bg-[#F1EFE9] text-[#8C857D] hover:bg-[#EDE9E3] hover:text-[#1C1C1C]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Grid of Filtered Mentors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="mentors_profile_grid">
              {filteredMentors.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8" id="empty_mentors_state">
                  <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800">Tidak ada mentor yang cocok</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Coba sesuaikan kata pencarian Anda, perluas filter kategori keahlian, atau naikkan batas estimasi tarif les yang Anda cari.
                  </p>
                  <button
                    id="reset_filter_btn"
                    onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); setMaxRate(150000); }}
                    className="mt-4 px-5 py-2.5 bg-black text-white text-[10px] uppercase tracking-wider font-bold rounded-none hover:bg-[#4B5E40] transition cursor-pointer"
                  >
                    Atur Ulang Filter
                  </button>
                </div>
              ) : (
                filteredMentors.map((mentor) => (
                  <motion.div
                    key={mentor.id}
                    layoutId={`mentor_card_wrap_${mentor.id}`}
                    className="bg-white rounded-none border border-[#E5E1DA] hover:border-[#8C857D] transition-all duration-300 flex flex-col overflow-hidden"
                    id={`mentor_card_${mentor.id}`}
                  >
                    {/* Header: Rating Tag and Badge */}
                    <div className="p-6 pb-4 flex items-start justify-between border-b border-[#E5E1DA]" id="card_hero_part">
                      <div className="flex items-center space-x-4" id="card_avatar_info">
                        <img
                          src={mentor.photoUrl}
                          alt={mentor.name}
                          className="w-14 h-14 rounded-none object-cover bg-slate-100 grayscale hover:grayscale-0 transition-all duration-300 border border-[#E5E1DA]"
                          onError={(e) => {
                            // Fallback image source gracefully
                            (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${mentor.name}`;
                          }}
                        />
                        <div>
                          <h3 className="font-serif italic font-bold text-[#1C1C1C] text-lg hover:text-[#4B5E40] transition" id="mentor_title_name">
                            {mentor.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1" id="rating_and_exp">
                            <span className="flex items-center text-[#4B5E40] font-bold text-xs" id="average_rate">
                              <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                              {mentor.rating}
                            </span>
                            <span className="text-[10px] text-[#8C857D] font-mono">•</span>
                            <span className="text-[#8C857D] text-xs font-medium" id="total_reviews_count">
                              {mentor.reviewCount} ulasan
                            </span>
                            <span className="text-[10px] text-[#8C857D] font-mono">•</span>
                            <span className="text-[#8C857D] text-xs font-medium" id="years_exp_text">
                              {mentor.experience} thn exp
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio & Specialty Section */}
                    <div className="p-6 py-4 flex-1 space-y-4" id="card_spec_bio">
                      <p className="text-xs text-[#8C857D] leading-relaxed line-clamp-2" id="mentor_bio_snippet">
                        {mentor.bio}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5" id="expertise_tags_wrap">
                        {mentor.expertise.map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#EDE9E3] text-[#1C1C1C] px-2.5 py-0.5 rounded-none text-[9px] uppercase tracking-wider font-semibold font-mono border border-[#D9D1C5]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Tutor Hourly Charge */}
                      <div className="bg-[#F1EFE9] p-3 rounded-none flex items-center justify-between" id="card_price_banner">
                        <span className="text-[9px] text-[#8C857D] font-mono tracking-wider uppercase">Investasi Belajar</span>
                        <span className="text-sm font-serif font-bold text-[#1C1C1C]">
                          Rp {mentor.rate.toLocaleString('id-ID')}<span className="text-[10px] text-[#8C857D] font-sans font-normal">/jam</span>
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions: Chat, Reviews, Schedule */}
                    <div className="p-6 pt-0 space-y-3" id="card_actions_part">
                      
                      <div className="grid grid-cols-2 gap-2" id="main_cta_row">
                        <button
                          id={`chat_mentor_btn_${mentor.id}`}
                          onClick={() => {
                            // Ensure chat room is initialized for this mentor
                            if (!chatRooms[mentor.id]) {
                              setChatRooms(prev => ({
                                ...prev,
                                [mentor.id]: [{ sender: 'mentor', text: `Halo! Saya ${mentor.name}. Ada topik pembelajaran yang bisa saya bantu hari ini?`, time: 'Sekarang' }]
                              }));
                            }
                            setActiveChatMentorId(mentor.id);
                            setActiveTab('chat');
                          }}
                          className="px-3 py-2 border border-[#E5E1DA] hover:border-[#1C1C1C] text-[#1C1C1C] font-semibold rounded-none text-[10px] uppercase tracking-wider bg-white transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Mulai Chat</span>
                        </button>

                        <button
                          id={`reviews_mentor_btn_${mentor.id}`}
                          onClick={() => setActiveMentorForReview(mentor)}
                          className="px-3 py-2 border border-[#E5E1DA] hover:border-[#1C1C1C] text-[#4B5E40] hover:text-[#1C1C1C] font-semibold rounded-none text-[10px] uppercase tracking-wider bg-white transition cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Ulasan ({mentor.reviewCount})</span>
                        </button>
                      </div>

                      <button
                        id={`schedule_sessions_btn_${mentor.id}`}
                        onClick={() => setSelectedMentorForSession(mentor)}
                        className="w-full px-4 py-2.5 bg-black hover:bg-[#4B5E40] text-white font-bold rounded-none text-[10px] uppercase tracking-widest border border-black hover:border-[#4B5E40] shadow-none flex items-center justify-center space-x-2 transition cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>JADWALKAN DISKUSI PRIVAT</span>
                      </button>

                    </div>

                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

                 {/* DIALOG 1: DETAILED SCHEDULING INTERACTIVE WORKSPACE */}
        <AnimatePresence>
          {selectedMentorForSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/55 backdrop-blur-xs flex items-center justify-center z-50 p-4"
              id="scheduler_modal_backdrop"
            >
              <motion.div
                initial={{ scale: 0.98, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 15 }}
                className="bg-white rounded-none max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#E5E1DA]"
                id="scheduler_modal_card"
              >
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#E5E1DA] flex items-center justify-between z-10" id="scheduler_modal_header">
                  <div id="scheduler_title_col">
                    <h3 className="text-base font-serif italic font-bold text-[#1C1C1C]">Jadwalkan Sesi Privat</h3>
                    <p className="text-[11px] text-[#8C857D]">Atur bimbingan privat Anda dengan sistem kalender terpadu</p>
                  </div>
                  <button
                    id="close_scheduler_modal"
                    onClick={() => setSelectedMentorForSession(null)}
                    className="w-8 h-8 rounded-none bg-[#F1EFE9] hover:bg-[#EDE9E3] text-[#1C1C1C] flex items-center justify-center transition border border-[#E5E1DA] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4" id="scheduler_booking_form">
                  
                  {/* Selected Mentor Small Summary */}
                  <div className="p-4 bg-[#F1EFE9] border border-[#E5E1DA] rounded-none flex items-center space-x-3" id="scheduler_mentor_display">
                    <img
                      src={selectedMentorForSession.photoUrl}
                      alt={selectedMentorForSession.name}
                      className="w-10 h-10 rounded-none object-cover bg-slate-100 border border-[#E5E1DA]"
                    />
                    <div>
                      <h4 className="font-serif italic font-bold text-xs text-[#1C1C1C] leading-tight">{selectedMentorForSession.name}</h4>
                      <p className="text-[10px] text-[#4B5E40] mt-0.5">Spesialisasi: {selectedMentorForSession.expertise.slice(0, 2).join(", ")}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-xs font-serif font-bold text-[#1C1C1C] block">Rp {selectedMentorForSession.rate.toLocaleString('id-ID')}</span>
                      <span className="text-[9px] text-[#8C857D] block font-mono">/ jam</span>
                    </div>
                  </div>

                  {/* Input Date of Session */}
                  <div className="flex flex-col space-y-1.5" id="date_input_group">
                    <label className="text-[10px] font-bold text-[#1C1C1C] font-mono uppercase tracking-wider">Pilih Tanggal Pertemuan</label>
                    <div className="relative" id="date_input_wrap">
                      <CalendarDays className="absolute left-3 top-3.5 w-4 h-4 text-[#8C857D]" />
                      <input
                        id="booking_date_field"
                        type="date"
                        required
                        min="2026-05-24"
                        max="2026-06-30"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#FBF9F6] border border-[#E5E1DA] rounded-none text-xs focus:outline-none focus:border-[#1C1C1C] font-semibold text-[#1C1C1C]"
                      />
                    </div>
                  </div>

                  {/* Input Time of Session */}
                  <div className="flex flex-col space-y-1.5" id="time_input_group">
                    <label className="text-[10px] font-bold text-[#1C1C1C] font-mono uppercase tracking-wider">Pilih Slot Jam Mulai (1 Jam Sesi)</label>
                    <div className="grid grid-cols-4 gap-2" id="time_slots_grid">
                      {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '19:00', '20:00'].map((timeOption) => (
                        <button
                          key={timeOption}
                          type="button"
                          id={`time_slot_btn_${timeOption.replace(':', '_')}`}
                          onClick={() => setScheduleTime(timeOption)}
                          className={`py-2 text-[11px] font-bold rounded-none text-center transition cursor-pointer ${
                            scheduleTime === timeOption
                              ? 'bg-[#4B5E40] text-white border border-[#4B5E40]'
                              : 'bg-white text-[#8C857D] border border-[#E5E1DA] hover:bg-[#EDE9E3]'
                          }`}
                        >
                          {timeOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Subject / Topic of study discussion */}
                  <div className="flex flex-col space-y-1.5" id="topic_input_group">
                    <label className="text-[10px] font-bold text-[#1C1C1C] font-mono uppercase tracking-wider">Materi & Topik Bahasan Spesifik</label>
                    <textarea
                      id="booking_topic_area"
                      placeholder="Masukkan deskripsi materi belajar spesifik agar mentor dapat mempersiapkan slide latihan sebelum mulai kelas"
                      rows={3}
                      required
                      value={scheduleTopic}
                      onChange={(e) => setScheduleTopic(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FBF9F6] border border-[#E5E1DA] rounded-none text-xs focus:outline-none focus:border-[#1C1C1C] font-medium text-[#1C1C1C]"
                    />
                  </div>

                  {/* Pricing Breakdown Summary */}
                  <div className="bg-[#F1EFE9] p-4 rounded-none space-y-2 border border-[#E5E1DA]" id="payment_breakdown">
                    <div className="flex justify-between text-xs text-[#8C857D]" id="pricing_basic">
                      <span>Biaya Konsultasi Privat (1 Jam)</span>
                      <span className="font-serif">Rp {selectedMentorForSession.rate.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#8C857D]" id="pricing_admin">
                      <span>Biaya Platform & Jaminan Keamanan</span>
                      <span className="font-serif">Rp 5.000</span>
                    </div>
                    <div className="h-px bg-[#E5E1DA] my-1" />
                    <div className="flex justify-between text-sm font-bold text-[#1C1C1C] font-serif" id="pricing_total">
                      <span>Total Invoice Pembayaran</span>
                      <span className="text-[#4B5E40] font-serif font-bold">Rp {(selectedMentorForSession.rate + 5000).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Actions Confirmation */}
                  <div className="grid grid-cols-2 gap-3" id="scheduler_form_actions">
                    <button
                      type="button"
                      id="cancel_booking_process"
                      onClick={() => setSelectedMentorForSession(null)}
                      className="py-3 border border-[#E5E1DA] text-[#8C857D] hover:text-[#1C1C1C] text-[10px] uppercase tracking-wider font-bold rounded-none hover:bg-[#EDE9E3] transition cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      id="confirm_booking_submit"
                      className="py-3 bg-black hover:bg-[#4B5E40] text-white text-[10px] uppercase tracking-widest font-bold rounded-none transition cursor-pointer"
                    >
                      Konfirmasi
                    </button>
                  </div>

                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DIALOG 2: TRANSPARENT REVIEWS OVERLAY & READ/WRITE SYSTEM */}
        <AnimatePresence>
          {activeMentorForReview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/55 backdrop-blur-xs flex items-center justify-center z-50 p-4"
              id="reviews_modal_backdrop"
            >
              <motion.div
                initial={{ scale: 0.98, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 15 }}
                className="bg-white rounded-none max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl border border-[#E5E1DA]"
                id="reviews_modal_card"
              >
                
                {/* Header info */}
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#E5E1DA] flex items-center justify-between z-10" id="reviews_modal_header">
                  <div>
                    <h3 className="text-base font-serif italic font-bold text-[#1C1C1C]">Ulasan Mentor Transparan</h3>
                    <p className="text-[11px] text-[#8C857D]">Ulasan otentik murid tanpa modifikasi demi kualitas mengajar</p>
                  </div>
                  <button
                    id="close_reviews_modal"
                    onClick={() => setActiveMentorForReview(null)}
                    className="w-8 h-8 rounded-none bg-[#F1EFE9] hover:bg-[#EDE9E3] text-[#1C1C1C] flex items-center justify-center transition border border-[#E5E1DA] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-6" id="reviews_modal_body">
                  
                  {/* Rating distribution Summary info */}
                  <div className="flex items-center space-x-6 p-4 bg-[#F1EFE9] border border-[#E5E1DA] rounded-none" id="reviews_stats_summary">
                     <div className="text-center shrink-0 border-r border-[#E5E1DA] pr-6" id="score_box">
                      <span className="text-4xl font-serif italic font-bold text-[#1C1C1C] block">{activeMentorForReview.rating}</span>
                      <span className="text-[9px] text-[#8C857D] font-mono block uppercase mt-0.5">Skor Mutu</span>
                    </div>
                    <div className="space-y-1 w-full" id="stars_bars">
                      <h4 className="text-xs font-bold text-[#1C1C1C]">Integrasi Masukan Murid</h4>
                      <p className="text-xs text-[#8C857D] leading-relaxed">
                        Data masukan bersifat permanen demi mendukung transparansi platform.
                      </p>
                    </div>
                  </div>

                  {/* Submit New Rating Form */}
                  <form onSubmit={handleAddReview} className="p-4 rounded-none border border-[#E5E1DA] bg-white space-y-3" id="leave_review_form">
                    <h4 className="text-[10px] font-bold text-[#4B5E40] font-mono uppercase tracking-wider flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#4B5E40]" />
                      Tinggalkan Ulasan Transparan Anda
                    </h4>

                    <div className="grid grid-cols-2 gap-3" id="reviewer_input_row">
                      <div id="reviewer_name_col">
                        <label className="text-[9px] text-[#8C857D] uppercase tracking-wider font-bold block mb-1">Nama Kontributor</label>
                        <input
                          id="review_author_field"
                          type="text"
                          required
                          value={newReviewerName}
                          onChange={(e) => setNewReviewerName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-none bg-[#FBF9F6] border border-[#E5E1DA] text-xs focus:outline-none focus:border-[#1C1C1C] text-[#1C1C1C]"
                        />
                      </div>
                      <div id="reviewer_rating_col">
                        <label className="text-[9px] text-[#8C857D] uppercase tracking-wider font-bold block mb-1">Skor Bintang (1-5)</label>
                        <div className="flex space-x-1" id="stars_picker_row">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              id={`star_selector_btn_${num}`}
                              onClick={() => setNewReviewRating(num)}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star className={`w-5 h-5 ${
                                num <= newReviewRating ? 'text-[#4B5E40] fill-[#4B5E40]' : 'text-stone-300'
                              }`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div id="reviewer_comment_coll">
                      <label className="text-[9px] text-[#8C857D] uppercase tracking-wider font-bold block mb-1">Komentar/Saran Pengajaran</label>
                      <textarea
                        id="review_comment_field"
                        placeholder="Tulis pendapat jujur Anda tentang penjelasan mentor..."
                        required
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 rounded-none bg-[#FBF9F6] border border-[#E5E1DA] text-xs focus:outline-none focus:border-[#1C1C1C] font-medium text-[#1C1C1C]"
                      />
                    </div>

                    <button
                      type="submit"
                      id="submit_review_btn"
                      className="w-full py-2 bg-black hover:bg-[#4B5E40] text-white text-[10px] uppercase tracking-wider font-bold rounded-none transition cursor-pointer"
                    >
                      Kirim Ulasan Transparan
                    </button>
                  </form>

                  {/* List of reviews */}
                  <div className="space-y-4" id="reviews_feed_list">
                    <h4 className="text-[10px] font-bold text-[#8C857D] font-mono uppercase tracking-wider">Histori Ulasan Murid ({activeMentorForReview.reviews.length})</h4>
                    <div className="space-y-3" id="reviews_scroller">
                      {activeMentorForReview.reviews.length === 0 ? (
                        <div className="p-8 text-center text-[#8C857D] text-xs font-serif italic">Belum ada ulasan untuk mentor ini.</div>
                      ) : (
                        activeMentorForReview.reviews.map((rev) => (
                          <div key={rev.id} className="p-4 bg-[#FBF9F6] rounded-none space-y-2 border border-[#E5E1DA]" id={`review_bubble_${rev.id}`}>
                            <div className="flex items-center justify-between" id="rev_meta">
                              <span className="text-xs font-bold text-[#1C1C1C] font-serif">{rev.studentName}</span>
                              <div className="flex items-center space-x-2" id="rev_stars">
                                <div className="flex text-[#4B5E40]" id="rev_solid_stars">
                                  {Array.from({ length: rev.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current" />
                                  ))}
                                </div>
                                <span className="text-[10px] text-[#8C857D] font-mono">{rev.date}</span>
                              </div>
                            </div>
                            <p className="text-xs text-[#8C857D] leading-relaxed font-medium">&ldquo;{rev.comment}&rdquo;</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VIEW 2: SCHEDULE SCHEDULES & DEVICE CALENDAR CONFIGS */}
        {activeTab === 'schedule' && (
          <div className="space-y-6" id="schedule_view_container">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center" id="schedule_header_section">
              <div id="schedule_title">
                <h2 className="text-xl font-bold font-serif italic text-[#1C1C1C]">Agenda Sesi Diskusi Privat</h2>
                <p className="text-xs text-[#8C857D]">Konfirmasi jadwal belajar interaktif dan ekspor sinkronisasi kalender Anda</p>
              </div>
              
              <div className="mt-3 md:mt-0 px-4 py-2 bg-[#F1EFE9] rounded-none text-xs text-[#4B5E40] font-sans border border-[#E5E1DA] font-bold uppercase tracking-wider flex items-center" id="notif_auto_badge">
                <Bell className="w-3.5 h-3.5 mr-2 text-[#4B5E40]" />
                <span>Remainder Pertemuan Aktif</span>
              </div>
            </div>

            {/* List of Scheduled Sesi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="sessions_agenda_grid">
              {sessions.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white rounded-none border border-[#E5E1DA] p-8" id="empty_sessions_state">
                  <Calendar className="w-12 h-12 text-[#8C857D]/50 mx-auto mb-3" />
                  <h3 className="text-base font-serif italic font-bold text-[#1C1C1C]">Belum ada agenda belajar terjadwal</h3>
                  <p className="text-xs text-[#8C857D] max-w-sm mx-auto mt-1 mb-4">
                    Jadwalkan sesi pertama Anda dengan mentor kompeten kami untuk mendata kemajuan progres di dasbor analitik.
                  </p>
                  <button
                    id="find_mentor_empty_cta"
                    onClick={() => setActiveTab('explore')}
                    className="px-6 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-bold rounded-none hover:bg-[#4B5E40] transition cursor-pointer"
                  >
                    Mulai Cari Mentor Sekarang
                  </button>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-none border border-[#E5E1DA] p-6 flex flex-col justify-between hover:border-[#8C857D] transition-all relative overflow-hidden"
                    id={`session_item_${session.id}`}
                  >
                    {/* Dynamic status sticker */}
                    <div className="flex items-center justify-between mb-4" id="session_card_header">
                      <div className="flex items-center space-x-2" id="session_sub_topic">
                        <BookOpen className="w-4 h-4 text-[#4B5E40]" />
                        <span className="text-[10px] font-bold text-[#4B5E40] uppercase tracking-wider font-mono">Bimbingan Privat</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-none text-[9px] font-bold tracking-wider uppercase border ${
                        session.status === 'UPCOMING'
                          ? 'bg-[#EDE9E3] text-amber-800 border-amber-600/20'
                          : session.status === 'COMPLETED'
                          ? 'bg-[#EDE9E3] text-[#4B5E40] border-[#4B5E40]/20'
                          : 'bg-[#F1EFE9] text-[#8C857D] border-[#E5E1DA]'
                      }`} id="session_status">
                        {session.status === 'UPCOMING' ? '🟢 Terjadwal' : '✅ Selesai'}
                      </span>
                    </div>

                    <div className="space-y-3" id="session_details">
                      <h3 className="font-serif italic font-bold text-[#1C1C1C] text-base" id="session_topic_header">
                        {session.topic}
                      </h3>

                      <div className="p-3 bg-[#F1EFE9] border border-[#E5E1DA] rounded-none grid grid-cols-2 gap-2 text-xs" id="session_times_grid">
                        <div className="flex items-center space-x-2 text-[#8C857D]" id="time_col">
                          <Clock className="w-4 h-4 text-[#8C857D]" />
                          <span>Pukul: <strong className="text-[#1C1C1C] font-bold">{session.time} WIB</strong></span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#8C857D]" id="date_col">
                          <Calendar className="w-4 h-4 text-[#8C857D]" />
                          <span>Tanggal: <strong className="text-[#1C1C1C] font-bold">{session.date}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 pt-2" id="session_host_mentor">
                        <div className="w-8 h-8 rounded-none bg-[#EDE9E3] border border-[#D9D1C5] flex items-center justify-center text-[#1C1C1C] font-bold text-xs font-serif">
                          M
                        </div>
                        <div>
                          <span className="text-[9px] text-[#8C857D] font-mono uppercase block leading-none">Mentor Belajar</span>
                          <span className="text-xs font-serif italic font-bold text-[#1C1C1C] block mt-0.5">{session.mentorName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Interactive Options */}
                    <div className="mt-6 pt-4 border-t border-[#E5E1DA] flex items-center justify-between" id="session_footer_actions">
                      <div className="text-xs font-bold text-[#8C857D]" id="session_cost_sum">
                        Investasi: <span className="text-[#1C1C1C] font-serif font-bold">Rp {session.rate.toLocaleString('id-ID')}</span>
                      </div>

                      <div className="flex space-x-2" id="action_buttons_wrap">
                        {session.status === 'UPCOMING' ? (
                          <>
                            {/* Device Calendar integration trigger */}
                            <button
                              id={`export_ics_btn_${session.id}`}
                              onClick={() => handleExportIcsFile(session)}
                              title="Ekspor kalender .ics agar sinkron dengan Google/Apple calendar"
                              className="px-3 py-1.5 border border-[#E5E1DA] hover:border-[#1C1C1C] text-[#8C857D] hover:text-[#1C1C1C] text-[10px] uppercase font-bold rounded-none flex items-center space-x-1.5 transition cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Sinkron (.ics)</span>
                              <span className="sm:hidden">ics</span>
                            </button>

                            {/* Simulated Virtual Link room */}
                            <button
                              id={`join_meeting_btn_${session.id}`}
                              onClick={() => {
                                alert(`Mengalihkan Anda ke ruang diskusi virtual privat bersama ${session.mentorName}. Harap pastikan mikrofon Anda menyala!`);
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Masuk Kelas</span>
                            </button>
                          </>
                        ) : (
                          <div className="text-xs text-slate-400 font-medium flex items-center" id="session_completed_mark">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1" />
                            <span>Telah diselesaikan</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* VIEW 3: SMART LIVE CHAT SPACES CONNECTED TO SERVERS */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-none border border-[#E5E1DA] overflow-hidden h-[75vh] flex" id="chat_view_workspace">
            
            {/* Sidebar list of mentors for chat selection */}
            <div className="w-80 border-r border-[#E5E1DA] hidden md:flex flex-col" id="chat_sidebar_channels">
              <div className="p-4 border-b border-[#E5E1DA] bg-[#F1EFE9]" id="chat_search_sidebar">
                <span className="text-xs font-bold text-[#1C1C1C] font-mono uppercase tracking-wider block mb-2">Mentor Kontak Aktif Anda</span>
                <p className="text-[11px] text-[#8C857D]">Pilih salah satu mentor untuk memulai obrolan langsung</p>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[#E5E1DA]" id="chat_channels_list">
                {mentors.map((m) => {
                  const hasHistory = chatRooms[m.id] && chatRooms[m.id].length > 0;
                  const lastMsg = hasHistory ? chatRooms[m.id][chatRooms[m.id].length - 1].text : "Mulai diskusi materi belajar baru...";
                  const isActive = activeChatMentorId === m.id;

                  return (
                    <button
                      key={m.id}
                      id={`chat_tutor_channel_${m.id}`}
                      onClick={() => setActiveChatMentorId(m.id)}
                      className={`w-full p-4 text-left flex items-start space-x-3 transition-colors cursor-pointer ${
                        isActive ? 'bg-[#EDE9E3]' : 'hover:bg-[#FBF9F6]'
                      }`}
                    >
                      <img
                        src={m.photoUrl}
                        alt={m.name}
                        className="w-10 h-10 rounded-none object-cover grayscale border border-[#E5E1DA]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif italic font-bold text-xs text-[#1C1C1C] truncate">{m.name}</h4>
                          <span className="text-[9px] text-[#4B5E40] font-mono font-bold uppercase">Online</span>
                        </div>
                        <p className="text-[10px] text-[#8C857D] font-mono mt-0.5 truncate uppercase tracking-tight">{m.expertise.slice(0, 2).join(", ")}</p>
                        <p className="text-xs text-[#2C2C2C] truncate mt-1 leading-snug">{lastMsg}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Live Chat Room Window */}
            <div className="flex-1 flex flex-col bg-[#FBF9F6]" id="chat_active_room">
              
              {/* Active Mentor Info Header */}
              {(() => {
                const activeMentor = mentors.find(m => m.id === activeChatMentorId);
                if (!activeMentor) return null;

                return (
                  <div className="p-4 bg-white border-b border-[#E5E1DA] flex items-center justify-between" id="active_chat_header">
                    <div className="flex items-center space-x-3" id="active_chat_mentor_info">
                      <img
                        src={activeMentor.photoUrl}
                        alt={activeMentor.name}
                        className="w-10 h-10 rounded-none object-cover border border-[#E5E1DA]"
                      />
                      <div>
                        <h4 className="font-serif italic font-bold text-sm text-[#1C1C1C] leading-tight">{activeMentor.name}</h4>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4B5E40]"></span>
                          <span className="text-[11px] text-[#8C857D]">Konsultasi Responsif (Didukung AI Pendukung)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id="view_active_mentor_profile"
                      onClick={() => setActiveMentorForReview(activeMentor)}
                      className="px-3 py-1.5 border border-[#E5E1DA] hover:border-[#1C1C1C] text-[10px] uppercase font-bold rounded-none text-[#1C1C1C] hover:bg-[#F1EFE9] transition cursor-pointer"
                    >
                      Ulasan Mentor
                    </button>
                  </div>
                );
              })()}

              {/* Chat Message dialog track */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" id="messages_track">
                {(() => {
                  const msgs = chatRooms[activeChatMentorId] || [];
                  const activeMentor = mentors.find(m => m.id === activeChatMentorId);

                  if (msgs.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center text-[#8C857D] p-8 text-center" id="empty_chat_messages">
                        <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs font-serif italic">Buka jalur percakapan belajar Anda di sini.</span>
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* Notice text */}
                      <div className="text-center p-2 mb-2" id="chat_security_notice">
                        <span className="inline-block bg-[#F1EFE9] border border-[#E5E1DA] rounded-none px-2.5 py-1 text-[10px] text-[#8C857D] leading-tight">
                          ✨ Terhubung via model AI supercepat yang menirukan gaya pengajaran pakar mentor terpilih secara akurat.
                        </span>
                      </div>

                      {msgs.map((msg, idx) => {
                        const isStudent = msg.sender === 'user';
                        return (
                          <div
                            key={idx}
                            id={`message_bubble_${idx}`}
                            className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-end space-x-2 max-w-xl ${isStudent ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                              
                              <div className={`px-4 py-2.5 rounded-none text-xs leading-relaxed ${
                                isStudent
                                  ? 'bg-black text-white'
                                  : 'bg-[#EDE9E3] border border-[#D9D1C5] text-[#1C1C1C]'
                              }`}>
                                <div className="whitespace-pre-line font-medium leading-relaxed">
                                  {msg.text}
                                </div>
                                <span className={`text-[9px] block text-right mt-1 ${isStudent ? 'text-[#8C857D]' : 'text-[#8C857D]'}`}>
                                  {msg.time}
                                </span>
                              </div>

                            </div>
                          </div>
                        );
                      })}

                      {chatLoading && (
                        <div className="flex justify-start" id="chat_loading_indicator">
                          <div className="bg-white border border-[#E5E1DA] rounded-none px-4 py-2.5 flex items-center space-x-2 text-xs text-[#8C857D]">
                            <span className="flex space-x-1" id="loading_dots">
                              <span className="w-1.5 h-1.5 bg-[#4B5E40] rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-[#4B5E40] rounded-full animate-bounce delay-100"></span>
                              <span className="w-1.5 h-1.5 bg-[#4B5E40] rounded-full animate-bounce delay-200"></span>
                            </span>
                            <span className="font-mono text-[10px]">Tutor sedang mengetik panduan belajar...</span>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Chat Text Input field */}
              <form onSubmit={handleSendChatMessage} className="p-4 bg-white border-t border-[#E5E1DA] flex items-center space-x-2" id="chat_input_form">
                <input
                  id="chat_text_input_field"
                  type="text"
                  placeholder="Tanyakan topik belajar Anda di sini..."
                  value={currentChatMessage}
                  onChange={(e) => setCurrentChatMessage(e.target.value)}
                  disabled={chatLoading}
                  className="flex-1 px-4 py-3 bg-[#FBF9F6] border border-[#E5E1DA] rounded-none text-xs focus:outline-none focus:border-[#1C1C1C] disabled:opacity-60 font-medium text-[#1C1C1C]"
                />
                <button
                  type="submit"
                  id="send_chat_msg_btn"
                  disabled={chatLoading || !currentChatMessage.trim()}
                  className="p-3 bg-black text-white hover:bg-[#4B5E40] rounded-none disabled:opacity-40 transition-all flex items-center justify-center cursor-pointer border border-black hover:border-[#4B5E40]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>
        )}

        {/* VIEW 4: PROGRESS REPORTING & ANALYTICAL WORKSPACE */}
        {activeTab === 'progress' && (
          <div className="space-y-6" id="progress_view_container">
            
            {/* Quick stats analytic dashboard widgets count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard_analytics_panel">
              
              <div className="bg-white p-6 rounded-none border border-[#E5E1DA] flex items-center space-x-4" id="widget_hours_studied">
                <div className="w-12 h-12 rounded-none bg-[#F1EFE9] border border-[#E5E1DA] text-[#4B5E40] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-[#8C857D] font-mono tracking-wider uppercase block">Total Jam Belajar</span>
                  <span className="text-xl font-serif font-bold text-[#1C1C1C] block mt-0.5">{totalHoursStudied} Jam</span>
                  <span className="text-[10px] text-[#4B5E40] font-sans font-semibold flex items-center mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    Mingguan +2.5 jam
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-[#E5E1DA] flex items-center space-x-4" id="widget_sessions_completed">
                <div className="w-12 h-12 rounded-none bg-[#F1EFE9] border border-[#E5E1DA] text-[#1C1C1C] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-[#8C857D] font-mono tracking-wider uppercase block">Sesi Terkonfirmasi</span>
                  <span className="text-xl font-serif font-bold text-[#1C1C1C] block mt-0.5">{totalCompletedSessions} Selesai</span>
                  <span className="text-[10px] text-[#8C857D] block mt-0.5">{totalUpcomingSessions} Terjadwal</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-[#E5E1DA] flex items-center space-x-4" id="widget_streak_days">
                <div className="w-12 h-12 rounded-none bg-[#F1EFE9] border border-[#E5E1DA] text-amber-800 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-[#8C857D] font-mono tracking-wider uppercase block">Streak Belajar</span>
                  <span className="text-xl font-serif font-bold text-[#1C1C1C] block mt-0.5">{totalStreakDays} Hari</span>
                  <span className="text-[10px] text-[#4B5E40] font-semibold block mt-0.5">🔥 Sangat Konsisten</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-[#E5E1DA] flex items-center space-x-4" id="widget_active_goals">
                <div className="w-12 h-12 rounded-none bg-[#F1EFE9] border border-[#E5E1DA] text-[#4B5E40] flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-[#8C857D] font-mono tracking-wider uppercase block">Target Tercapai</span>
                  <span className="text-xl font-serif font-bold text-[#1C1C1C] block mt-0.5">{goalCompletionPercentage}%</span>
                  <span className="text-[10px] text-[#8C857D] block mt-0.5">{finishedGoalsCount} dari {totalGoalsCount} Target</span>
                </div>
              </div>

            </div>

            {/* Grid for Detailed Charts & Goals checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard_detailed_analytics_grid">
              
              {/* Subject effort breakdown comparison */}
              <div className="bg-white p-6 rounded-none border border-[#E5E1DA] space-y-4 lg:col-span-1" id="subject_effort_chart_box">
                <div>
                  <h3 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider font-mono text-left">Porsi Alokasi Subjek (%)</h3>
                  <p className="text-xs text-[#8C857D] mt-0.5">Pembagian durasi waktu mengajar berdasarkan tema bimbingan</p>
                </div>

                <div className="space-y-4 pt-2" id="effort_bars_space">
                  {[
                    { name: 'Matematika & Fisika', pct: 45, color: 'bg-[#4B5E40]' },
                    { name: 'Web Development & Coding', pct: 30, color: 'bg-[#8C857D]' },
                    { name: 'Persiapan Seleksi UTBK', pct: 15, color: 'bg-amber-700' },
                    { name: 'Bahasa Inggris / TOEFL', pct: 10, color: 'bg-stone-500' }
                  ].map((sub) => (
                    <div key={sub.name} className="space-y-1" id={`effort_bar_item_${sub.name.replace(/\s+/g, '_')}`}>
                      <div className="flex justify-between text-xs text-[#1C1C1C] font-semibold">
                        <span>{sub.name}</span>
                        <span>{sub.pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#EDE9E3] rounded-none overflow-hidden">
                        <div className={`h-full ${sub.color}`} style={{ width: `${sub.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#F1EFE9] p-3 rounded-none text-xs text-[#8C857D] leading-relaxed border border-[#E5E1DA]" id="chart_insight">
                  💡 <strong>Rekomendasi Belajar:</strong> Porsi bimbingan Anda didominasi oleh Matematika. Tingkatkan jam belajar coding untuk mempercepat target portofolio digital Anda!
                </div>
              </div>

              {/* Learning checklist targets goals track */}
              <div className="bg-white p-6 rounded-none border border-[#E5E1DA] space-y-4 lg:col-span-2" id="learning_goals_checklist_box">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" id="goals_header">
                  <div>
                    <h3 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider font-mono text-left">Target Capaian Belajar Pribadi</h3>
                    <p className="text-xs text-[#8C857D] mt-0.5">Tentukan kompetensi belajar yang ingin Anda kejar minggu ini</p>
                  </div>

                  <span className="mt-2 sm:mt-0 inline-block bg-[#EDE9E3] text-[#4B5E40] border border-[#D9D1C5] px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider font-mono" id="dynamic_completion_badge">
                    Tuntas: {finishedGoalsCount} / {totalGoalsCount}
                  </span>
                </div>

                {/* Submitting custom targeted goal */}
                <form onSubmit={handleAddGoal} className="flex gap-2" id="add_goal_quick_form">
                  <input
                    id="new_goal_title_field"
                    type="text"
                    required
                    placeholder="Tulis target kompetensi baru (misal: Hafal 10 Rumus Deret Aritmatika)..."
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#FBF9F6] border border-[#E5E1DA] rounded-none text-xs focus:outline-none focus:border-[#1C1C1C] font-semibold text-[#1C1C1C]"
                  />
                  <select
                    id="new_goal_subject_select"
                    value={newGoalSubject}
                    onChange={(e) => setNewGoalSubject(e.target.value)}
                    className="bg-[#FBF9F6] border border-[#E5E1DA] text-[#1C1C1C] rounded-none px-3 py-2 text-xs focus:outline-none font-bold"
                  >
                    <option value="Matematika">Matematika</option>
                    <option value="Web Dev">Web Dev</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                  </select>
                  <button
                    type="submit"
                    id="quick_add_goal_btn"
                    className="px-5 py-2.5 bg-black text-white rounded-none text-xs font-bold hover:bg-[#4B5E40] transition flex items-center justify-center space-x-1 cursor-pointer font-mono uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Tambah</span>
                  </button>
                </form>

                {/* Goals active lists view */}
                <div className="space-y-2 mt-4 max-h-[220px] overflow-y-auto" id="goals_active_list">
                  {goals.length === 0 ? (
                    <div className="p-8 text-center text-[#8C857D] text-xs font-serif italic">Belum ada target pembelajaran personal terdaftar.</div>
                  ) : (
                    goals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`p-3 rounded-none border flex items-center justify-between transition ${
                          goal.completed ? 'bg-[#EDE9E3]/40 border-[#E5E1DA]' : 'bg-[#FBF9F6]/40 border-[#E5E1DA]'
                        }`}
                        id={`goal_panel_${goal.id}`}
                      >
                        <div className="flex items-center space-x-3" id="goal_info_wrap">
                          <button
                            type="button"
                            id={`toggle_goal_btn_${goal.id}`}
                            onClick={() => toggleGoalCompletion(goal.id)}
                            className="focus:outline-none cursor-pointer"
                          >
                            <div className={`w-5 h-5 rounded-none border flex items-center justify-center transition-colors ${
                              goal.completed ? 'bg-[#4B5E40] border-[#4B5E40] text-white' : 'border-[#E5E1DA] bg-white hover:border-[#1C1C1C]'
                            }`} id={`goal_chk_${goal.id}`}>
                              {goal.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                          </button>
                          <div>
                            <span className={`text-xs font-bold block ${goal.completed ? 'line-through text-[#8C857D]' : 'text-[#1C1C1C]'}`}>
                              {goal.title}
                            </span>
                            <span className="text-[9px] text-[#8C857D] font-mono block mt-0.5">Kategori: {goal.subject}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          id={`delete_goal_btn_${goal.id}`}
                          onClick={() => deleteGoal(goal.id)}
                          className="w-8 h-8 rounded-none text-[#8C857D] hover:text-rose-700 hover:bg-[#F1EFE9] border border-transparent hover:border-[#E5E1DA] flex items-center justify-center transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* 4. Humble professional footer */}
      <footer className="border-t border-[#E5E1DA] bg-white py-6 mt-12" id="app_footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between" id="footer_container">
          <div className="text-left" id="footer_brand_group">
            <h2 className="text-sm font-serif italic font-bold text-[#1C1C1C] leading-tight">AjarinDong</h2>
            <p className="text-[11px] text-[#8C857D] mt-0.5">Platform Edukatif Mandiri untuk bimbingan mentor belajar komprehensif</p>
          </div>
          <span className="text-[10px] text-[#8C857D] mt-4 sm:mt-0 font-mono tracking-wider">
            © 2026 AJARINDONG • POWERED BY AI STUDIO GEMINI ENGINE
          </span>
        </div>
      </footer>

    </div>
  );
}
