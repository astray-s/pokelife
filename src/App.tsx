/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ScrollText, 
  Gamepad2, 
  Sword, 
  History, 
  Plus, 
  CheckCircle2, 
  Trophy,
  ChevronRight,
  Info,
  X,
  Home,
  TrendingUp,
  Target,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';
import { 
  DailyMetrics, 
  PlayerState, 
  Quest, 
  WeeklyBoss, 
  CaughtPokemon, 
  Pokemon,
  Rarity,
  Task,
  TaskCategory,
  TASK_CATEGORY_XP
} from './types';
import { 
  POKEMON_POOLS, 
  DAILY_QUEST_TEMPLATES, 
  WEEKLY_QUEST_TEMPLATES, 
  BOSS_NAMES, 
  BOSS_DATA,
  METRIC_KEYS,
  DEFAULT_BUSINESS_HABITS,
  DEFAULT_HEALTH_HABITS,
  DEFAULT_TRAINER_BOOSTS,
  DEFAULT_STATUS_EFFECTS
} from './constants';
import { exportHabitsToCSV, exportTasksToCSV } from './exportToSheets';
import { getSyncSettings, saveSyncSettings, syncAllData, SyncSettings } from './googleSheetsSync';
import { checkMilestones, MILESTONES, Milestone } from './milestones';
import { generateWeeklyStats, generateShareableCard, downloadCard, copyCardToClipboard, WeeklyStats } from './shareCard';
import { Egg, getEggColor, getEggGradient, hatchEgg, EXPANDED_POKEMON_POOLS } from './eggs';

// --- Pokemon-themed Animation Components ---

const PokeballSpinner = ({ size = 40 }: { size?: number }) => (
  <motion.div
    className="relative"
    style={{ width: size, height: size }}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <div className="w-full h-full rounded-full border-4 border-slate-900 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 border-b-4 border-slate-900" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full border-4 border-slate-900 bg-white z-10" />
    </div>
  </motion.div>
);

const StarBurst = ({ delay = 0, color = "yellow" }: { delay?: number, color?: string }) => (
  <motion.div
    initial={{ scale: 0, rotate: 0, opacity: 1 }}
    animate={{ 
      scale: [0, 1.5, 0],
      rotate: [0, 180, 360],
      opacity: [1, 0.8, 0]
    }}
    transition={{ 
      duration: 1.5, 
      delay,
      ease: "easeOut"
    }}
    className="absolute"
    style={{ fontSize: '2rem' }}
  >
    ✨
  </motion.div>
);

const FloatingPokeball = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ 
      y: [-20, 0, -20],
      opacity: [0, 1, 0]
    }}
    transition={{ 
      duration: 2, 
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute"
  >
    <PokeBallIcon size={16} className="text-red-500" />
  </motion.div>
);

const ShakeAnimation = ({ children, trigger }: { children: React.ReactNode, trigger: boolean }) => (
  <motion.div
    animate={trigger ? {
      x: [-10, 10, -10, 10, 0],
      rotate: [-5, 5, -5, 5, 0]
    } : {}}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const PulseGlow = ({ children, color = "blue" }: { children: React.ReactNode, color?: string }) => (
  <motion.div
    animate={{
      boxShadow: [
        `0 0 0px rgba(59, 130, 246, 0)`,
        `0 0 20px rgba(59, 130, 246, 0.5)`,
        `0 0 0px rgba(59, 130, 246, 0)`
      ]
    }}
    transition={{ duration: 2, repeat: Infinity }}
    className="rounded-full"
  >
    {children}
  </motion.div>
);

const ConfettiExplosion = () => {
  const confetti = Array.from({ length: 20 }, (_, i) => i);
  return (
    <>
      {confetti.map((i) => (
        <motion.div
          key={i}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 1,
            opacity: 1 
          }}
          animate={{ 
            x: Math.cos((i / confetti.length) * Math.PI * 2) * 200,
            y: Math.sin((i / confetti.length) * Math.PI * 2) * 200,
            scale: 0,
            opacity: 0
          }}
          transition={{ 
            duration: 1.5,
            ease: "easeOut"
          }}
          className="absolute"
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'][i % 5]
          }}
        />
      ))}
    </>
  );
};

// --- Themed Components ---

const PokeBallIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
    <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="white" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

const Sparkle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1.2, 0], 
      opacity: [0, 1, 0],
      rotate: [0, 45, 90]
    }}
    transition={{ 
      duration: 0.8, 
      delay,
      repeat: Infinity,
      repeatDelay: 2
    }}
    className="absolute text-yellow-400"
  >
    <Plus size={12} fill="currentColor" />
  </motion.div>
);

// New Pokemon-themed animations
const XPBurst = ({ amount }: { amount: number }) => (
  <motion.div
    initial={{ scale: 0, y: 0, opacity: 1 }}
    animate={{ 
      scale: [0, 1.2, 1],
      y: [-30, -60],
      opacity: [1, 1, 0]
    }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    className="absolute text-orange-500 font-black text-xl pointer-events-none z-50"
  >
    +{amount} XP
  </motion.div>
);

const PokeballCatch = () => (
  <motion.div
    initial={{ scale: 1, rotate: 0 }}
    animate={{ 
      scale: [1, 0.8, 1.1, 0.9, 1],
      rotate: [0, -15, 15, -10, 10, 0]
    }}
    transition={{ 
      duration: 0.6,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: "easeInOut"
    }}
  >
    <PokeBallIcon size={48} className="text-red-500" />
  </motion.div>
);

const LevelUpAnimation = () => (
  <motion.div className="relative">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
        animate={{
          scale: [0, 1, 0],
          x: Math.cos((i / 8) * Math.PI * 2) * 100,
          y: Math.sin((i / 8) * Math.PI * 2) * 100,
          opacity: [1, 1, 0]
        }}
        transition={{ duration: 1, delay: i * 0.05 }}
        className="absolute text-3xl"
      >
        ⭐
      </motion.div>
    ))}
  </motion.div>
);

const ShinySparkle = () => (
  <motion.div className="absolute inset-0 pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          x: [0, (i % 2 ? 20 : -20)],
          y: [0, (i % 3 ? 20 : -20)]
        }}
        transition={{
          duration: 1,
          delay: i * 0.1,
          repeat: Infinity,
          repeatDelay: 2
        }}
        className="absolute top-1/2 left-1/2 text-yellow-300 text-2xl"
        style={{
          transform: `rotate(${i * 60}deg)`
        }}
      >
        ✨
      </motion.div>
    ))}
  </motion.div>
);

const BounceIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ scale: 0, y: -50 }}
    animate={{ scale: 1, y: 0 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay
    }}
  >
    {children}
  </motion.div>
);

const SlideInFromRight = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const FloatingBadge = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{
      y: [-5, 5, -5],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const PokemonAppear = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 1 }}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay
    }}
  >
    {children}
  </motion.div>
);

// Khan Academy-style animations
const ParticleExplosion = ({ color = "#10b981" }: { color?: string }) => {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 1,
            opacity: 1 
          }}
          animate={{ 
            x: Math.cos((i / particles.length) * Math.PI * 2) * 80,
            y: Math.sin((i / particles.length) * Math.PI * 2) * 80,
            scale: 0,
            opacity: 0
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
          className="absolute top-1/2 left-1/2"
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: color
          }}
        />
      ))}
    </div>
  );
};

const CheckmarkAnimation = ({ size = 60, color = "#10b981" }: { size?: number, color?: string }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    initial={{ scale: 0, rotate: -90 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 15
    }}
  >
    <motion.circle
      cx="30"
      cy="30"
      r="28"
      fill="none"
      stroke={color}
      strokeWidth="4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M15 30 L25 40 L45 20"
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
    />
  </motion.svg>
);

const ProgressRing = ({ progress, size = 120, strokeWidth = 8 }: { progress: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{
          strokeDasharray: circumference
        }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const PulseRing = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ 
      scale: [0.8, 1.2, 1.4],
      opacity: [0, 0.5, 0]
    }}
    transition={{ 
      duration: 1,
      delay,
      ease: "easeOut"
    }}
    className="absolute inset-0 rounded-full border-4 border-green-400"
  />
);

const SuccessAnimation = () => (
  <div className="relative w-20 h-20">
    <PulseRing />
    <PulseRing delay={0.2} />
    <div className="absolute inset-0 flex items-center justify-center">
      <CheckmarkAnimation size={60} />
    </div>
    <ParticleExplosion color="#10b981" />
  </div>
);

const NumberCounter = ({ value, duration = 1 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
};

const XPGainAnimation = ({ amount, onComplete }: { amount: number, onComplete?: () => void }) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0, y: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.2, 1],
        y: [0, -20, -40],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: 2,
        times: [0, 0.3, 0.7, 1],
        ease: "easeOut"
      }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
    >
      <div className="relative">
        <ParticleExplosion color="#f59e0b" />
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-white">
          <div className="text-sm font-black uppercase tracking-widest opacity-80">XP Gained</div>
          <div className="text-4xl font-black">
            +<NumberCounter value={amount} duration={0.8} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TaskCompleteAnimation = ({ onComplete }: { onComplete?: () => void }) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
    >
      <SuccessAnimation />
    </motion.div>
  );
};

// --- Utils ---

const getTodayISO = () => {
  // Get current date in PST/PDT (Los Angeles timezone)
  const now = new Date();
  const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const year = pstDate.getFullYear();
  const month = String(pstDate.getMonth() + 1).padStart(2, '0');
  const day = String(pstDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekId = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

const calculateXP = (m: Omit<DailyMetrics, 'date' | 'xpEarned' | 'claimedQuestIds'>, dateString: string) => {
  // MAIN ATTACKS (Business & Work) - Highest weightage
  let businessXP = m.workHours * 20 + 
                   m.discoveryCalls * 40 + 
                   m.networkingCalls * 30 + 
                   m.salesCalls * 50 + 
                   m.firstDmsSent * 10 + 
                   m.followUpsSent * 10 + 
                   m.commentingMinutes * 2 + 
                   m.postsCreated * 20 + 
                   m.postsPosted * 30 + 
                   m.callsBooked * 50 + 
                   m.callsTaken * 25 + 
                   m.totalDmsSent * 2;
  
  // SPECIAL MOVES (Health & Vitality) - Medium weightage
  let healthXP = 0;
  
  // Sleep quality (goal: asleep by 9 PM = 21:00, awake by 5 AM = 05:00)
  // Parse time strings (HH:MM format)
  const parseTime = (timeStr: string) => {
    if (!timeStr) return 999; // Invalid time returns high number
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + (minutes / 60);
  };
  
  const asleepTime = parseTime(m.timeAsleep);
  const awakeTime = parseTime(m.timeAwake);
  
  if (asleepTime <= 21) healthXP += 30; // Bonus for sleeping by 9 PM
  if (awakeTime <= 5) healthXP += 30; // Bonus for waking by 5 AM
  
  healthXP += m.coldShowers * 15; // Cold showers
  healthXP += m.fastHours * 3; // Fasting
  
  // Exercise - 60 XP for any exercise type
  if (m.exerciseType && m.exerciseType !== 'none') {
    healthXP += 60;
  }
  
  healthXP += m.foodTracking ? 25 : 0; // Food tracking
  
  // TRAINER BOOSTS (Daily Habits) - Lower weightage
  let habitsXP = 0;
  habitsXP += m.affirmations ? 15 : 0;
  habitsXP += m.visualizations ? 15 : 0;
  habitsXP += m.planTomorrow ? 15 : 0;
  habitsXP += m.storyList ? 15 : 0;
  habitsXP += m.journal ? 20 : 0;
  
  // Total positive XP
  let totalBase = businessXP + healthXP + habitsXP;

  // Apply daily bonus
  const seed = parseInt(dateString.replace(/-/g, '')) || 1;
  const dailyBonus = 0.05 + ((seed % 10) / 100); 
  totalBase *= (1 + dailyBonus);

  // STATUS EFFECTS (Bad Habits) - Reduce XP by up to 20%
  let statusPenalty = 0;
  if (m.youtube) statusPenalty += 5; // 5% penalty
  if (m.reels) statusPenalty += 5; // 5% penalty
  if (m.shorts) statusPenalty += 5; // 5% penalty
  if (m.processedFood) statusPenalty += 5; // 5% penalty
  if (m.gaming) statusPenalty += 5; // 5% penalty
  
  // Apply penalty
  totalBase *= (1 - statusPenalty / 100);

  return Math.floor(totalBase);
};

const getLevel = (totalXP: number) => Math.floor(Math.sqrt(totalXP / 150));
const getXPForLevel = (level: number) => level * level * 150;

// --- Components ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'today' | 'quests' | 'pokemon' | 'eggs' | 'boss' | 'tasks' | 'history'>('home');
  const [syncSettings, setSyncSettings] = useState<SyncSettings>(getSyncSettings);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [newMilestone, setNewMilestone] = useState<{ milestone: Milestone; pokemon: CaughtPokemon } | null>(null);
  const [showXPGain, setShowXPGain] = useState<number | null>(null);
  const [showTaskComplete, setShowTaskComplete] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCardBlob, setShareCardBlob] = useState<Blob | null>(null);
  const [shareCardStats, setShareCardStats] = useState<WeeklyStats | null>(null);
  
  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    const saved = localStorage.getItem('synthPoke_playerState');
    const defaultState = {
      totalXP: 0,
      level: 0,
      monstersOwned: [],
      eggs: [],
      questsSinceDrop: 0,
      lastDailyReset: '',
      lastWeeklyReset: '',
      unlockedMilestones: [],
      customHabits: {
        business: DEFAULT_BUSINESS_HABITS,
        health: DEFAULT_HEALTH_HABITS,
        trainerBoosts: DEFAULT_TRAINER_BOOSTS,
        statusEffects: DEFAULT_STATUS_EFFECTS
      },
      categoryVisibility: {
        business: true,
        health: true,
        trainerBoosts: true,
        statusEffects: true
      }
    };
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure new properties exist
      return {
        ...defaultState,
        ...parsed,
        eggs: parsed.eggs || [],
        customHabits: parsed.customHabits || defaultState.customHabits,
        categoryVisibility: parsed.categoryVisibility || defaultState.categoryVisibility,
        unlockedMilestones: parsed.unlockedMilestones || []
      };
    }
    
    return defaultState;
  });

  const [dailyMetrics, setDailyMetrics] = useState<Record<string, DailyMetrics>>(() => {
    const saved = localStorage.getItem('synthPoke_dailyMetrics');
    return saved ? JSON.parse(saved) : {};
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('synthPoke_quests');
    return saved ? JSON.parse(saved) : [];
  });

  const [weeklyBoss, setWeeklyBoss] = useState<WeeklyBoss | null>(() => {
    const saved = localStorage.getItem('synthPoke_weeklyBoss');
    return saved ? JSON.parse(saved) : null;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('synthPoke_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [newDrop, setNewDrop] = useState<{ pokemon?: Pokemon; item?: string; egg?: Egg } | null>(null);
  const [hatchingEgg, setHatchingEgg] = useState<Egg | null>(null);
  const [hatchedPokemon, setHatchedPokemon] = useState<CaughtPokemon | null>(null);

  // --- Persistence ---
  const isResettingRef = React.useRef(false);

  useEffect(() => {
    if (isResettingRef.current) return;
    localStorage.setItem('synthPoke_playerState', JSON.stringify(playerState));
  }, [playerState]);

  useEffect(() => {
    if (isResettingRef.current) return;
    localStorage.setItem('synthPoke_dailyMetrics', JSON.stringify(dailyMetrics));
  }, [dailyMetrics]);

  useEffect(() => {
    if (isResettingRef.current) return;
    localStorage.setItem('synthPoke_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    if (isResettingRef.current) return;
    localStorage.setItem('synthPoke_weeklyBoss', JSON.stringify(weeklyBoss));
  }, [weeklyBoss]);

  useEffect(() => {
    if (isResettingRef.current) return;
    localStorage.setItem('synthPoke_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // --- Initialization & Resets ---
  useEffect(() => {
    // Cleanup any legacy quests that might be stuck in localStorage
    const legacyKeywords = ['skool', 'synthesizer', 'module', 'lesson'];
    setQuests(prev => {
      const hasLegacy = prev.some(q => legacyKeywords.some(k => q.name.toLowerCase().includes(k) || q.description.toLowerCase().includes(k)));
      if (hasLegacy) {
        console.log('Cleaning up legacy quests...');
        return prev.filter(q => !legacyKeywords.some(k => q.name.toLowerCase().includes(k) || q.description.toLowerCase().includes(k)));
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const today = getTodayISO();
    const currentWeek = getWeekId(new Date());

    // Daily Reset
    if (playerState.lastDailyReset !== today) {
      // Pick 7 random daily quests from templates that match player level
      const levelAppropriate = DAILY_QUEST_TEMPLATES.filter(t => {
        const min = (t as any).minLevel ?? 0;
        const max = (t as any).maxLevel ?? 999;
        return playerState.level >= min && playerState.level <= max;
      });
      
      const shuffled = [...levelAppropriate].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 7);
      
      const newDailies: Quest[] = selected.map((t, i) => ({
        ...t,
        id: `daily-${today}-${i}`,
        type: 'daily',
        status: 'active',
        startDate: today,
        requirements: t.requirements.map(r => ({ ...r, metric: r.metric as any }))
      }));

      // Completely erase all previous daily quests (even active ones) to ensure fresh start
      setQuests(prev => [...prev.filter(q => q.type !== 'daily'), ...newDailies]);
      setPlayerState(prev => ({ ...prev, lastDailyReset: today }));
    }

    // Weekly Reset
    if (playerState.lastWeeklyReset !== currentWeek) {
      // Pick 4 random weekly quests from templates
      const shuffled = [...WEEKLY_QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);

      const newWeeklies: Quest[] = selected.map((t, i) => ({
        ...t,
        id: `weekly-${currentWeek}-${i}`,
        type: 'weekly',
        status: 'active',
        startDate: currentWeek,
        requirements: t.requirements.map(r => ({ ...r, metric: r.metric as any }))
      }));

      // Create new boss
      const newBoss: WeeklyBoss = {
        weekId: currentWeek,
        name: BOSS_NAMES[Math.floor(Math.random() * BOSS_NAMES.length)],
        hpTotal: 1000 + (playerState.level * 200),
        hpRemaining: 1000 + (playerState.level * 200),
        weaknessType: METRIC_KEYS[Math.floor(Math.random() * METRIC_KEYS.length)],
        defeated: false
      };

      // Completely erase all previous weekly quests
      setQuests(prev => [...prev.filter(q => q.type !== 'weekly'), ...newWeeklies]);
      setWeeklyBoss(newBoss);
      setPlayerState(prev => ({ ...prev, lastWeeklyReset: currentWeek }));
    }
  }, [playerState.lastDailyReset, playerState.lastWeeklyReset, playerState.level]);

  const [selectedDate, setSelectedDate] = useState(getTodayISO());

  // --- Actions ---

  const saveMetrics = (metrics: Omit<DailyMetrics, 'date' | 'xpEarned' | 'claimedQuestIds'>, date?: string) => {
    const targetDate = date || getTodayISO();
    const oldXP = dailyMetrics[targetDate]?.xpEarned || 0;
    const newXP = calculateXP(metrics, targetDate);
    const xpDiff = newXP - oldXP;

    const updatedMetrics: DailyMetrics = {
      ...metrics,
      date: targetDate,
      xpEarned: newXP,
      claimedQuestIds: dailyMetrics[targetDate]?.claimedQuestIds || []
    };

    setDailyMetrics(prev => {
      const newMetrics = { ...prev, [targetDate]: updatedMetrics };
      
      // Check for milestone unlocks
      const unlockedMilestones = playerState.unlockedMilestones || [];
      const newlyUnlocked = checkMilestones(newMetrics, unlockedMilestones);
      
      if (newlyUnlocked.length > 0) {
        // Unlock the first new milestone - give an egg
        const milestone = newlyUnlocked[0];
        
        const milestoneEgg: Egg = {
          id: Math.random().toString(36).substr(2, 9),
          rarity: milestone.reward.rarity,
          obtainedAt: new Date().toISOString(),
          source: 'milestone'
        };
        
        setPlayerState(prev => ({
          ...prev,
          eggs: [milestoneEgg, ...prev.eggs],
          unlockedMilestones: [
            ...(prev.unlockedMilestones || []),
            {
              milestoneId: milestone.id,
              unlockedAt: new Date().toISOString(),
              pokemon: null as any // Will be filled when egg is hatched
            }
          ]
        }));
        
        setNewMilestone({ milestone, pokemon: null as any });
        setNewDrop({ egg: milestoneEgg });
      }
      
      // Auto-sync if enabled
      if (syncSettings.autoSync && syncSettings.sheetUrl) {
        syncAllData(newMetrics, tasks, syncSettings.sheetUrl).then(result => {
          if (result.success) {
            setSyncStatus('✓ Synced');
            setTimeout(() => setSyncStatus(''), 2000);
          }
        });
      }
      
      return newMetrics;
    });
    
    if (xpDiff > 0) {
      setShowXPGain(xpDiff);
      updateTotalXP(xpDiff);
      
      // Only apply boss damage if the log is for the current week
      const currentWeek = getWeekId(new Date());
      const targetWeek = getWeekId(new Date(targetDate));
      if (currentWeek === targetWeek) {
        applyBossDamage(metrics, xpDiff);
      }
      
      // Check for threshold drop (every 80 XP)
      const oldThresholds = Math.floor(oldXP / 80);
      const newThresholds = Math.floor(newXP / 80);
      if (newThresholds > oldThresholds) {
        rollDrop();
      }
    }
  };

  const [showLevelUp, setShowLevelUp] = useState<{ level: number, pokemon: CaughtPokemon } | null>(null);

  const updateTotalXP = (amount: number) => {
    setPlayerState(prev => {
      const newTotal = Math.max(0, prev.totalXP + amount);
      const newLevel = getLevel(newTotal);
      
      let newEggs = [...prev.eggs];
      if (newLevel > prev.level) {
        // Give an egg based on level
        const rarity = newLevel >= 21 ? 'legendary' : 
                        newLevel >= 13 ? 'epic' : 
                        newLevel >= 6 ? 'rare' : 'uncommon';
        
        const levelUpEgg: Egg = {
          id: Math.random().toString(36).substr(2, 9),
          rarity,
          obtainedAt: new Date().toISOString(),
          source: 'levelup'
        };
        
        newEggs.push(levelUpEgg);
        setShowLevelUp({ level: newLevel, pokemon: null as any }); // We'll update this UI later
        setNewDrop({ egg: levelUpEgg });
      }

      return {
        ...prev,
        totalXP: newTotal,
        level: newLevel,
        eggs: newEggs
      };
    });
  };

  const applyBossDamage = (metrics: any, xpDiff: number) => {
    if (!weeklyBoss || weeklyBoss.defeated) return;

    let damage = 0;
    damage += metrics.workHours * 5;
    damage += metrics.discoveryCalls * 15;
    damage += metrics.salesCalls * 25;
    damage += metrics.postsPosted * 10;
    damage += metrics.callsBooked * 20;

    // Weakness bonus
    const weaknessValue = metrics[weeklyBoss.weaknessType];
    if (weaknessValue > 0) {
      damage += damage * 0.5; // 50% bonus for weakness
    }

    setWeeklyBoss(prev => {
      if (!prev) return null;
      const newHP = Math.max(0, prev.hpRemaining - damage);
      const justDefeated = newHP === 0 && !prev.defeated;
      
      if (justDefeated) {
        rollDrop(true); // Guaranteed rare+ drop
      }

      return {
        ...prev,
        hpRemaining: newHP,
        defeated: justDefeated || prev.defeated
      };
    });
  };

  const rollDrop = (guaranteedRare = false) => {
    const chance = 0.2 + 0.05 * playerState.questsSinceDrop;
    const effectiveChance = Math.min(0.7, chance);

    if (guaranteedRare || Math.random() < effectiveChance) {
      const roll = Math.floor(Math.random() * 100);
      let rarity: Rarity = 'uncommon';
      
      if (guaranteedRare) {
        if (roll < 60) rarity = 'rare';
        else if (roll < 90) rarity = 'epic';
        else rarity = 'legendary';
      } else {
        if (roll < 40) {
          // XP Candy
          updateTotalXP(50);
          setNewDrop({ item: 'XP Candy (+50 XP)' });
          setPlayerState(prev => ({ ...prev, questsSinceDrop: 0 }));
          return;
        } else if (roll < 80) rarity = 'uncommon';
        else if (roll < 93) rarity = 'rare';
        else if (roll < 98) rarity = 'epic';
        else rarity = 'legendary';
      }

      // Create an egg instead of directly giving Pokemon
      const newEgg: Egg = {
        id: Math.random().toString(36).substr(2, 9),
        rarity,
        obtainedAt: new Date().toISOString(),
        source: guaranteedRare ? 'boss' : 'threshold'
      };

      setPlayerState(prev => ({
        ...prev,
        eggs: [newEgg, ...prev.eggs],
        questsSinceDrop: 0
      }));
      setNewDrop({ egg: newEgg });
    } else {
      setPlayerState(prev => ({ ...prev, questsSinceDrop: prev.questsSinceDrop + 1 }));
    }
  };

  const claimQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status !== 'active') return;

    // Check requirements
    const today = getTodayISO();
    const metrics = dailyMetrics[today];
    
    // For weekly, we need to sum up metrics for the week
    // Simplified: just check if it's completed based on current state
    if (!isQuestCompleted(quest)) return;

    updateTotalXP(quest.baseXPReward);
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'claimed' } : q));
    rollDrop();
  };

  const handleHatchEgg = (eggId: string) => {
    const egg = playerState.eggs.find(e => e.id === eggId);
    if (!egg) return;

    setHatchingEgg(egg);
    
    // Animate egg hatching
    setTimeout(() => {
      const { pokemon, isShiny } = hatchEgg(egg);
      const caughtPokemon: CaughtPokemon = {
        ...pokemon,
        instanceId: Math.random().toString(36).substr(2, 9),
        caughtAt: new Date().toISOString(),
        isShiny
      };

      setPlayerState(prev => ({
        ...prev,
        eggs: prev.eggs.filter(e => e.id !== eggId),
        monstersOwned: [caughtPokemon, ...prev.monstersOwned]
      }));

      setHatchedPokemon(caughtPokemon);
      setHatchingEgg(null);
    }, 2000); // 2 second hatch animation
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const deleteEntry = (date: string) => {
    const entry = dailyMetrics[date];
    if (entry) {
      const xpToSubtract = entry.xpEarned;
      updateTotalXP(-xpToSubtract);
    }
    
    setDailyMetrics(prev => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
    setEntryToDelete(null);
  };

  const factoryReset = () => {
    // Stop all state persistence immediately
    isResettingRef.current = true;
    
    // Clear localStorage
    localStorage.clear();
    
    // Reset state to defaults to update UI immediately
    setPlayerState({
      totalXP: 0,
      level: 0,
      monstersOwned: [],
      questsSinceDrop: 0,
      lastDailyReset: '',
      lastWeeklyReset: ''
    });
    setDailyMetrics({});
    setQuests([]);
    setWeeklyBoss(null);
    
    // Force a clean reload
    window.location.reload();
  };

  const refreshQuests = () => {
    const today = getTodayISO();
    const levelAppropriate = DAILY_QUEST_TEMPLATES.filter(t => {
      const min = (t as any).minLevel ?? 0;
      const max = (t as any).maxLevel ?? 999;
      return playerState.level >= min && playerState.level <= max;
    });
    
    const shuffled = [...levelAppropriate].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 7);
    
    const newDailies: Quest[] = selected.map((t, i) => ({
      ...t,
      id: `daily-${today}-${i}-${Date.now()}`,
      type: 'daily',
      status: 'active',
      startDate: today,
      requirements: t.requirements.map(r => ({ ...r, metric: r.metric as any }))
    }));

    setQuests(prev => [...prev.filter(q => q.type !== 'daily'), ...newDailies]);
  };

  const handleShareProgress = async () => {
    const stats = generateWeeklyStats(
      dailyMetrics,
      playerState.level,
      playerState.monstersOwned,
      quests
    );
    
    setShareCardStats(stats);
    
    const blob = await generateShareableCard(stats);
    setShareCardBlob(blob);
    setShowShareModal(true);
  };

  const isQuestCompleted = (quest: Quest) => {
    if (quest.status === 'claimed') return true;
    
    const today = getTodayISO();
    const currentWeek = getWeekId(new Date());

    if (quest.type === 'daily') {
      const metrics = dailyMetrics[today];
      if (!metrics) return false;
      return quest.requirements.every(req => {
        const val = (metrics[req.metric] as any) === true ? 1 : (metrics[req.metric] as any) === false ? 0 : (metrics[req.metric] as number);
        const gteOk = req.gte === undefined || val >= req.gte;
        const lteOk = req.lte === undefined || val <= req.lte;
        return gteOk && lteOk;
      });
    } else {
      // Weekly: sum last 7 days or current week
      const weekMetrics = (Object.values(dailyMetrics) as DailyMetrics[]).filter(m => getWeekId(new Date(m.date)) === currentWeek);
      return quest.requirements.every(req => {
        const total = weekMetrics.reduce((sum, m) => {
          const val = (m[req.metric] as any) === true ? 1 : (m[req.metric] as any) === false ? 0 : (m[req.metric] as number);
          return sum + val;
        }, 0);
        const gteOk = req.gte === undefined || total >= req.gte;
        const lteOk = req.lte === undefined || total <= req.lte;
        return gteOk && lteOk;
      });
    }
  };

  const getQuestProgress = (quest: Quest) => {
    const today = getTodayISO();
    const currentWeek = getWeekId(new Date());

    if (quest.type === 'daily') {
      const metrics = dailyMetrics[today];
      return quest.requirements.map(req => {
        const val = metrics ? ((metrics[req.metric] as any) === true ? 1 : (metrics[req.metric] as any) === false ? 0 : (metrics[req.metric] as number)) : 0;
        return {
          label: req.metric,
          current: val,
          target: req.gte !== undefined ? req.gte : req.lte,
          isLte: req.lte !== undefined
        };
      });
    } else {
      const weekMetrics = (Object.values(dailyMetrics) as DailyMetrics[]).filter(m => getWeekId(new Date(m.date)) === currentWeek);
      return quest.requirements.map(req => {
        const total = weekMetrics.reduce((sum, m) => {
          const val = (m[req.metric] as any) === true ? 1 : (m[req.metric] as any) === false ? 0 : (m[req.metric] as number);
          return sum + val;
        }, 0);
        return {
          label: req.metric,
          current: total,
          target: req.gte !== undefined ? req.gte : req.lte,
          isLte: req.lte !== undefined
        };
      });
    }
  };

  // --- Render Helpers ---

  const level = playerState.level;
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const xpIntoLevel = playerState.totalXP - currentLevelXP;
  const xpRequiredForNext = nextLevelXP - currentLevelXP;
  const progress = Math.min(1, xpIntoLevel / xpRequiredForNext);

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#4A4A4A] font-sans pb-24">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-[#E8E4D8] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 20 }}
              className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shadow-inner border border-red-100 relative overflow-hidden"
            >
              <PokeBallIcon className="text-red-500" size={28} />
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-transparent pointer-events-none" />
            </motion.div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-800 flex items-center gap-2">
                PokeLife
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">v2.0</span>
              </h1>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-white bg-slate-800 px-2 py-0.5 rounded-md">LV</span>
                    <span className="text-sm font-black text-slate-800">{level}</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {Math.round(progress * 100)}% to LV {level + 1}
                  </div>
                </div>
                <div className="w-40 h-3 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-800 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                  <motion.div 
                    className={`h-full relative transition-colors duration-500 ${
                      progress > 0.5 ? 'bg-emerald-400' : progress > 0.2 ? 'bg-yellow-400' : 'bg-red-500'
                    }`} 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.3)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0.3)_75%,transparent_75%,transparent)] bg-[length:12px_12px] animate-[progress_1.5s_linear_infinite]" />
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right group relative cursor-help">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-end gap-1">
              Exp Points
              <Info size={10} className="text-slate-300" />
            </div>
            <div className="font-black text-2xl text-slate-800 tabular-nums">{playerState.totalXP}</div>
            
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-left pointer-events-none border border-slate-800">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-800 pb-2">XP Breakdown</div>
              
              {/* Main Attacks */}
              <div className="mb-3">
                <div className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2">⚔️ Main Attacks (Business)</div>
                <div className="grid grid-cols-1 gap-y-1 text-[10px] font-bold">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Work Hours</span>
                    <span className="text-orange-400">20 XP/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Discovery/Sales Calls</span>
                    <span className="text-orange-400">40-50 XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Calls Booked</span>
                    <span className="text-orange-400">50 XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Posts/DMs</span>
                    <span className="text-orange-400">10-30 XP</span>
                  </div>
                </div>
              </div>

              {/* Special Moves */}
              <div className="mb-3">
                <div className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-2">💪 Special Moves (Health)</div>
                <div className="grid grid-cols-1 gap-y-1 text-[10px] font-bold">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Sleep/Wake Goals</span>
                    <span className="text-orange-400">30 XP each</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Cold Showers</span>
                    <span className="text-orange-400">15 XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Exercise (any type)</span>
                    <span className="text-orange-400">60 XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Fasting</span>
                    <span className="text-orange-400">3 XP/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Food Tracking</span>
                    <span className="text-orange-400">25 XP</span>
                  </div>
                </div>
              </div>

              {/* Trainer Boosts */}
              <div className="mb-3">
                <div className="text-[9px] font-black text-yellow-400 uppercase tracking-widest mb-2">✨ Trainer Boosts (Habits)</div>
                <div className="grid grid-cols-1 gap-y-1 text-[10px] font-bold">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Daily Habits</span>
                    <span className="text-orange-400">15-20 XP each</span>
                  </div>
                </div>
              </div>

              {/* Status Effects */}
              <div className="mb-3">
                <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-2">☠️ Status Effects (Bad Habits)</div>
                <div className="grid grid-cols-1 gap-y-1 text-[10px] font-bold">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Each Bad Habit</span>
                    <span className="text-red-400">-5% XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Max Penalty (all 5)</span>
                    <span className="text-red-400">-25% XP</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[9px] text-slate-500 italic leading-relaxed">
                * A random <span className="text-emerald-400">5-15% Daily Bonus</span> is applied before penalties.
              </div>
              
              {/* Arrow */}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 rotate-45 border-l border-t border-slate-800" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <HomeTab 
                tasks={tasks}
                quests={quests}
                dailyMetrics={dailyMetrics}
                weeklyBoss={weeklyBoss}
                isQuestCompleted={isQuestCompleted}
                onNavigate={(tab) => setActiveTab(tab)}
                onToggleTask={(taskId) => {
                  const task = tasks.find(t => t.id === taskId);
                  if (task && !task.completed) {
                    setShowTaskComplete(true);
                    setTasks(prev => prev.map(t => 
                      t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
                    ));
                    setShowXPGain(task.xpReward);
                    updateTotalXP(task.xpReward);
                    if (Math.random() < 0.02) {
                      rollDrop();
                    }
                  }
                }}
              />
            </motion.div>
          )}
          {activeTab === 'today' && (
            <motion.div 
              key="today"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <TodayTab 
                metrics={dailyMetrics[selectedDate]} 
                onSave={(m) => saveMetrics(m, selectedDate)} 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                categoryVisibility={playerState.categoryVisibility!}
                onToggleCategory={(category) => {
                  setPlayerState(prev => ({
                    ...prev,
                    categoryVisibility: {
                      ...prev.categoryVisibility!,
                      [category]: !prev.categoryVisibility![category as keyof typeof prev.categoryVisibility]
                    }
                  }));
                }}
              />
            </motion.div>
          )}
          {activeTab === 'quests' && (
            <motion.div 
              key="quests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <QuestsTab 
                quests={quests} 
                onClaim={claimQuest} 
                isCompleted={isQuestCompleted}
                getProgress={getQuestProgress}
                onRefresh={refreshQuests}
              />
            </motion.div>
          )}
          {activeTab === 'pokemon' && (
            <motion.div 
              key="pokemon"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PokemonTab monsters={playerState.monstersOwned} />
            </motion.div>
          )}
          {activeTab === 'eggs' && (
            <motion.div 
              key="eggs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <EggsTab eggs={playerState.eggs} onHatchEgg={handleHatchEgg} />
            </motion.div>
          )}
          {activeTab === 'boss' && (
            <motion.div 
              key="boss"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <BossTab boss={weeklyBoss} />
            </motion.div>
          )}
          {activeTab === 'tasks' && (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <TasksTab 
                tasks={tasks}
                onAddTask={(task) => {
                  setTasks(prev => {
                    const newTasks = [task, ...prev];
                    // Auto-sync if enabled
                    if (syncSettings.autoSync && syncSettings.sheetUrl) {
                      syncAllData(dailyMetrics, newTasks, syncSettings.sheetUrl).then(result => {
                        if (result.success) {
                          setSyncStatus('✓ Synced');
                          setTimeout(() => setSyncStatus(''), 2000);
                        }
                      });
                    }
                    return newTasks;
                  });
                }}
                onToggleTask={(taskId) => {
                  const task = tasks.find(t => t.id === taskId);
                  if (task && !task.completed) {
                    setShowTaskComplete(true);
                    // Mark as completed
                    setTasks(prev => {
                      const newTasks = prev.map(t => 
                        t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
                      );
                      // Auto-sync if enabled
                      if (syncSettings.autoSync && syncSettings.sheetUrl) {
                        syncAllData(dailyMetrics, newTasks, syncSettings.sheetUrl).then(result => {
                          if (result.success) {
                            setSyncStatus('✓ Synced');
                            setTimeout(() => setSyncStatus(''), 2000);
                          }
                        });
                      }
                      return newTasks;
                    });
                    // Award XP
                    setShowXPGain(task.xpReward);
                    updateTotalXP(task.xpReward);
                    // 2% chance of Pokemon drop
                    if (Math.random() < 0.02) {
                      rollDrop();
                    }
                  }
                }}
                onDeleteTask={(taskId) => {
                  setTasks(prev => {
                    const newTasks = prev.filter(t => t.id !== taskId);
                    // Auto-sync if enabled
                    if (syncSettings.autoSync && syncSettings.sheetUrl) {
                      syncAllData(dailyMetrics, newTasks, syncSettings.sheetUrl).then(result => {
                        if (result.success) {
                          setSyncStatus('✓ Synced');
                          setTimeout(() => setSyncStatus(''), 2000);
                        }
                      });
                    }
                    return newTasks;
                  });
                }}
              />
            </motion.div>
          )}
          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <HistoryTab 
                metrics={dailyMetrics} 
                tasks={tasks}
                syncSettings={syncSettings}
                syncStatus={syncStatus}
                onSyncSettingsChange={(settings) => {
                  setSyncSettings(settings);
                  saveSyncSettings(settings);
                }}
                onManualSync={() => {
                  if (syncSettings.sheetUrl) {
                    setSyncStatus('Syncing...');
                    syncAllData(dailyMetrics, tasks, syncSettings.sheetUrl).then(result => {
                      setSyncStatus(result.success ? '✓ Synced!' : '✗ Failed');
                      setTimeout(() => setSyncStatus(''), 3000);
                    });
                  }
                }}
                onDelete={(date) => setEntryToDelete(date)} 
                onReset={() => setShowResetConfirm(true)} 
                onEditDate={(date) => {
                  setSelectedDate(date);
                  setActiveTab('today');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Custom Modals */}
      <AnimatePresence>
        {showResetConfirm && (
          <Modal
            title="Factory Reset"
            message="WARNING: This will delete ALL your progress, Pokémon, and history. This cannot be undone. Are you sure?"
            confirmLabel="Reset Everything"
            onConfirm={factoryReset}
            onCancel={() => setShowResetConfirm(false)}
            variant="danger"
          />
        )}
        {entryToDelete && (
          <Modal
            title="Delete Entry"
            message={`Are you sure you want to delete the entry for ${new Date(entryToDelete).toLocaleDateString()}?`}
            confirmLabel="Delete"
            onConfirm={() => deleteEntry(entryToDelete)}
            onCancel={() => setEntryToDelete(null)}
            variant="danger"
          />
        )}
      </AnimatePresence>

      {/* Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-[#E8E4D8] px-2 py-2 z-40">
        <div className="max-w-2xl mx-auto flex justify-around items-center">
          <TabButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<Home size={20} />} 
            label="Home" 
          />
          <TabButton 
            active={activeTab === 'today'} 
            onClick={() => setActiveTab('today')} 
            icon={<LayoutDashboard size={20} />} 
            label="Log" 
          />
          <TabButton 
            active={activeTab === 'quests'} 
            onClick={() => setActiveTab('quests')} 
            icon={<ScrollText size={20} />} 
            label="Quests" 
          />
          <TabButton 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
            icon={<CheckCircle2 size={20} />} 
            label="Tasks" 
          />
          <TabButton 
            active={activeTab === 'pokemon'} 
            onClick={() => setActiveTab('pokemon')} 
            icon={<Gamepad2 size={20} />} 
            label="Dex" 
          />
          <TabButton 
            active={activeTab === 'eggs'} 
            onClick={() => setActiveTab('eggs')} 
            icon={<span className="text-xl">🥚</span>} 
            label="Eggs" 
          />
          <TabButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<History size={20} />} 
            label="Logs" 
          />
        </div>
      </nav>

      {/* Drop Popup */}
      <AnimatePresence>
        {newDrop && (
          <DropPopup drop={newDrop} onClose={() => setNewDrop(null)} />
        )}
      </AnimatePresence>

      {/* Level Up Popup */}
      <AnimatePresence>
        {showLevelUp !== null && (
          <LevelUpPopup 
            level={showLevelUp.level} 
            pokemon={showLevelUp.pokemon} 
            onClose={() => setShowLevelUp(null)} 
          />
        )}
      </AnimatePresence>

      {/* Milestone Unlock Popup */}
      <AnimatePresence>
        {newMilestone && (
          <MilestonePopup 
            milestone={newMilestone.milestone}
            pokemon={newMilestone.pokemon}
            onClose={() => setNewMilestone(null)} 
          />
        )}
      </AnimatePresence>

      {/* Egg Hatching Modal */}
      <AnimatePresence>
        {hatchingEgg && (
          <EggHatchingModal egg={hatchingEgg} />
        )}
      </AnimatePresence>

      {/* Hatched Pokemon Modal */}
      <AnimatePresence>
        {hatchedPokemon && (
          <HatchedPokemonModal 
            pokemon={hatchedPokemon}
            onClose={() => setHatchedPokemon(null)}
          />
        )}
      </AnimatePresence>

      {/* XP Gain Animation */}
      <AnimatePresence>
        {showXPGain !== null && (
          <XPGainAnimation 
            amount={showXPGain}
            onComplete={() => setShowXPGain(null)}
          />
        )}
      </AnimatePresence>

      {/* Task Complete Animation */}
      <AnimatePresence>
        {showTaskComplete && (
          <TaskCompleteAnimation 
            onComplete={() => setShowTaskComplete(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Share Button */}
      <motion.button
        onClick={handleShareProgress}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:shadow-purple-300"
        title="Share Weekly Progress"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </motion.button>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && shareCardBlob && shareCardStats && (
          <ShareProgressModal
            blob={shareCardBlob}
            stats={shareCardStats}
            onClose={() => {
              setShowShareModal(false);
              setShareCardBlob(null);
              setShareCardStats(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ 
  title, 
  message, 
  confirmLabel, 
  onConfirm, 
  onCancel, 
  variant = 'primary' 
}: { 
  title: string, 
  message: string, 
  confirmLabel: string, 
  onConfirm: () => void, 
  onCancel: () => void,
  variant?: 'primary' | 'danger'
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-sm w-full border-4 border-slate-100"
      >
        <div className="p-10 space-y-8">
          <div className="space-y-3 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center border border-slate-100">
              {variant === 'danger' ? <X className="text-red-500" size={32} /> : <Info className="text-blue-500" size={32} />}
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{message}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl ${
                variant === 'danger' 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200'
              }`}
            >
              {confirmLabel}
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LevelUpPopup({ level, pokemon, onClose }: { level: number, pokemon: CaughtPokemon, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <LevelUpAnimation />
      <motion.div 
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
        className="bg-white rounded-[3rem] shadow-2xl overflow-hidden max-w-sm w-full relative border-8 border-yellow-400"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-50 to-transparent pointer-events-none" />
        <ConfettiExplosion />
        <div className="p-10 text-center space-y-6 relative z-10">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 text-yellow-200 opacity-50"
            >
              <Plus size={160} />
            </motion.div>
            <BounceIn delay={0.2}>
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white bg-gradient-to-br ${
                pokemon.isShiny ? 'from-yellow-100 to-orange-200' :
                pokemon.rarity === 'legendary' ? 'from-orange-100 to-red-200' :
                pokemon.rarity === 'epic' ? 'from-purple-100 to-indigo-200' :
                'from-slate-100 to-slate-200'
              }`}>
                {pokemon.isShiny && <ShinySparkle />}
                <img 
                  src={pokemon.isShiny ? pokemon.imageUrl.replace('/pokemon/', '/pokemon/shiny/') : pokemon.imageUrl} 
                  alt={pokemon.name} 
                  className="w-24 h-24 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </BounceIn>
          </div>

          <div className="space-y-1">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs font-black text-yellow-600 uppercase tracking-[0.3em]"
            >
              New Milestone
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black tracking-tighter text-slate-800 italic"
            >
              LEVEL UP!
            </motion.h2>
            <p className="text-sm font-medium text-slate-500">
              You unlocked a <span className="text-slate-900 font-bold">{pokemon.isShiny ? 'Shiny ' : ''}{pokemon.name}</span>!
            </p>
          </div>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5 }}
            className="bg-slate-800 text-white py-3 rounded-2xl shadow-xl"
          >
            <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Current Level</div>
            <div className="text-3xl font-black italic">{level}</div>
          </motion.div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-yellow-400 text-white rounded-2xl font-black text-lg uppercase tracking-[0.2em] hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-100 active:scale-95"
          >
            Keep Grinding
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DropPopup({ drop, onClose }: { drop: { pokemon?: Pokemon | CaughtPokemon; item?: string; egg?: Egg }, onClose: () => void }) {
  const [isRevealed, setIsRevealed] = useState(!drop.pokemon && !drop.egg);
  const [isCatching, setIsCatching] = useState(!!drop.pokemon);

  useEffect(() => {
    if (drop.pokemon) {
      const timer = setTimeout(() => {
        setIsCatching(false);
        setIsRevealed(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (drop.egg) {
      // Eggs are revealed immediately
      setIsRevealed(true);
    }
  }, [drop.pokemon, drop.egg]);

  const pokemon = drop.pokemon as CaughtPokemon | undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-[3rem] shadow-2xl overflow-hidden max-w-sm w-full relative border-4 border-slate-100"
      >
        <div className="p-10 text-center space-y-6">
          {isCatching && drop.pokemon && (
            <div className="py-12 flex flex-col items-center gap-8">
              <PokeballCatch />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse"
              >
                Catching...
              </motion.div>
            </div>
          )}

          {isRevealed && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              {drop.egg ? (
                <>
                  <ConfettiExplosion />
                  <BounceIn>
                    <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br ${getEggGradient(drop.egg.rarity)} relative shadow-2xl`}>
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-8xl"
                      >
                        🥚
                      </motion.div>
                      {[...Array(3)].map((_, i) => (
                        <div key={i}><Sparkle delay={i * 0.3} /></div>
                      ))}
                    </div>
                  </BounceIn>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        drop.egg.rarity === 'legendary' ? 'bg-orange-100 text-orange-700' :
                        drop.egg.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                        drop.egg.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {drop.egg.rarity} Egg
                      </span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Egg Found!</h2>
                    <p className="text-slate-500 font-medium">
                      You received a <span className="text-slate-900 font-bold">{drop.egg.rarity} egg</span>!
                    </p>
                    <p className="text-sm text-slate-400">
                      Visit the Eggs tab to hatch it and discover what's inside!
                    </p>
                  </div>
                </>
              ) : drop.pokemon ? (
                <>
                  <ConfettiExplosion />
                  <BounceIn>
                    <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br relative ${
                      pokemon?.isShiny ? 'from-yellow-100 to-orange-200' :
                      pokemon?.rarity === 'legendary' ? 'from-orange-100 to-red-200' :
                      pokemon?.rarity === 'epic' ? 'from-purple-100 to-indigo-200' :
                      pokemon?.rarity === 'rare' ? 'from-blue-100 to-cyan-200' :
                      'from-slate-100 to-slate-200'
                    }`}>
                      {pokemon?.isShiny && <ShinySparkle />}
                      <img 
                        src={pokemon?.isShiny ? pokemon.imageUrl.replace('/pokemon/', '/pokemon/shiny/') : pokemon?.imageUrl} 
                        alt={pokemon?.name} 
                        className="w-32 h-32 object-contain relative z-10"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </BounceIn>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        pokemon?.isShiny ? 'bg-yellow-100 text-yellow-700' :
                        pokemon?.rarity === 'legendary' ? 'bg-orange-100 text-orange-700' :
                        pokemon?.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                        pokemon?.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {pokemon?.rarity} {pokemon?.isShiny ? 'Shiny' : ''}
                      </span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Gotcha!</h2>
                    <p className="text-slate-500 font-medium">
                      You caught a <span className="text-slate-900 font-bold">{pokemon?.isShiny ? 'Shiny ' : ''}{pokemon?.name}</span>!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                    <Trophy className="text-emerald-600" size={56} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Item Drop!</h2>
                    <p className="text-xl font-bold text-emerald-600">{drop.item}</p>
                  </div>
                </>
              )}

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                Awesome!
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MilestonePopup({ milestone, pokemon, onClose }: { milestone: Milestone, pokemon: CaughtPokemon, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
      <LevelUpAnimation />
      <ConfettiExplosion />
      <motion.div 
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem] shadow-2xl overflow-hidden max-w-md w-full relative border-8 border-purple-400"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
        
        <div className="p-10 text-center space-y-6 relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="relative"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <span className="text-5xl">{milestone.badge}</span>
            </div>
            <FloatingBadge>
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                SECRET!
              </div>
            </FloatingBadge>
          </motion.div>

          {/* Title */}
          <div className="space-y-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-black text-purple-600 uppercase tracking-[0.3em]"
            >
              🎉 Hidden Milestone Unlocked!
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-black tracking-tight text-slate-800"
            >
              {milestone.name}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-slate-600 font-medium"
            >
              {milestone.description}
            </motion.p>
          </div>

          {/* Pokemon Reward */}
          <BounceIn delay={0.6}>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-200">
              <div className="text-xs font-black text-purple-600 uppercase tracking-widest mb-3">
                Reward
              </div>
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br relative ${
                pokemon.isShiny ? 'from-yellow-100 to-orange-200' :
                pokemon.rarity === 'legendary' ? 'from-orange-100 to-red-200' :
                pokemon.rarity === 'epic' ? 'from-purple-100 to-indigo-200' :
                'from-blue-100 to-cyan-200'
              }`}>
                {pokemon.isShiny && <ShinySparkle />}
                <img 
                  src={pokemon.isShiny ? pokemon.imageUrl.replace('/pokemon/', '/pokemon/shiny/') : pokemon.imageUrl} 
                  alt={pokemon.name} 
                  className="w-24 h-24 object-contain relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4">
                <div className="font-black text-lg text-slate-800">
                  {pokemon.isShiny ? `Shiny ${pokemon.name}` : pokemon.name}
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest mt-1 ${
                  pokemon.rarity === 'legendary' ? 'text-orange-600' :
                  pokemon.rarity === 'epic' ? 'text-purple-600' :
                  'text-blue-600'
                }`}>
                  {pokemon.rarity} {pokemon.isShiny ? '✨ Shiny' : ''}
                </div>
              </div>
            </div>
          </BounceIn>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-purple-100 p-4 rounded-xl"
          >
            <p className="text-sm text-purple-900 font-medium italic">
              "{milestone.reward.message}"
            </p>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-black text-lg uppercase tracking-[0.2em] hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl shadow-purple-200"
          >
            Amazing!
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function EggHatchingModal({ egg }: { egg: Egg }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[3rem] shadow-2xl overflow-hidden max-w-sm w-full relative border-4 border-slate-100"
      >
        <div className="p-10 text-center space-y-6">
          <motion.div
            className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br ${getEggGradient(egg.rarity)} relative shadow-2xl`}
            animate={{
              rotate: [-5, 5, -5, 5, -5, 5, 0],
              scale: [1, 1.05, 1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
              className="text-9xl"
            >
              🥚
            </motion.div>
            {[...Array(5)].map((_, i) => (
              <div key={i}><Sparkle delay={i * 0.2} /></div>
            ))}
          </motion.div>
          
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]"
          >
            Hatching...
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function HatchedPokemonModal({ pokemon, onClose }: { pokemon: CaughtPokemon, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
      <LevelUpAnimation />
      <ConfettiExplosion />
      <motion.div 
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-[3rem] shadow-2xl overflow-hidden max-w-md w-full relative border-8 border-blue-400"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
        
        <div className="p-10 text-center space-y-6 relative z-10">
          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">
              🎉 Egg Hatched!
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-800">
              It's a {pokemon.isShiny ? 'Shiny ' : ''}{pokemon.name}!
            </h2>
          </motion.div>

          {/* Pokemon */}
          <BounceIn delay={0.3}>
            <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br relative ${
              pokemon.isShiny ? 'from-yellow-100 to-orange-200' :
              pokemon.rarity === 'legendary' ? 'from-orange-100 to-red-200' :
              pokemon.rarity === 'epic' ? 'from-purple-100 to-indigo-200' :
              pokemon.rarity === 'rare' ? 'from-blue-100 to-cyan-200' :
              'from-slate-100 to-slate-200'
            }`}>
              {pokemon.isShiny && <ShinySparkle />}
              <img 
                src={pokemon.isShiny ? pokemon.imageUrl.replace('/pokemon/', '/pokemon/shiny/') : pokemon.imageUrl} 
                alt={pokemon.name} 
                className="w-32 h-32 object-contain relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
          </BounceIn>

          {/* Rarity Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2"
          >
            <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full ${
              pokemon.isShiny ? 'bg-yellow-100 text-yellow-700' :
              pokemon.rarity === 'legendary' ? 'bg-orange-100 text-orange-700' :
              pokemon.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
              pokemon.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {pokemon.rarity} {pokemon.isShiny ? '✨ Shiny' : ''}
            </span>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-blue-100 p-4 rounded-xl"
          >
            <p className="text-sm text-blue-900 font-medium">
              {pokemon.isShiny ? 
                "Wow! A shiny Pokémon! This is incredibly rare!" :
                "A new Pokémon has joined your collection!"}
            </p>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-black text-lg uppercase tracking-[0.2em] hover:from-blue-600 hover:to-purple-600 transition-all shadow-xl shadow-blue-200"
          >
            Awesome!
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function ShareProgressModal({ blob, stats, onClose }: { blob: Blob, stats: WeeklyStats, onClose: () => void }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  const handleDownload = () => {
    downloadCard(blob);
  };

  const handleCopy = async () => {
    const success = await copyCardToClipboard(blob);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-slate-800 mb-2">📊 Share Your Progress</h2>
            <p className="text-slate-600">Show your accountability buddy or community what you've achieved this week!</p>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <img 
              src={imageUrl} 
              alt="Weekly Progress Card" 
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100">
              <div className="text-2xl font-black text-orange-600">{stats.totalHours.toFixed(1)}</div>
              <div className="text-xs font-bold text-orange-700 uppercase tracking-wider">Hours</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="text-2xl font-black text-blue-600">{stats.totalXP}</div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">XP Earned</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
              <div className="text-2xl font-black text-purple-600">{stats.completedQuests}</div>
              <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">Quests</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="text-2xl font-black text-green-600">{stats.pokemonCaught.length}</div>
              <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Pokémon</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-sm hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Image
            </motion.button>
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={20} />
                  Copied!
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </motion.button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-4">
            💡 Tip: Paste directly into Discord, Slack, or Skool to share with your community!
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all relative ${
        active ? 'text-blue-500 bg-blue-50 shadow-inner' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      <motion.div
        animate={active ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
      <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${active ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full"
        />
      )}
    </button>
  );
}

function HomeTab({ 
  tasks, 
  quests, 
  dailyMetrics,
  weeklyBoss,
  isQuestCompleted,
  onNavigate,
  onToggleTask
}: { 
  tasks: Task[], 
  quests: Quest[],
  dailyMetrics: Record<string, DailyMetrics>,
  weeklyBoss: WeeklyBoss | null,
  isQuestCompleted: (quest: Quest) => boolean,
  onNavigate: (tab: 'home' | 'today' | 'quests' | 'pokemon' | 'boss' | 'tasks' | 'history') => void,
  onToggleTask: (taskId: string) => void
}) {
  const today = getTodayISO();
  const todaysTasks = tasks.filter(t => !t.completed && t.createdAt.startsWith(today));
  const dailyQuests = quests.filter(q => q.type === 'daily' && q.status === 'active');
  const weeklyQuests = quests.filter(q => q.type === 'weekly' && q.status === 'active');
  
  // Get last 7 days of data for chart
  const chartData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const metrics = dailyMetrics[dateStr];
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        xp: metrics?.xpEarned || 0
      });
    }
    return last7Days;
  }, [dailyMetrics]);

  const completedDailyQuests = dailyQuests.filter(q => isQuestCompleted(q)).length;
  const completedWeeklyQuests = weeklyQuests.filter(q => isQuestCompleted(q)).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border-2 border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full -mr-12 -mt-12" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-200/20 rounded-full -ml-10 -mb-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="text-yellow-500" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-800">Welcome Back!</h2>
                <p className="text-xs text-slate-600 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="text-white" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">7-Day Progress</h3>
              <p className="text-[10px] text-slate-500 font-medium">Your XP journey</p>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  style={{ fontSize: '10px', fontWeight: 600 }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  style={{ fontSize: '10px', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#colorXp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <Target className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Today's Tasks</h3>
                <p className="text-[10px] text-slate-500 font-medium">{todaysTasks.length} pending</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('tasks')}
              className="text-[10px] font-bold text-blue-500 hover:text-blue-600 bg-blue-50 px-2 py-1 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
          {todaysTasks.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-slate-50 rounded-xl mx-auto mb-2 flex items-center justify-center">
                <CheckCircle2 className="text-slate-300" size={24} />
              </div>
              <p className="text-xs text-slate-400 font-medium">No tasks for today</p>
              <button 
                onClick={() => onNavigate('tasks')}
                className="mt-2 text-[10px] font-bold text-orange-500 hover:text-orange-600"
              >
                Create a task
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysTasks.slice(0, 4).map(task => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer relative overflow-hidden"
                  onClick={() => onToggleTask(task.id)}
                >
                  {task.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-emerald-50"
                    />
                  )}
                  <motion.div 
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 relative z-10 ${
                      task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                    }`}
                    animate={task.completed ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence>
                      {task.completed && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                        >
                          <CheckCircle2 className="text-white" size={14} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className={`text-xs font-bold truncate ${task.completed ? 'text-emerald-700 line-through' : 'text-slate-800'}`}>{task.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        task.category === 'business' ? 'bg-red-100 text-red-700' :
                        task.category === 'school' ? 'bg-blue-100 text-blue-700' :
                        task.category === 'admin' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">+{task.xpReward} XP</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {todaysTasks.length > 4 && (
                <button 
                  onClick={() => onNavigate('tasks')}
                  className="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  +{todaysTasks.length - 4} more
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onNavigate('today')}
            className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all active:scale-95"
          >
            <LayoutDashboard size={20} className="mb-1" />
            <p className="text-xs font-black">Log Today</p>
          </button>
          <button 
            onClick={() => onNavigate('tasks')}
            className="p-5 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl transition-all active:scale-95"
          >
            <Plus size={20} className="mb-1" />
            <p className="text-xs font-black">Add Task</p>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
        {/* Daily Quests */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <ScrollText className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Daily Quests</h3>
                <p className="text-[10px] text-slate-500 font-medium">{completedDailyQuests}/{dailyQuests.length} completed</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('quests')}
              className="text-[10px] font-bold text-blue-500 hover:text-blue-600 bg-blue-50 px-2 py-1 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {dailyQuests.slice(0, 4).map(quest => {
              const completed = isQuestCompleted(quest);
              return (
                <div
                  key={quest.id}
                  className={`p-3 rounded-xl border ${
                    completed 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{quest.name}</h4>
                        {completed && (
                          <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={14} />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 line-clamp-1">{quest.description}</p>
                    </div>
                    <div className="text-[10px] font-bold text-orange-600 flex-shrink-0">+{quest.baseXPReward}</div>
                  </div>
                </div>
              );
            })}
            {dailyQuests.length > 4 && (
              <button 
                onClick={() => onNavigate('quests')}
                className="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
              >
                +{dailyQuests.length - 4} more
              </button>
            )}
          </div>
        </div>

        {/* Weekly Quests */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Calendar className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Weekly Quests</h3>
                <p className="text-[10px] text-slate-500 font-medium">{completedWeeklyQuests}/{weeklyQuests.length} completed</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('quests')}
              className="text-[10px] font-bold text-blue-500 hover:text-blue-600 bg-blue-50 px-2 py-1 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {weeklyQuests.slice(0, 3).map(quest => {
              const completed = isQuestCompleted(quest);
              return (
                <div
                  key={quest.id}
                  className={`p-3 rounded-xl border ${
                    completed 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{quest.name}</h4>
                        {completed && (
                          <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={14} />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 line-clamp-1">{quest.description}</p>
                    </div>
                    <div className="text-[10px] font-bold text-orange-600 flex-shrink-0">+{quest.baseXPReward}</div>
                  </div>
                </div>
              );
            })}
            {weeklyQuests.length > 3 && (
              <button 
                onClick={() => onNavigate('quests')}
                className="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
              >
                +{weeklyQuests.length - 3} more
              </button>
            )}
          </div>
        </div>

        {/* Weekly Boss */}
        {weeklyBoss && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-3xl border-2 border-red-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Sword className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Weekly Boss</h3>
                  <p className="text-[10px] text-slate-600 font-medium">{weeklyBoss.name}</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('boss')}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 px-2 py-1 rounded-lg transition-colors"
              >
                Battle
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-600">HP</span>
                <span className="text-red-600">{weeklyBoss.hpRemaining} / {weeklyBoss.hpTotal}</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden border-2 border-red-200">
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(weeklyBoss.hpRemaining / weeklyBoss.hpTotal) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-slate-600 font-medium mt-2">
                <span className="font-bold text-red-600">Weakness:</span> {weeklyBoss.weaknessType}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TodayTab({ 
  metrics, 
  onSave, 
  selectedDate, 
  onDateChange,
  categoryVisibility,
  onToggleCategory
}: { 
  metrics?: DailyMetrics, 
  onSave: (m: any) => void,
  selectedDate: string,
  onDateChange: (date: string) => void,
  categoryVisibility: any,
  onToggleCategory: (category: string) => void
}) {
  const [form, setForm] = useState({
    // Main Attacks (Business)
    workHours: metrics?.workHours || 0,
    discoveryCalls: metrics?.discoveryCalls || 0,
    networkingCalls: metrics?.networkingCalls || 0,
    salesCalls: metrics?.salesCalls || 0,
    firstDmsSent: metrics?.firstDmsSent || 0,
    followUpsSent: metrics?.followUpsSent || 0,
    commentingMinutes: metrics?.commentingMinutes || 0,
    postsCreated: metrics?.postsCreated || 0,
    postsPosted: metrics?.postsPosted || 0,
    callsBooked: metrics?.callsBooked || 0,
    callsTaken: metrics?.callsTaken || 0,
    totalDmsSent: metrics?.totalDmsSent || 0,
    // Special Moves (Health)
    timeAsleep: metrics?.timeAsleep || '21:00',
    timeAwake: metrics?.timeAwake || '05:00',
    coldShowers: metrics?.coldShowers || 0,
    fastHours: metrics?.fastHours || 0,
    exerciseType: metrics?.exerciseType || 'none',
    foodTracking: metrics?.foodTracking || false,
    // Trainer Boosts (Daily Habits)
    affirmations: metrics?.affirmations || false,
    visualizations: metrics?.visualizations || false,
    planTomorrow: metrics?.planTomorrow || false,
    storyList: metrics?.storyList || false,
    journal: metrics?.journal || false,
    // Status Effects (Bad Habits)
    youtube: metrics?.youtube || false,
    reels: metrics?.reels || false,
    shorts: metrics?.shorts || false,
    processedFood: metrics?.processedFood || false,
    gaming: metrics?.gaming || false,
  });

  useEffect(() => {
    if (metrics) {
      setForm({
        workHours: metrics.workHours,
        discoveryCalls: metrics.discoveryCalls,
        networkingCalls: metrics.networkingCalls,
        salesCalls: metrics.salesCalls,
        firstDmsSent: metrics.firstDmsSent,
        followUpsSent: metrics.followUpsSent,
        commentingMinutes: metrics.commentingMinutes,
        postsCreated: metrics.postsCreated,
        postsPosted: metrics.postsPosted,
        callsBooked: metrics.callsBooked,
        callsTaken: metrics.callsTaken,
        totalDmsSent: metrics.totalDmsSent,
        timeAsleep: metrics.timeAsleep,
        timeAwake: metrics.timeAwake,
        coldShowers: metrics.coldShowers,
        fastHours: metrics.fastHours,
        exerciseType: metrics.exerciseType,
        foodTracking: metrics.foodTracking,
        affirmations: metrics.affirmations,
        visualizations: metrics.visualizations,
        planTomorrow: metrics.planTomorrow,
        storyList: metrics.storyList,
        journal: metrics.journal,
        youtube: metrics.youtube,
        reels: metrics.reels,
        shorts: metrics.shorts,
        processedFood: metrics.processedFood,
        gaming: metrics.gaming,
      });
    } else {
      setForm({
        workHours: 0,
        discoveryCalls: 0,
        networkingCalls: 0,
        salesCalls: 0,
        firstDmsSent: 0,
        followUpsSent: 0,
        commentingMinutes: 0,
        postsCreated: 0,
        postsPosted: 0,
        callsBooked: 0,
        callsTaken: 0,
        totalDmsSent: 0,
        timeAsleep: '21:00',
        timeAwake: '05:00',
        coldShowers: 0,
        fastHours: 0,
        exerciseType: 'none',
        foodTracking: false,
        affirmations: false,
        visualizations: false,
        planTomorrow: false,
        storyList: false,
        journal: false,
        youtube: false,
        reels: false,
        shorts: false,
        processedFood: false,
        gaming: false,
      });
    }
  }, [metrics]);

  const handleChange = (key: string, val: any) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="space-y-6 relative">
      <div className="bg-white p-6 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {/* Decorative Sprites */}
        <div className="absolute -bottom-4 -left-4 pointer-events-none opacity-10">
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif" 
            className="w-24 h-24 pixelated" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -top-4 -right-4 pointer-events-none opacity-10">
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif" 
            className="w-24 h-24 pixelated" 
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 relative z-10">
          <h2 className="text-xl font-bold">Log Life Data</h2>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date:</label>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => onDateChange(e.target.value)}
                max={getTodayISO()}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              {selectedDate !== getTodayISO() && (
                <button 
                  onClick={() => onDateChange(getTodayISO())}
                  className="text-[10px] font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-2 py-1.5 rounded-lg transition-colors"
                >
                  Today
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* MAIN ATTACKS - Business & Work */}
          <section>
            <h3 
              onClick={() => onToggleCategory('business')}
              className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-3 cursor-pointer hover:text-slate-600 transition-colors"
            >
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
                <Sword size={16} className="text-red-500" />
              </div>
              ⚔️ Main Attacks (Business & Work)
              <motion.div
                animate={{ rotate: categoryVisibility.business ? 0 : -90 }}
                transition={{ duration: 0.2 }}
                className="ml-auto"
              >
                <ChevronRight size={20} />
              </motion.div>
            </h3>
            {categoryVisibility.business && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputGroup label="Hours Worked" value={form.workHours} onChange={v => handleChange('workHours', parseFloat(v) || 0)} metricKey="workHours" step="0.5" />
              <InputGroup label="Discovery Calls" value={form.discoveryCalls} onChange={v => handleChange('discoveryCalls', parseInt(v) || 0)} metricKey="discoveryCalls" />
              <InputGroup label="Networking Calls" value={form.networkingCalls} onChange={v => handleChange('networkingCalls', parseInt(v) || 0)} metricKey="networkingCalls" />
              <InputGroup label="Sales Calls" value={form.salesCalls} onChange={v => handleChange('salesCalls', parseInt(v) || 0)} metricKey="salesCalls" />
              <InputGroup label="First DMs Sent" value={form.firstDmsSent} onChange={v => handleChange('firstDmsSent', parseInt(v) || 0)} metricKey="firstDmsSent" />
              <InputGroup label="Follow-ups Sent" value={form.followUpsSent} onChange={v => handleChange('followUpsSent', parseInt(v) || 0)} metricKey="followUpsSent" />
              <InputGroup label="Commenting (Mins)" value={form.commentingMinutes} onChange={v => handleChange('commentingMinutes', parseInt(v) || 0)} metricKey="commentingMinutes" />
              <InputGroup label="Posts Created" value={form.postsCreated} onChange={v => handleChange('postsCreated', parseInt(v) || 0)} metricKey="postsCreated" />
              <InputGroup label="Posts Posted" value={form.postsPosted} onChange={v => handleChange('postsPosted', parseInt(v) || 0)} metricKey="postsPosted" />
              <InputGroup label="Calls Booked" value={form.callsBooked} onChange={v => handleChange('callsBooked', parseInt(v) || 0)} metricKey="callsBooked" />
              <InputGroup label="Calls Taken" value={form.callsTaken} onChange={v => handleChange('callsTaken', parseInt(v) || 0)} metricKey="callsTaken" />
              <InputGroup label="Total DMs Sent" value={form.totalDmsSent} onChange={v => handleChange('totalDmsSent', parseInt(v) || 0)} metricKey="totalDmsSent" />
            </div>
            )}
          </section>

          {/* SPECIAL MOVES - Health & Vitality */}
          <section>
            <h3 
              onClick={() => onToggleCategory('health')}
              className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-3 cursor-pointer hover:text-slate-600 transition-colors"
            >
              <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center border border-pink-100">
                <span className="text-lg">❤️</span>
              </div>
              💪 Special Moves (Health & Vitality)
              <motion.div
                animate={{ rotate: categoryVisibility.health ? 0 : -90 }}
                transition={{ duration: 0.2 }}
                className="ml-auto"
              >
                <ChevronRight size={20} />
              </motion.div>
            </h3>
            {categoryVisibility.health && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TimeInputGroup label="Time Asleep (Goal 9 PM)" value={form.timeAsleep} onChange={v => handleChange('timeAsleep', v)} metricKey="timeAsleep" />
              <TimeInputGroup label="Time Awake (Goal 5 AM)" value={form.timeAwake} onChange={v => handleChange('timeAwake', v)} metricKey="timeAwake" />
              <InputGroup label="Cold Showers" value={form.coldShowers} onChange={v => handleChange('coldShowers', parseInt(v) || 0)} metricKey="coldShowers" />
              <InputGroup label="Fast (Hours)" value={form.fastHours} onChange={v => handleChange('fastHours', parseFloat(v) || 0)} metricKey="fastHours" step="0.5" />
              <DropdownGroup label="Exercise Type" value={form.exerciseType} onChange={v => handleChange('exerciseType', v)} options={['none', 'upper', 'lower', 'cardio']} />
              <CheckboxGroup label="Food Tracking" checked={form.foodTracking} onChange={v => handleChange('foodTracking', v)} metricKey="foodTracking" />
            </div>
            )}
          </section>

          {/* TRAINER BOOSTS - Daily Habits */}
          <section>
            <h3 
              onClick={() => onToggleCategory('trainerBoosts')}
              className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-3 cursor-pointer hover:text-slate-600 transition-colors"
            >
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center border border-yellow-100">
                <span className="text-lg">🌟</span>
              </div>
              ✨ Trainer Boosts (Daily Habits)
              <motion.div
                animate={{ rotate: categoryVisibility.trainerBoosts ? 0 : -90 }}
                transition={{ duration: 0.2 }}
                className="ml-auto"
              >
                <ChevronRight size={20} />
              </motion.div>
            </h3>
            {categoryVisibility.trainerBoosts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CheckboxGroup label="Affirmations" checked={form.affirmations} onChange={v => handleChange('affirmations', v)} metricKey="affirmations" />
              <CheckboxGroup label="Visualizations" checked={form.visualizations} onChange={v => handleChange('visualizations', v)} metricKey="visualizations" />
              <CheckboxGroup label="Plan Tomorrow" checked={form.planTomorrow} onChange={v => handleChange('planTomorrow', v)} metricKey="planTomorrow" />
              <CheckboxGroup label="Story List" checked={form.storyList} onChange={v => handleChange('storyList', v)} metricKey="storyList" />
              <CheckboxGroup label="Journal" checked={form.journal} onChange={v => handleChange('journal', v)} metricKey="journal" />
            </div>
            )}
          </section>

          {/* STATUS EFFECTS - Bad Habits */}
          <section>
            <h3 
              onClick={() => onToggleCategory('statusEffects')}
              className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-3 cursor-pointer hover:text-slate-600 transition-colors"
            >
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-100">
                <span className="text-lg">☠️</span>
              </div>
              ⚠️ Status Effects (Bad Habits - Reduces XP)
              <motion.div
                animate={{ rotate: categoryVisibility.statusEffects ? 0 : -90 }}
                transition={{ duration: 0.2 }}
                className="ml-auto"
              >
                <ChevronRight size={20} />
              </motion.div>
            </h3>
            {categoryVisibility.statusEffects && (
            <>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-4 italic">
              Leave unchecked for bonus percentage!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CheckboxGroup label="YouTube" checked={form.youtube} onChange={v => handleChange('youtube', v)} variant="danger" metricKey="youtube" />
              <CheckboxGroup label="Reels" checked={form.reels} onChange={v => handleChange('reels', v)} variant="danger" metricKey="reels" />
              <CheckboxGroup label="Shorts" checked={form.shorts} onChange={v => handleChange('shorts', v)} variant="danger" metricKey="shorts" />
              <CheckboxGroup label="Processed Food" checked={form.processedFood} onChange={v => handleChange('processedFood', v)} variant="danger" metricKey="processedFood" />
              <CheckboxGroup label="Gaming" checked={form.gaming} onChange={v => handleChange('gaming', v)} variant="danger" metricKey="gaming" />
            </div>
            </>
            )}
          </section>
        </div>

        <motion.button 
          onClick={handleSave}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <CheckCircle2 size={20} />
          Save & Sync XP
        </motion.button>
      </div>

      {metrics && (
        <div className="bg-[#F0FDF4] p-6 rounded-3xl border border-[#DCFCE7] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#166534] uppercase tracking-widest">Today's Gain</div>
            <div className="text-3xl font-black text-[#15803D]">+{metrics.xpEarned} XP</div>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Trophy className="text-[#15803D]" size={24} />
          </div>
        </div>
      )}
    </div>
  );
}

const METRIC_SPRITES: Record<string, number> = {
  // Business
  workHours: 68, // Machamp
  discoveryCalls: 81, // Magnemite
  networkingCalls: 441, // Chatot
  salesCalls: 52, // Meowth
  firstDmsSent: 16, // Pidgey
  followUpsSent: 7, // Squirtle
  commentingMinutes: 199, // Slowking
  postsCreated: 235, // Smeargle
  postsPosted: 149, // Dragonite
  callsBooked: 113, // Chansey
  callsTaken: 242, // Blissey
  totalDmsSent: 225, // Delibird
  // Health
  timeAsleep: 143, // Snorlax
  timeAwake: 17, // Pidgeotto
  coldShowers: 87, // Dewgong
  fastHours: 143, // Snorlax
  foodTracking: 132, // Ditto
  // Trainer Boosts
  affirmations: 122, // Mr. Mime
  visualizations: 96, // Drowzee
  planTomorrow: 233, // Porygon2
  storyList: 83, // Farfetch'd
  journal: 102, // Exeggcute
  // Status Effects
  youtube: 94, // Gengar
  reels: 92, // Gastly
  shorts: 93, // Haunter
  processedFood: 88, // Grimer
  gaming: 137, // Porygon
};

function InputGroup({ label, value, onChange, metricKey, step = "1", variant = "default", min, max }: { 
  label: string, 
  value: number, 
  onChange: (v: string) => void, 
  metricKey: string,
  step?: string,
  variant?: "default" | "danger",
  min?: number,
  max?: number
}) {
  const pokemonId = METRIC_SPRITES[metricKey] || 25;
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;

  const isDanger = variant === "danger";

  return (
    <div className={`bg-white p-4 rounded-3xl border shadow-sm hover:border-orange-200 transition-all group ${isDanger ? 'border-red-100 bg-red-50/30' : 'border-slate-100'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors overflow-hidden ${isDanger ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100'}`}>
          <img 
            src={spriteUrl} 
            alt={label} 
            className="w-8 h-8 object-contain pixelated" 
            referrerPolicy="no-referrer"
          />
        </div>
        <label className={`text-[10px] font-black uppercase tracking-widest leading-tight ${isDanger ? 'text-red-400' : 'text-slate-400'}`}>{label}</label>
      </div>
      <input 
        type="number" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        step={step}
        min={min !== undefined ? min : 0}
        max={max}
        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 transition-all font-black text-lg ${isDanger ? 'bg-red-50 border-red-200 focus:ring-red-200 focus:border-red-400 text-red-700' : 'bg-slate-50 border-slate-200 focus:ring-orange-200 focus:border-orange-400 text-slate-700'}`}
      />
    </div>
  );
}

function DropdownGroup({ label, value, onChange, options }: { 
  label: string, 
  value: string, 
  onChange: (v: string) => void,
  options: string[]
}) {
  const pokemonId = 68; // Machamp for exercise
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;

  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-orange-200 transition-all group">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors overflow-hidden">
          <img 
            src={spriteUrl} 
            alt={label} 
            className="w-8 h-8 object-contain pixelated" 
            referrerPolicy="no-referrer"
          />
        </div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{label}</label>
      </div>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all font-black text-slate-700 text-lg capitalize"
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="capitalize">{opt}</option>
        ))}
      </select>
    </div>
  );
}

function TimeInputGroup({ label, value, onChange, metricKey }: { 
  label: string, 
  value: string, 
  onChange: (v: string) => void,
  metricKey: string
}) {
  const pokemonId = METRIC_SPRITES[metricKey] || 143;
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;

  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-orange-200 transition-all group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors overflow-hidden flex-shrink-0">
          <img 
            src={spriteUrl} 
            alt={label} 
            className="w-8 h-8 object-contain pixelated" 
            referrerPolicy="no-referrer"
          />
        </div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight flex-1">{label}</label>
      </div>
      <input 
        type="time" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all font-bold text-slate-700 text-sm"
      />
    </div>
  );
}

function CheckboxGroup({ label, checked, onChange, variant = "default", metricKey }: { 
  label: string, 
  checked: boolean, 
  onChange: (v: boolean) => void,
  variant?: "default" | "danger",
  metricKey?: string
}) {
  const isDanger = variant === "danger";
  const pokemonId = metricKey ? (METRIC_SPRITES[metricKey] || 25) : 25;
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;

  return (
    <div className={`bg-white p-4 rounded-3xl border shadow-sm hover:border-orange-200 transition-all group cursor-pointer ${isDanger ? 'border-red-100 bg-red-50/30' : 'border-slate-100'}`} onClick={() => onChange(!checked)}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all overflow-hidden ${checked ? (isDanger ? 'bg-red-500 border-red-600' : 'bg-orange-500 border-orange-600') : (isDanger ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100')}`}>
          {checked ? (
            <CheckCircle2 size={20} className="text-white" />
          ) : (
            <img 
              src={spriteUrl} 
              alt={label} 
              className="w-8 h-8 object-contain pixelated" 
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        <label className={`text-[10px] font-black uppercase tracking-widest leading-tight cursor-pointer ${isDanger ? 'text-red-400' : 'text-slate-400'}`}>{label}</label>
      </div>
    </div>
  );
}

function QuestsTab({ quests, onClaim, isCompleted, getProgress, onRefresh }: { 
  quests: Quest[], 
  onClaim: (id: string) => void,
  isCompleted: (q: Quest) => boolean,
  getProgress: (q: Quest) => any[],
  onRefresh: () => void
}) {
  const dailies = quests.filter(q => q.type === 'daily');
  const weeklies = quests.filter(q => q.type === 'weekly');

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 pointer-events-none opacity-10">
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif" 
          className="w-20 h-20 pixelated" 
          referrerPolicy="no-referrer"
        />
      </div>
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-400 rounded-full" />
            <h2 className="text-xl font-bold">Daily Quests</h2>
          </div>
          <button 
            onClick={onRefresh}
            className="text-[10px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-all"
          >
            Reroll Quests
          </button>
        </div>
        <div className="space-y-3">
          {dailies.map(q => (
            <QuestCard key={q.id} quest={q} onClaim={onClaim} completed={isCompleted(q)} progress={getProgress(q)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-6 bg-indigo-400 rounded-full" />
          <h2 className="text-xl font-bold">Weekly Goals</h2>
        </div>
        <div className="space-y-3">
          {weeklies.map(q => (
            <QuestCard key={q.id} quest={q} onClaim={onClaim} completed={isCompleted(q)} progress={getProgress(q)} />
          ))}
        </div>
      </section>
    </div>
  );
}

interface QuestCardProps {
  quest: Quest;
  onClaim: (id: string) => void;
  completed: boolean;
  progress: any[];
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim, completed, progress }) => {
  return (
    <motion.div 
      layout
      className={`bg-white p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden ${
        quest.status === 'claimed' ? 'opacity-50 border-slate-100 bg-slate-50/50' : 
        completed ? 'border-emerald-400 bg-emerald-50/20 ring-4 ring-emerald-50' : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      {completed && quest.status !== 'claimed' && (
        <>
          <Sparkle delay={0} />
          <Sparkle delay={0.5} />
          <Sparkle delay={1} />
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <motion.img 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif"
              className="w-10 h-10 pixelated"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              referrerPolicy="no-referrer"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Trophy size={16} className="text-yellow-500" />
            </motion.div>
          </div>
        </>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="font-black text-lg text-slate-800">{quest.name}</h3>
          <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[80%]">{quest.description}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reward</div>
          <div className="font-black text-emerald-600 flex items-center gap-1 justify-end">
            <Plus size={12} />
            {quest.baseXPReward}
            <span className="text-[10px]">XP</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {progress.map((p, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1">
                <div className={`w-1 h-1 rounded-full ${quest.type === 'daily' ? 'bg-orange-400' : 'bg-indigo-400'}`} />
                {p.label}
              </span>
              <span className="text-slate-600">{p.current} / {p.target}</span>
            </div>
            <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <motion.div 
                className={`h-full relative ${quest.type === 'daily' ? 'bg-orange-400' : 'bg-indigo-400'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, p.isLte ? (p.current <= p.target ? 100 : 0) : (p.current / p.target) * 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {quest.status === 'claimed' ? (
        <div className="flex items-center justify-center gap-2 py-2 text-slate-400 font-black text-xs uppercase tracking-widest">
          <CheckCircle2 size={14} />
          Claimed
        </div>
      ) : completed ? (
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onClaim(quest.id)}
          className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
        >
          Claim Reward
          <Trophy size={14} />
        </motion.button>
      ) : (
        <div className="w-full py-3 bg-slate-50 text-slate-300 rounded-xl font-black text-xs uppercase tracking-[0.2em] text-center border border-slate-100">
          In Progress
        </div>
      )}
    </motion.div>
  );
};

function TasksTab({ 
  tasks, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask 
}: { 
  tasks: Task[], 
  onAddTask: (task: Task) => void,
  onToggleTask: (taskId: string) => void,
  onDeleteTask: (taskId: string) => void
}) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('admin');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      xpReward: TASK_CATEGORY_XP[newTaskCategory],
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    onAddTask(task);
    setNewTaskTitle('');
    setNewTaskCategory('admin');
    setShowAddTask(false);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getCategoryColor = (category: TaskCategory) => {
    switch (category) {
      case 'business': return 'bg-red-100 text-red-700 border-red-200';
      case 'school': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'admin': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'learning': return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'business': return '💼';
      case 'school': return '🎓';
      case 'admin': return '📋';
      case 'learning': return '📚';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black">Daily Tasks</h2>
            <p className="text-sm text-slate-500 mt-1">Complete tasks to earn XP & catch Pokemon!</p>
          </div>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Add Task Form */}
        <AnimatePresence>
          {showAddTask && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-50 p-4 rounded-2xl space-y-3 mb-4">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="What needs to be done?"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200 font-medium"
                  autoFocus
                />
                <div className="flex gap-2">
                  {(['business', 'school', 'admin', 'learning'] as TaskCategory[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewTaskCategory(cat)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                        newTaskCategory === cat 
                          ? getCategoryColor(cat) 
                          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {getCategoryIcon(cat)} {cat} ({TASK_CATEGORY_XP[cat]} XP)
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTask}
                    className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => {
                      setShowAddTask(false);
                      setNewTaskTitle('');
                    }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3 rounded-2xl text-center">
            <div className="text-2xl font-black text-slate-800">{activeTasks.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl text-center">
            <div className="text-2xl font-black text-emerald-700">{completedTasks.length}</div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Completed</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-2xl text-center">
            <div className="text-2xl font-black text-orange-700">
              {completedTasks.reduce((sum, t) => sum + t.xpReward, 0)}
            </div>
            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">XP Earned</div>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">Active Tasks</h3>
          {activeTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all"
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className="w-8 h-8 rounded-full border-2 border-slate-300 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center flex-shrink-0"
              >
                {/* Empty circle */}
              </button>
              <div className="flex-1">
                <div className="font-bold text-slate-800">{task.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${getCategoryColor(task.category)}`}>
                    {getCategoryIcon(task.category)} {task.category}
                  </span>
                  <span className="text-[10px] font-bold text-orange-600">+{task.xpReward} XP</span>
                  <span className="text-[10px] text-slate-400">• 2% Pokemon chance</span>
                </div>
              </div>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">Completed Today</h3>
          {completedTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4 opacity-60"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-600 line-through">{task.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${getCategoryColor(task.category)}`}>
                    {getCategoryIcon(task.category)} {task.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">+{task.xpReward} XP</span>
                </div>
              </div>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-slate-200">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No tasks yet!</h3>
          <p className="text-slate-500 mb-4">Add your first task to start earning XP and catching Pokemon</p>
          <button
            onClick={() => setShowAddTask(true)}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold transition-all inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add Your First Task
          </button>
        </div>
      )}
    </div>
  );
}

function PokemonTab({ monsters }: { monsters: CaughtPokemon[] }) {
  const [selected, setSelected] = useState<CaughtPokemon | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold">Your Collection</h2>
        <div className="text-sm font-medium text-slate-400">{monsters.length} Caught</div>
      </div>

      {monsters.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
          No Pokémon caught yet. Complete quests or defeat bosses to find them!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {monsters.map((m, index) => (
            <div key={m.instanceId}>
              <PokemonAppear delay={index * 0.05}>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelected(m)}
                  className={`bg-white p-4 rounded-3xl shadow-sm border cursor-pointer relative overflow-hidden group ${
                    m.isShiny ? 'border-yellow-400 bg-yellow-50/30' : 'border-slate-100'
                  }`}
                >
                {m.isShiny && (
                  <>
                    <ShinySparkle />
                    <FloatingBadge>
                      <div className="absolute top-2 right-2 text-yellow-500">
                        <Trophy size={14} />
                      </div>
                    </FloatingBadge>
                  </>
                )}
                <motion.div 
                  className="aspect-square rounded-2xl bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-slate-100 transition-colors"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={m.isShiny ? m.imageUrl.replace('/pokemon/', '/pokemon/shiny/') : m.imageUrl} 
                    alt={m.name} 
                    className="w-20 h-20 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="text-center">
                  <div className="font-bold text-sm truncate">{m.isShiny ? `Shiny ${m.name}` : m.name}</div>
                  <div className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${
                    m.rarity === 'legendary' ? 'text-orange-600' :
                    m.rarity === 'epic' ? 'text-purple-600' :
                    m.rarity === 'rare' ? 'text-blue-600' :
                    'text-slate-400'
                  }`}>
                    {m.rarity}
                  </div>
                </div>
              </motion.div>
            </PokemonAppear>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full relative"
            >
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all"
              >
                <X size={20} />
              </button>
              <div className="p-8 text-center space-y-6">
                <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br ${
                  selected.isShiny ? 'from-yellow-100 to-orange-200' :
                  selected.rarity === 'legendary' ? 'from-orange-100 to-red-200' :
                  selected.rarity === 'epic' ? 'from-purple-100 to-indigo-200' :
                  'from-slate-100 to-slate-200'
                }`}>
                  <img 
                    src={selected.isShiny ? selected.imageUrl.replace('/pokemon/', '/pokemon/shiny/') : selected.imageUrl} 
                    alt={selected.name} 
                    className="w-32 h-32 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{selected.isShiny ? `Shiny ${selected.name}` : selected.name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      selected.isShiny ? 'bg-yellow-100 text-yellow-700' :
                      selected.rarity === 'legendary' ? 'bg-orange-100 text-orange-700' :
                      selected.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {selected.rarity}
                    </span>
                    {selected.isShiny && (
                      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-400 text-white">
                        Shiny
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Caught On</span>
                    <span className="font-bold">{new Date(selected.caughtAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Origin</span>
                    <span className="font-bold italic">PokeLife Grinding</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 italic">"A loyal companion earned through consistent life tracking and personal growth."</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EggsTab({ eggs, onHatchEgg }: { eggs: Egg[], onHatchEgg: (eggId: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold">Egg Collection</h2>
        <div className="text-sm font-medium text-slate-400">{eggs.length} Eggs</div>
      </div>

      {eggs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
          <div className="text-6xl mb-4">🥚</div>
          <p>No eggs yet. Complete quests, defeat bosses, or reach milestones to collect eggs!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {eggs.map((egg, index) => (
            <div key={egg.id}>
              <BounceIn delay={index * 0.05}>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${getEggGradient(egg.rarity)} p-6 rounded-3xl shadow-lg border-4 border-white relative overflow-hidden group cursor-pointer`}
                  onClick={() => onHatchEgg(egg.id)}
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                  
                  {/* Sparkles */}
                  {[...Array(3)].map((_, i) => (
                    <div key={i}><Sparkle delay={i * 0.3 + index * 0.1} /></div>
                  ))}
                  
                  {/* Egg */}
                  <motion.div 
                    className="relative z-10 text-center"
                    animate={{
                      rotate: [-2, 2, -2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="text-7xl mb-2">🥚</div>
                  </motion.div>
                  
                  {/* Info */}
                  <div className="relative z-10 text-center mt-2">
                    <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full inline-block ${
                      egg.rarity === 'legendary' ? 'bg-orange-500 text-white' :
                      egg.rarity === 'epic' ? 'bg-purple-500 text-white' :
                      egg.rarity === 'rare' ? 'bg-blue-500 text-white' :
                      'bg-slate-500 text-white'
                    }`}>
                      {egg.rarity}
                    </div>
                    <div className="text-[10px] text-white/80 mt-1 font-medium">
                      {egg.source === 'milestone' ? '🏆 Milestone' :
                       egg.source === 'boss' ? '⚔️ Boss' :
                       egg.source === 'levelup' ? '⭐ Level Up' :
                       '🎯 Quest'}
                    </div>
                  </div>
                  
                  {/* Hatch Button Hint */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="text-white font-black text-sm uppercase tracking-widest">
                      Tap to Hatch
                    </div>
                  </motion.div>
                </motion.div>
              </BounceIn>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BossTab({ boss }: { boss: WeeklyBoss | null }) {
  if (!boss) return null;

  const hpPercent = (boss.hpRemaining / boss.hpTotal) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border-4 border-slate-50 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500/10" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest border border-red-100">Elite Boss</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-800 uppercase italic">{boss.name}</h2>
        </div>

        <div className="relative w-56 h-56 mx-auto">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: boss.defeated ? 0 : [-1, 1, -1]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute inset-0 bg-gradient-to-b from-red-50 to-transparent rounded-full opacity-50" 
          />
          <div className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center border-8 border-slate-50 overflow-hidden">
            <motion.div
              animate={boss.defeated ? {} : {
                y: [0, -10, 0],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <img 
                src={BOSS_DATA.find(b => b.name === boss.name)?.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png'} 
                alt={boss.name}
                className={`w-40 h-40 object-contain ${boss.defeated ? 'grayscale opacity-30' : ''}`}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
          {boss.defeated && (
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: -12 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-2xl shadow-2xl border-4 border-white">
                DEFEATED
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Points</div>
              <div className="text-lg font-black text-slate-800 tabular-nums">{Math.ceil(boss.hpRemaining)} <span className="text-slate-300">/ {boss.hpTotal}</span></div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">Weakness</div>
              <div className="text-sm font-black text-red-500 uppercase italic">{boss.weaknessType}</div>
            </div>
          </div>
          <div className="h-6 bg-slate-100 rounded-full overflow-hidden border-4 border-white shadow-inner relative">
            <motion.div 
              className={`h-full relative ${boss.defeated ? 'bg-emerald-500' : 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400'}`}
              initial={{ width: '100%' }}
              animate={{ width: `${hpPercent}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress_2s_linear_infinite]" />
            </motion.div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-[2rem] text-left space-y-4 border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400">
            <Info size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Battle Intel</span>
          </div>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            Every action you log deals damage. 
            Focus on <span className="font-black text-red-500 uppercase">{boss.weaknessType}</span> to deal <span className="text-slate-800">2x Critical Damage</span>!
          </p>
        </div>

        {boss.defeated && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-emerald-500 p-5 rounded-[2rem] flex items-center gap-4 text-left shadow-xl shadow-emerald-100"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0">
              <Trophy size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-white/80 uppercase tracking-widest">Victory Unlocked</div>
              <div className="text-sm font-black text-white">Guaranteed Rare+ Pokémon drop claimed!</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function HistoryTab({ metrics, tasks, syncSettings, syncStatus, onSyncSettingsChange, onManualSync, onDelete, onReset, onEditDate }: { 
  metrics: Record<string, DailyMetrics>, 
  tasks: Task[],
  syncSettings: SyncSettings,
  syncStatus: string,
  onSyncSettingsChange: (settings: SyncSettings) => void,
  onManualSync: () => void,
  onDelete: (date: string) => void,
  onReset: () => void,
  onEditDate: (date: string) => void
}) {
  const sortedDays = Object.values(metrics).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14);

  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    // Get last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayMetrics = metrics[dateStr];
      data.push({
        date: dateStr,
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        xp: dayMetrics?.xpEarned || 0,
      });
    }

    // Calculate cumulative XP and Level for the chart
    let cumulativeXP = 0;
    return data.map(d => {
      cumulativeXP += d.xp;
      return {
        ...d,
        cumulativeXP,
        level: getLevel(cumulativeXP)
      };
    });
  }, [metrics]);

  const exportData = () => {
    const data = {
      playerState: localStorage.getItem('synthPoke_playerState'),
      dailyMetrics: localStorage.getItem('synthPoke_dailyMetrics'),
      quests: localStorage.getItem('synthPoke_quests'),
      weeklyBoss: localStorage.getItem('synthPoke_weeklyBoss'),
      tasks: localStorage.getItem('synthPoke_tasks'),
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pokelife-backup-${getTodayISO()}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.playerState) localStorage.setItem('synthPoke_playerState', data.playerState);
        if (data.dailyMetrics) localStorage.setItem('synthPoke_dailyMetrics', data.dailyMetrics);
        if (data.quests) localStorage.setItem('synthPoke_quests', data.quests);
        if (data.weeklyBoss) localStorage.setItem('synthPoke_weeklyBoss', data.weeklyBoss);
        if (data.tasks) localStorage.setItem('synthPoke_tasks', data.tasks);
        window.location.reload();
      } catch (err) {
        alert('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-800">Progress Journey</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 30 Days Growth</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">XP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Level</span>
            </div>
          </div>
        </div>

        <div className="h-[240px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                interval={6}
              />
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="cumulativeXP" 
                stroke="#F97316" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorXP)" 
                name="Total XP"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="level" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                name="Level"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold">Activity Log</h2>
        <div className="text-sm font-medium text-slate-400">Last 14 Days</div>
      </div>

      <div className="space-y-3">
        {sortedDays.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
            No history recorded yet. Start logging today!
          </div>
        ) : (
          sortedDays.map(day => (
            <div key={day.date} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm group relative">
              <button 
                onClick={() => onEditDate(day.date)}
                className="flex-1 text-left space-y-1 hover:opacity-70 transition-opacity"
              >
                <div className="text-sm font-bold flex items-center gap-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
                <div className="flex gap-3">
                  <StatMini label="Work" val={day.workHours} />
                  <StatMini label="DMs" val={day.totalDmsSent} />
                  <StatMini label="Calls" val={day.callsTaken + day.callsBooked} />
                </div>
              </button>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Earned</div>
                  <div className="text-xl font-black text-emerald-600">+{day.xpEarned}</div>
                </div>
                <button 
                  onClick={() => onDelete(day.date)}
                  className="p-2 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                  title="Delete Entry"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Google Sheets Sync</h3>
          {syncStatus && (
            <span className="text-xs font-bold text-green-600">{syncStatus}</span>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-600 mb-2 block">Apps Script URL</label>
            <input
              type="url"
              value={syncSettings.sheetUrl}
              onChange={(e) => onSyncSettingsChange({ ...syncSettings, sheetUrl: e.target.value })}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <span className="text-sm font-bold text-slate-700">Auto-sync on every update</span>
            <button
              onClick={() => onSyncSettingsChange({ ...syncSettings, autoSync: !syncSettings.autoSync })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                syncSettings.autoSync ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                syncSettings.autoSync ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
          <button
            onClick={onManualSync}
            disabled={!syncSettings.sheetUrl}
            className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Sync Now
          </button>
          <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-xl">
            <strong>Setup:</strong> Create a Google Apps Script web app and paste the URL above. 
            <a href="#" className="text-blue-600 hover:underline ml-1">View instructions</a>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Data Management</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={exportData}
            className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            Export Backup
          </button>
          <label className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer text-center">
            Import Backup
            <input type="file" className="hidden" onChange={importData} accept=".json" />
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => exportHabitsToCSV(metrics)}
            className="flex-1 py-3 bg-green-50 text-green-700 rounded-xl font-bold text-sm hover:bg-green-100 transition-all flex items-center justify-center gap-2"
          >
            📊 Export Habits to CSV
          </button>
          <button 
            onClick={() => exportTasksToCSV(tasks)}
            className="flex-1 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
          >
            ✅ Export Tasks to CSV
          </button>
        </div>
        <button 
          onClick={onReset}
          className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
        >
          Factory Reset Progress
        </button>
      </div>
    </div>
  );
}

function StatMini({ label, val }: { label: string, val: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
      <span className="text-xs font-bold text-slate-700">{val}</span>
    </div>
  );
}
