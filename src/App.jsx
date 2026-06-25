import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Award, 
  Wallet, 
  Navigation, 
  Zap, 
  Flame, 
  Users, 
  Gift, 
  CheckCircle2, 
  Sparkles,
  Info,
  ChevronRight,
  Sun,
  X,
  Share2,
  Download,
  Palette,
  Camera,
  Check,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, route, quests, wallet, guild
  const [activeQuestTab, setActiveQuestTab] = useState('daily'); // daily, classroom, lab, weekly
  
  // Game state variables - INITIALIZED TO ZERO/EMPTY FOR TRUE PLAYTESTING EXPERIENCE
  const [coins, setCoins] = useState(380);
  const [carbonSaved, setCarbonSaved] = useState(42.5); // in kg CO2e
  const [streak, setStreak] = useState(4);
  const [xp, setXp] = useState(1180); // 1180/1200 XP: Ready to level up on first quest!
  const [level, setLevel] = useState(12);
  const [chosenRoute, setChosenRoute] = useState(null); // stores selected route ID
  const [completedQuests, setCompletedQuests] = useState([]); // INITIALIZED EMPTY: Let the user play and complete quests!
  
  const personalEnergySaved = (carbonSaved * 1.5).toFixed(1);

  // Sharing states for Story Exporter
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [storyTheme, setStoryTheme] = useState('cyberpunk'); // cyberpunk, emerald, aurora, sunset, transparent
  const [exportedImageUrl, setExportedImageUrl] = useState(null); // Holds generated Base64 image URL
  const canvasRef = useRef(null);

  // Verification Overlay State (Slide 4 Interactive Mockup Flow)
  const [activeVerificationQuest, setActiveVerificationQuest] = useState(null);
  const [verificationStep, setVerificationStep] = useState(1); // 1: Info/Accept, 2: Camera Scanner, 3: Victory Card
  const [scanningLogs, setScanningLogs] = useState([]);
  const [isScanningActive, setIsScanningActive] = useState(false);

  // Activity equivalent energy multiplier values (kWh saved)
  const activityEnergyValues = {
    r_walk_forest: 0.35,
    r_walk_centenary: 0.55,
    r_bike_angry: 0.28,
    r_pop_l1: 0.18,
    r_pop_l2: 0.22,
    r_motorcycle: 0.0,
    q_loop: 0.75, // Bento box
    q_refill: 0.30, // Water refill
    q_shade: 1.20, // Shade walker
    q_proj: 1.80, // Projector closing
    q_reset: 1.50, // study room reset
    q_ac: 1.00, // AC adjustment
    q_phantom: 2.20, // Lab patrol
    q_fume: 3.50, // Fume hood
    q_freezer: 1.70, // freezer closure
    q_streak: 5.00,
    q_raid: 8.00
  };

  // Automatic leveling engine with Carryover XP calculation
  useEffect(() => {
    const needed = level * 100;
    if (xp >= needed) {
      setXp(prev => prev - needed);
      setLevel(prev => {
        const nextLevel = prev + 1;
        setTimeout(() => {
          triggerToast(`🎉 LEVEL UP! ตอนนี้คุณก้าวสู่ระดับ ${nextLevel} แล้ว!`, 'levelUp');
        }, 80);
        return nextLevel;
      });
    }
  }, [xp, level]);

  // Helper calculating today energy metrics dynamically
  const calculateTodayEnergySaved = () => {
    let total = 0.0;
    if (chosenRoute && activityEnergyValues[chosenRoute]) {
      total += activityEnergyValues[chosenRoute];
    }
    completedQuests.forEach(questId => {
      if (activityEnergyValues[questId]) {
        total += activityEnergyValues[questId];
      }
    });
    if (total === 0) return "0.00"; // zero initialized if no tasks done yet
    return total.toFixed(2);
  };

  // Real Chula centroid nodes mapping
  const getActiveMapPins = () => {
    const pins = [];
    
    // Check travel route path pins based on genuine options
    if (chosenRoute === 'r_walk_forest' || chosenRoute === 'r_walk_centenary') {
      pins.push({ id: 'walk', emoji: '👟', label: 'CU Forest', x: 260, y: 500 });
    } else if (chosenRoute === 'r_bike_angry') {
      pins.push({ id: 'bike', emoji: '🚲', label: 'Green Lane', x: 190, y: 480 });
    } else if (chosenRoute === 'r_pop_l1' || chosenRoute === 'r_pop_l2') {
      pins.push({ id: 'pop', emoji: '🚌', label: 'EV Route', x: 380, y: 490 });
    }

    // Check completed quests and map them dynamically
    if (completedQuests.includes('q_loop')) {
      pins.push({ id: 'bento', emoji: '🍱', label: 'Pra Keaw', x: 380, y: 460 });
    }
    if (completedQuests.includes('q_refill')) {
      pins.push({ id: 'water', emoji: '💧', label: 'Central Lib', x: 480, y: 520 });
    }
    if (completedQuests.includes('q_proj') || completedQuests.includes('q_reset') || completedQuests.includes('q_ac')) {
      pins.push({ id: 'patrol', emoji: '🔌', label: 'ENG 3', x: 120, y: 520 });
    }
    if (completedQuests.includes('q_phantom') || completedQuests.includes('q_fume') || completedQuests.includes('q_freezer')) {
      pins.push({ id: 'lab', emoji: '🧪', label: 'Sci Lab', x: 190, y: 440 });
    }

    return pins.slice(0, 4);
  };

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', text: '🚨 ภูตคาร์บอน (Carbon Ghost) ก่อกวน! ตึกวิศวฯ 3 พบการเปิดไฟทิ้งไว้ในวันหยุด!' },
    { id: 2, type: 'rare', text: '🌟 เควส Rare เปิดแล้ว: ปิดระบบเครื่องมือแล็บชั้น 4 คณะวิทยาศาสตร์' }
  ]);

  const [startPoint, setStartPoint] = useState('eng3');
  const [endPoint, setEndPoint] = useState('library');
  const [toast, setToast] = useState(null);
  
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'แลกคูปองน้ำดื่ม CU Cafe', change: -50, type: 'spend', date: 'วันนี้' },
    { id: 2, title: 'โบนัสเช็คอินประหยัดไฟ ENG 3', change: 40, type: 'earn', date: 'เมื่อวาน' },
  ]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addXP = (amount) => {
    setXp(prev => prev + amount);
  };

  // Structured Quest Data aligning with PDF/Slide 4 layout
  const questsData = {
    daily: [
      { id: 'q_loop', title: 'Loop Breaker', desc: 'คืนกล่องข้าวหมุนเวียนผ่านตู้อัจฉริยะในโรงอาหาร', reward: 30, xp: 50, carbon: 0.5, rarity: 'Common', icon: '🍱', location: 'Pra Keaw Canteen', verifyTech: 'RFID Bento Kiosk Webhook API' },
      { id: 'q_refill', title: 'Refill Ranger', desc: 'เติมน้ำดื่มที่ตู้กรองอัจฉริยะแทนการซื้อน้ำขวดใหม่', reward: 20, xp: 30, carbon: 0.2, rarity: 'Common', icon: '💧', location: 'Central Lib Station', verifyTech: 'Water Dispenser Flow Meter Log' },
      { id: 'q_shade', title: 'Shade Walker', desc: 'เดินผ่านเส้นทางต้นไม้ร่มรื่น Chula Urban Forest', reward: 25, xp: 40, carbon: 1.2, rarity: 'Rare', icon: '🌳', location: 'Chula Urban Forest Zone', verifyTech: 'iOS/Android GPS Geofencing' },
    ],
    classroom: [
      { id: 'q_proj', title: 'Projector Slayer', desc: 'ตรวจเช็คและปิดโปรเจกเตอร์หลังเลิกชั้นเรียน 10 นาที', reward: 40, xp: 60, carbon: 1.8, rarity: 'Epic', icon: '🔌', location: 'ENG 3 Building', verifyTech: 'Edge AI Object Detection Camera + CUBEMS API' },
      { id: 'q_reset', title: 'Study Room Reset', desc: 'กดยืนยันการปิดไฟและล็อกห้องหลังใช้ห้องประชุมเสร็จ', reward: 30, xp: 50, carbon: 1.5, rarity: 'Rare', icon: '🚪', location: 'Chula Library Study Block', verifyTech: 'BLE Beacon Proximity + CUBEMS Integration' },
      { id: 'q_ac', title: 'Quick Cooldown', desc: 'ปรับอุณหภูมิแอร์ขึ้นเป็น 26°C ร่วมกับพัดลมช่วงบ่ายเรียน', reward: 20, xp: 30, carbon: 1.0, rarity: 'Common', icon: '❄️', location: 'ENG 3 Lecture Hall', verifyTech: 'CUBEMS Smart Room Temperature Probe' },
    ],
    lab: [
      { id: 'q_phantom', title: 'Phantom Load Patrol', desc: 'กวาดล้างพลังงานแฝง ดึงปลั๊กอุปกรณ์สแตนบายในแล็บเคมี', reward: 50, xp: 80, carbon: 2.2, rarity: 'Epic', icon: '🕵️‍♂️', location: 'Sci Lab Block B', verifyTech: 'Edge Camera Switch Recognition TFLite' },
      { id: 'q_fume', title: 'Fume Hood Master', desc: 'ดึงบานหน้าต่างตู้ควันเคมี (Fume Hood) ลงให้อยู่ในระดับปลอดภัย', reward: 80, xp: 120, carbon: 3.5, rarity: 'Legendary', icon: '🧪', location: 'Organic Chemistry Lab 4', verifyTech: 'Magnetic Proximity Sensors + IoT Gateway Log' },
      { id: 'q_freezer', title: 'Freezer Guardian', desc: 'จัดระเบียบตู้แช่แข็ง -80°C และปิดประตูตู้ให้สนิทใน 10 วินาที', reward: 35, xp: 55, carbon: 1.7, rarity: 'Rare', icon: '🥶', location: 'Bioscience Research Lab', verifyTech: 'Door Contact Sensor Webhook Telemetry' },
    ],
    weekly: [
      { id: 'q_streak', title: '3-Day Green Streak', desc: 'เลือกใช้เส้นทางเดินทางรักษ์โลกติดต่อกันเป็นเวลา 3 วัน', reward: 120, xp: 200, carbon: 5.0, rarity: 'Legendary', icon: '⚡', location: 'Whole Campus Pathways', verifyTech: 'OS HealthKit APIs + Transit Route Matcher' },
      { id: 'q_raid', title: 'Faculty Raid: 300 Actions', desc: 'ร่วมมือกับเพื่อนในคณะเคลียร์เควสห้องเรียนรวมครบเป้าหมาย', reward: 150, xp: 250, carbon: 8.0, rarity: 'Epic', icon: '🏰', location: 'All Engineering Blocks', verifyTech: 'CUBEMS Cumulative Aggregator Engine' },
    ],
  };

  // Open verification dialog wizard instead of instant completing
  const handleQuestActionClick = (quest) => {
    if (completedQuests.includes(quest.id)) {
      triggerToast("คุณผ่านการรับรางวัลเควสนี้ในวันนี้ไปแล้วครับ", "info");
      return;
    }
    setActiveVerificationQuest({ ...quest, isRoute: false });
    setVerificationStep(1);
    setScanningLogs([]);
    setIsScanningActive(false);
  };

  // Simulate step 2 scanner animation & telemetry logging
  const runCameraVerificationLogs = () => {
    setIsScanningActive(true);
    setScanningLogs(["[GPS] กำลังระบุตำแหน่งพิกัดของอุปกรณ์ผู้ใช้นิสิต..."]);
    
    setTimeout(() => {
      setScanningLogs(prev => [...prev, `[GPS] 📍 13.7367° N, 100.5331° E - พิกัดอยู่ในบริเวณจุฬาฯ ${activeVerificationQuest.location} ✅`]);
    }, 600);

    setTimeout(() => {
      if (activeVerificationQuest.id.includes('bike')) {
        setScanningLogs(prev => [...prev, `[AI-VISION] สตรีมกล้อง: ค้นหารายละเอียดสีเขียวและรูปแบบโครงรถ CU Bike...`]);
      } else if (activeVerificationQuest.id.includes('pop')) {
        setScanningLogs(prev => [...prev, `[QR-CODE] ค้นพบจุดสแกนบาร์โค้ดประจำเที่ยวรถ EV Shuttle...`]);
      } else if (activeVerificationQuest.id.includes('walk')) {
        setScanningLogs(prev => [...prev, `[OS-HEALTH] ตรวจดึงปริมาณก้าวเดินเรียลไทม์จากระบบปฏิบัติการมือถือ...`]);
      } else {
        setScanningLogs(prev => [...prev, `[HARDWARE] ดึงข้อมูลจาก CUBEMS/ตู้อัจฉริยะ เพื่อยืนยันพฤติกรรม...`]);
      }
    }, 1200);

    setTimeout(() => {
      if (activeVerificationQuest.id.includes('bike')) {
        setScanningLogs(prev => [...prev, `[AI-VISION] ยืนยันพฤติกรรมปั่นจักรยาน CU Bike จริง (Confidence: 96.8%) ✅`]);
      } else if (activeVerificationQuest.id.includes('pop')) {
        setScanningLogs(prev => [...prev, `[BUS-TELEMETRY] ดึงค่า GPS ตัวรถตรงกับตัวนิสิต: #EV-ROUTE-CHECKIN ✅`]);
      } else if (activeVerificationQuest.id.includes('walk')) {
        setScanningLogs(prev => [...prev, `[GPS-GEOFENCE] เส้นทางลากก้าวเดินผูกติดเขตสวนป่าจามจุรี (Multiplier 1.25x) ✅`]);
      } else {
        setScanningLogs(prev => [...prev, `[TECT-VERIFY] API: ${activeVerificationQuest.verifyTech} ส่งสัญญาณตอบรับ... SUCCESS ✅`]);
      }
    }, 2000);

    setTimeout(() => {
      setScanningLogs(prev => [...prev, `[AI-ENGINE] วิเคราะห์ความถูกต้องเรียบร้อยแล้ว ได้รับการอนุมัติ!`]);
    }, 2700);

    setTimeout(() => {
      setIsScanningActive(false);
      setVerificationStep(3); // Shift directly to Step 3 (Victory)
    }, 3400);
  };

  // INTERNAL CORE CLAIM MECHANIC (Centralized state updates)
  const executeRewardCredits = (q) => {
    if (q.isRoute) {
      setChosenRoute(q.id);
    } else {
      setCompletedQuests(prev => [...prev, q.id]);
    }

    setCoins(prev => prev + q.reward);
    setCarbonSaved(prev => +(prev + q.carbon).toFixed(1));
    addXP(q.xp);
    setStreak(prev => prev + 1);

    const newTx = {
      id: Date.now(),
      title: q.isRoute ? `เดินทางด้วย ${q.title}` : `ทำเควส ${q.title} สำเร็จ`,
      change: q.reward,
      type: 'earn',
      date: 'วันนี้'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // OPTION 1: Claim Only (รับรางวัลเฉยๆ แล้วปิดสแกน)
  const handleClaimOnly = () => {
    const q = activeVerificationQuest;
    if (!q) return;

    executeRewardCredits(q);
    setActiveVerificationQuest(null);
    triggerToast(`🪙 รับรางวัล +${q.reward} Eco-Coins และ +${q.xp} XP สำเร็จ!`);
  };

  // OPTION 2: Claim & Share (รับรางวัล และเรียกตัวแชร์ขึ้นมาทำงานทันที)
  const handleClaimAndShare = () => {
    const q = activeVerificationQuest;
    if (!q) return;

    executeRewardCredits(q);
    setActiveVerificationQuest(null);
    setIsShareModalOpen(true); // Open Story Exporter immediately
    triggerToast(`🎉 รับสิทธิ์แล้ว! กำลังเปิดหน้าต่างแชร์กรีนการ์ดสตอรี่...`);
  };

  // Genuine Chula Transit and Walkways Choices
  const routesData = [
    { id: 'r_walk_forest', title: 'เดินลัดเลาะสระน้ำจุฬาฯ และสวนป่า', desc: 'จากอาคารวิศวฯ 3 เดินเลี่ยงแดดใต้จามจุรีไปยังหอสมุดกลาง', time: '7 นาที', dist: '450m', carbon: '0g', coins: 25, isEco: true, color: 'emerald', verifyTech: 'OS HealthKit APIs + iOS/Android GPS Geofencing' },
    { id: 'r_walk_centenary', title: 'เดินรับลมลัดอุทยาน 100 ปี จุฬาฯ', desc: 'จากสโมสรศาลาพระเกี้ยว มุ่งหน้าสู่คณะพาณิชย์การบัญชีฯ', time: '12 นาที', dist: '850m', carbon: '0g', coins: 35, isEco: true, color: 'emerald', verifyTech: 'OS HealthKit APIs + iOS/Android GPS Geofencing' },
    { id: 'r_bike_angry', title: 'ปั่นจักรยาน CU Bike เลียบอังรีดูนังต์', desc: 'ทางเฉพาะจักรยานสีเขียวเชื่อมหน้าอักษรฯ ไปศาลาพระเกี้ยว', time: '4 นาที', dist: '600m', carbon: '4g', coins: 15, isEco: true, color: 'indigo', verifyTech: 'Edge AI Object Detection Camera + App' },
    { id: 'r_pop_l1', title: 'รถป๊อบจุฬาฯ EV Shuttle Line 1', desc: 'โดยสารรถพลังงานไฟฟ้า 100% (สระน้ำจุฬาฯ - BTS สยาม)', time: '5 นาที', dist: '1.1km', carbon: '12g', coins: 8, isEco: false, color: 'pink', verifyTech: 'EV Bus Smart QR Code Sticker Scanner' },
    { id: 'r_pop_l2', title: 'รถป๊อบจุฬาฯ EV Shuttle Line 2', desc: 'รถเมล์ไฟฟ้าสวัสดิการเลียบสามย่าน (คณะวิศวฯ - สวนหลวงสแควร์)', time: '6 นาที', dist: '1.3km', carbon: '14g', coins: 8, isEco: false, color: 'pink', verifyTech: 'EV Bus Smart QR Code Sticker Scanner' },
    { id: 'r_motorcycle', title: 'วินมอเตอร์ไซค์รับจ้าง (มอเตอร์ไซค์น้ำมัน)', desc: 'เดินทางด่วนข้ามตึกเรียนด้วยวินเครื่องยนต์เบนซินแบบเดิม', time: '2 นาที', dist: '700m', carbon: '150g', coins: 0, isEco: false, color: 'slate', verifyTech: 'None (High Emission)' }
  ];

  // Route selection triggers verification unless it is a petrol motorcycle
  const handleSelectRoute = (route) => {
    if (chosenRoute) {
      triggerToast("คุณได้เดินทางสำหรับเส้นทางวันนี้เสร็จสิ้นไปแล้ว!", "info");
      return;
    }

    if (route.id === 'r_motorcycle') {
      // Petrol motorcycle requires no eco-verification, inflicts bad impact instantly
      setChosenRoute(route.id);
      const newTx = {
        id: Date.now(),
        title: `เดินทางด้วย ${route.title}`,
        change: 0,
        type: 'spend',
        date: 'วันนี้'
      };
      setTransactions([newTx, ...transactions]);
      triggerToast("⚠️ มอเตอร์ไซค์น้ำมันปล่อยคาร์บอนสูงสุด (150g) ไม่ได้รับแต้มรางวัล แนะนำใช้ยานพาหนะไฟฟ้าครับ", "warning");
      return;
    }

    // Eco transits open the 3-step verification modal
    const mappedRouteAsQuest = {
      id: route.id,
      title: route.title,
      desc: route.desc,
      reward: route.coins + (route.isEco ? 5 : 0), // Includes eco bonus
      xp: 30,
      carbon: +((150 - parseInt(route.carbon)) / 1000).toFixed(2), // saved carbon in kg
      location: 'Chulalongkorn Campus',
      verifyTech: route.verifyTech,
      icon: route.id.includes('walk') ? '👟' : route.id.includes('bike') ? '🚲' : '🚌',
      isRoute: true
    };

    setActiveVerificationQuest(mappedRouteAsQuest);
    setVerificationStep(1);
    setScanningLogs([]);
    setIsScanningActive(false);
  };

  const rewardsList = [
    { id: 'reward_cup', title: 'คูปองแลกเครื่องดื่ม CU Cafe', cost: 300, desc: 'แลกส่วนลดเครื่องดื่มมูลค่า 30 บาทที่โรงอาหารพลาซ่า', icon: '☕' },
    { id: 'reward_ev', title: 'EV Pass ชาร์จฟรีช่วงบ่าย', cost: 100, desc: 'รับสิทธิ์ชาร์จรถจักรยานยนต์ไฟฟ้าฟรีช่วงโซลาร์พีก', icon: '🔌' },
    { id: 'reward_ticket', title: 'ตั๋วชมภาพยนตร์เครือ SF / Major', cost: 1000, desc: 'ตั๋วหนังฟรี 1 ใบ สนับสนุนการทำ Net-Zero', icon: '🎬' }
  ];

  const handleRedeem = (reward) => {
    if (coins < reward.cost) {
      triggerToast("ยอดเหรียญ Eco-Coins ไม่เพียงพอสำหรับการแลกซื้อ!", "error");
      return;
    }

    setCoins(prev => prev - reward.cost);
    const newTx = {
      id: Date.now(),
      title: `แลก ${reward.title}`,
      change: -reward.cost,
      type: 'spend',
      date: 'วันนี้'
    };
    setTransactions([newTx, ...transactions]);

    triggerToast(`🎁 แลกสำเร็จ! รหัสคูปองถูกบันทึกสำเร็จ`, 'success');
  };

  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Drawing the 1:1 Square Card (600x600 px) to Native Canvas with Custom typography
  const renderCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas and set dimension
    canvas.width = 600;
    canvas.height = 600;
    ctx.clearRect(0, 0, 600, 600);

    // 1. Draw Card Background with appropriate gradients (Transparent or colored)
    if (storyTheme !== 'transparent') {
      const grad = ctx.createLinearGradient(0, 0, 600, 600);
      if (storyTheme === 'cyberpunk') {
        grad.addColorStop(0, '#4a0422');
        grad.addColorStop(0.5, '#210515');
        grad.addColorStop(1, '#0a0209');
      } else if (storyTheme === 'emerald') {
        grad.addColorStop(0, '#022c22');
        grad.addColorStop(0.5, '#041a16');
        grad.addColorStop(1, '#010807');
      } else if (storyTheme === 'aurora') {
        grad.addColorStop(0, '#0c1033');
        grad.addColorStop(0.5, '#051a24');
        grad.addColorStop(1, '#010408');
      } else if (storyTheme === 'sunset') {
        grad.addColorStop(0, '#3b1704');
        grad.addColorStop(0.5, '#1a0c02');
        grad.addColorStop(1, '#080301');
      }
      ctx.fillStyle = grad;
      drawRoundedRect(ctx, 0, 0, 600, 600, 48);
      ctx.fill();
    }

    // 2. Logo CUVERSE (Top-left)
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(60, 50, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CU', 80, 50);

    ctx.fillStyle = '#10B981';
    ctx.fillText('VERSE', 125, 50);

    // 3. Streak Pill Badge (Top-right)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundedRect(ctx, 420, 30, 140, 40, 20);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`STREAK: ${streak} DAYS`, 490, 50);

    // 4. Center Metrics Block
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ พลังงานลดโลกร้อนวันนี้', 300, 150);

    // Main Value (Energy kWh)
    const valText = calculateTodayEnergySaved();
    ctx.font = '900 80px sans-serif';
    const valW = ctx.measureText(valText).width;

    ctx.font = '300 28px sans-serif';
    const unitW = ctx.measureText(' kWh').width;

    const startX = 300 - ((valW + unitW) / 2);

    ctx.fillStyle = '#10B981';
    ctx.font = '900 80px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(valText, startX, 230);

    ctx.fillStyle = '#ffffff';
    ctx.font = '300 28px sans-serif';
    ctx.fillText(' kWh', startX + valW, 220);

    // Carbon Savings Detail
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`เทียบเท่าการประหยัดคาร์บอน ${carbonSaved.toFixed(1)} kg`, 300, 285);

    // 5. Grid Map representation with precise geometric points
    const mapY = 340;
    const mapH = 180;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    drawRoundedRect(ctx, 40, mapY, 520, mapH, 24);
    ctx.fill();

    // Map grid lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.lineWidth = 1;
    for (let gx = 60; gx < 540; gx += 30) {
      ctx.beginPath();
      ctx.moveTo(gx, mapY + 10);
      ctx.lineTo(gx, mapY + mapH - 10);
      ctx.stroke();
    }
    for (let gy = mapY + 20; gy < mapY + mapH; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(50, gy);
      ctx.lineTo(550, gy);
      ctx.stroke();
    }

    // Connect node path links
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(120, mapY + 120); // ENG 3
    ctx.lineTo(190, mapY + 40);  // Sci Lab
    ctx.lineTo(260, mapY + 100);  // CU Forest
    ctx.lineTo(380, mapY + 60);  // Pra Keaw
    ctx.lineTo(480, mapY + 120); // Central Lib
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    const pins = getActiveMapPins();
    pins.forEach(pin => {
      let px = 260;
      let py = mapY + 100;

      if (pin.id === 'walk') { px = 260; py = mapY + 100; }
      else if (pin.id === 'bike') { px = 190; py = mapY + 80; }
      else if (pin.id === 'pop') { px = 380; py = mapY + 90; }
      else if (pin.id === 'bento') { px = 380; py = mapY + 60; }
      else if (pin.id === 'water') { px = 480; py = mapY + 120; }
      else if (pin.id === 'patrol') { px = 120; py = mapY + 120; }
      else if (pin.id === 'lab') { px = 190; py = mapY + 40; }

      // Outer Radial Glow
      const pulseGrad = ctx.createRadialGradient(px, py, 2, px, py, 24);
      pulseGrad.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
      pulseGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.15)');
      pulseGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = pulseGrad;
      ctx.beginPath();
      ctx.arc(px, py, 24, 0, Math.PI * 2);
      ctx.fill();

      // Indicator dot
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(px, py + 8, 4, 0, Math.PI * 2);
      ctx.fill();

      // Large scale Emoji symbol
      ctx.font = '30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pin.emoji, px, py - 10);

      // Label below pin node
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(pin.label.toUpperCase(), px, py + 20);
    });

    // 6. Geotag and real coords alignment
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📍 CHULALONGKORN UNIV.', 40, 565);

    ctx.fillStyle = '#10B981';
    ctx.textAlign = 'right';
    ctx.fillText('13.7367° N, 100.5331° E', 560, 565);

    // Convert to Image Base64
    const dataUrl = canvas.toDataURL('image/png');
    setExportedImageUrl(dataUrl);
  };

  useEffect(() => {
    if (isShareModalOpen) {
      renderCanvasImage();
    }
  }, [isShareModalOpen, storyTheme, coins, carbonSaved, completedQuests, chosenRoute, streak]);

  const handleDownload = () => {
    if (!exportedImageUrl) return;
    try {
      const link = document.createElement('a');
      link.href = exportedImageUrl;
      link.download = `cuverse_story_card_${storyTheme}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("💾 ดาวน์โหลดการ์ดภาพรักษ์โลกเรียบร้อย!");
    } catch (err) {
      console.error(err);
      triggerToast("ใช้นิ้วแตะค้างที่การ์ดภาพเพื่อบันทึกรูปภาพได้เลยครับ", "info");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center min-h-screen bg-slate-950 font-sans p-6 antialiased text-slate-800">
      
      {/* LEFT COLUMN: Presentation context information with neat typography */}
      <div className="max-w-md text-white space-y-4 px-4 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-3 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Hackathon Core Action Prototype
        </div>
        <h2 className="text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
          CU Eco-Verse
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          ระบบเปลี่ยนพฤติกรรมการประหยัดพลังงานในมหาวิทยาลัยให้เป็นบอร์ดเกม RPG ผ่านเครือข่ายเซ็นเซอร์อัจฉริยะในจุฬาฯ ทำเควสตรวจสอบพฤติกรรมจริงแบบป้องกันการโกง!
        </p>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-left space-y-2">
          <p className="text-xs font-bold text-emerald-400">💡 วิธีจำลองเควสตามสไลด์หน้า 4:</p>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            <li>ไปที่แท็บ <span className="text-white font-bold">"เควส"</span> ด้านล่างสุด</li>
            <li>คลิกปุ่มภารกิจที่สนใจเพื่อเปิดหน้าจอจำลองตรวจสอบ 3 ขั้นตอน</li>
            <li>ดูขั้นตอนกล้องสแกน และ GPS Telemetry จาก CUBEMS เสมือนจริง</li>
            <li>รับรางวัลสะสมเพื่อนำข้อมูลพิกัดขึ้นไปแสดงที่การ์ดแชร์ IG Story!</li>
          </ul>
        </div>
      </div>

      {/* RIGHT COLUMN: Mobile simulator viewport container */}
      <div className="relative w-full max-w-[390px] h-[750px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col shrink-0">
        
        {/* Notch hardware simulator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
        </div>

        {/* Status Bar */}
        <div className="w-full h-9 bg-slate-50 text-slate-900 flex justify-between items-center px-6 pt-2 text-[11px] font-bold z-30 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-pink-100 text-pink-600 px-1.5 py-0.2 rounded font-extrabold">5G CU_WiFi</span>
            <div className="w-4 h-2.5 border border-slate-900 rounded-xs p-[1px] flex items-center">
              <div className="h-full w-2.5 bg-slate-950 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Header toolbar */}
        <div className="bg-white border-b border-slate-100 px-4 py-2 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-black tracking-wider text-slate-800">ECO-VERSE</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>Streak: {streak} วัน</span>
          </div>
        </div>

        {/* Custom Notifications Log */}
        {toast && (
          <div className="absolute top-12 left-4 right-4 bg-slate-900 text-white text-[10.5px] p-2.5 rounded-xl shadow-lg z-50 flex items-center gap-2 border border-slate-800 animate-bounce">
            <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
            <p className="leading-tight">{toast.message}</p>
          </div>
        )}

        {/* SCROLLABLE MAIN BODY VIEWPORT */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative pb-16">
          
          {/* TAB 1: HOME PAGE */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              {/* Premium Carbon Hero Profile Card */}
              <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 rounded-3xl p-4 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <Award className="w-32 h-32 rotate-12" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      ENG-GUILD
                    </span>
                    <h3 className="text-base font-black mt-1">เกียรตศักดิ์ วิศวฯ ปี 1</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-pink-200">Carbon Hero</p>
                    <p className="text-sm font-black text-white">Level {level}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-pink-100">
                    <span>ค่าประสบการณ์ (XP)</span>
                    <span>{xp}/{level * 100} XP</span>
                  </div>
                  <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${(xp / (level * 100)) * 100}%` }}></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <p className="text-[9px] text-pink-100">กระเป๋า Eco-Coins</p>
                    <p className="text-base font-black mt-0.5 flex items-center gap-1 text-yellow-300">
                      {coins.toLocaleString()} <span className="text-[10px] bg-white/20 text-white px-1 py-0.2 rounded">🪙</span>
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <p className="text-[9px] text-pink-100">คาร์บอนที่ลดสะสม</p>
                    <p className="text-base font-black mt-0.5 text-emerald-300">
                      {carbonSaved} <span className="text-[10px] text-white">kg CO₂e</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Strava Share Dynamic Story Generator Trigger */}
              <button
                onClick={() => {
                  setIsShareModalOpen(true);
                }}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white p-3.5 rounded-2xl border border-emerald-500/25 shadow-md flex items-center justify-between transition-all font-black text-[11px] uppercase tracking-wide group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                  แชร์กรีนการ์ดวันนี้ลง Story อวดเพื่อน ๆ กัน!
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[9px]">READY 📲</span>
              </button>

              {/* Eco Alert Bubble */}
              {notifications.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 relative">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <Info className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 pr-6">
                    <p className="text-[11px] font-bold text-amber-900">เหตุการณ์พลังงานเรียลไทม์:</p>
                    <p className="text-[10px] text-amber-800 mt-0.5 leading-tight">{notifications[0].text}</p>
                  </div>
                  <button 
                    onClick={() => setNotifications(notifications.slice(1))}
                    className="absolute right-2 top-2 p-1 text-amber-500 hover:text-amber-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Mascot Bubble Tip - Nong Greeny */}
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3 flex items-start gap-3">
                <div className="shrink-0 w-11 h-11 bg-white rounded-full border-2 border-emerald-400 flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 40 40" className="w-8 h-8">
                    <path d="M20 32 C20 32, 28 22, 28 15 C28 9, 24 5, 20 5 C16 5, 12 9, 12 15 C12 22, 20 32, 20 32 Z" fill="#10B981" />
                    <path d="M20 32 C20 32, 24 25, 24 19 C24 16, 22 14, 20 14 C18 14, 16 16, 16 19 C16 25, 20 32, 20 32 Z" fill="#E71D73" opacity="0.8" />
                    <circle cx="17" cy="15" r="1.5" fill="#fff" />
                    <circle cx="23" cy="15" r="1.5" fill="#fff" />
                    <path d="M18 18 Q20 20 22 18" stroke="#fff" strokeWidth="1" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    น้อง Greeny ท้าทาย! <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  </h4>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">
                    "ยินดีต้อนรับสู่อารยธรรมคาร์บอนต่ำในจุฬาฯ! ลองกดเมนูด้านล่าง เพื่อทำเควสและเดินเรียนแบบประหยัดพลังงานกันได้เลยครับ!"
                  </p>
                </div>
              </div>

              {/* Recommended Action Shortcuts */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-2.5">
                  <Flame className="w-4 h-4 text-rose-500" /> แนะนำด่วนสำหรับคุณ
                </h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => { setActiveTab('quests'); setActiveQuestTab('classroom'); }}
                    className="w-full bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-lg">🔌</div>
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-800">ปิดโปรเจกเตอร์และเช็คระบบห้องเรียน</h5>
                        <p className="text-[9px] text-slate-500">เควส Classroom ตระเวนตรวจเช็คความยั่งยืน</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('route')}
                    className="w-full bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-lg">🚶‍♂️</div>
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-800">ค้นหาเส้นทางเดินเรียนสีเขียว</h5>
                        <p className="text-[9px] text-slate-500">รับโบนัส Eco-Coins สูงสุดเมื่อสแกนก้าวผ่านสวน</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ROUTE NAVIGATION */}
          {activeTab === 'route' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              {/* Point Input Selector */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Navigation className="w-4.5 h-4.5 text-pink-600" />
                  <span className="text-xs font-black text-slate-800">ระบบจำลองการเดินทางคาร์บอนต่ำ</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase">จุดเริ่มต้น</label>
                    <select 
                      value={startPoint} 
                      onChange={(e) => { setStartPoint(e.target.value); setChosenRoute(null); }}
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px] font-bold"
                    >
                      <option value="eng3">ตึก 3 คณะวิศวกรรมศาสตร์</option>
                      <option value="arts">เทวาลัย คณะอักษรศาสตร์</option>
                      <option value="coop">ศาลาพระเกี้ยว (CU Coop)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase">จุดหมายปลายทาง</label>
                    <select 
                      value={endPoint} 
                      onChange={(e) => { setEndPoint(e.target.value); setChosenRoute(null); }}
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px] font-bold"
                    >
                      <option value="library">หอสมุดกลางจุฬาฯ</option>
                      <option value="coop">โรงอาหารศาลาพระเกี้ยว</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Simplified Map representation */}
              <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 relative h-[180px] overflow-hidden shadow-inner">
                <div className="absolute top-2 left-2 bg-slate-800/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-emerald-400 flex items-center gap-1 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  CU Digital Twin Grid Line
                </div>

                <svg className="w-full h-full" viewBox="0 0 320 200">
                  <line x1="0" y1="50" x2="320" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="0" y1="100" x2="320" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="0" y1="150" x2="320" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                  
                  <path d="M 40 140 Q 160 50 280 120" stroke="#334155" strokeWidth="3" fill="none" />
                  <path d="M 40 140 Q 100 120 280 120" stroke="#10B981" strokeWidth="3" fill="none" strokeDasharray="4,4" />
                  <path d="M 40 140 Q 180 180 280 120" stroke="#E11D48" strokeWidth="2.5" fill="none" />

                  <g transform="translate(40, 140)">
                    <circle r="8" fill="#E11D48" />
                    <circle r="4" fill="#fff" />
                    <text y="18" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">จุดเริ่มต้น</text>
                  </g>

                  <g transform="translate(280, 120)">
                    <circle r="8" fill="#10B981" />
                    <circle r="4" fill="#fff" />
                    <text y="18" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">ปลายทาง</text>
                  </g>
                </svg>
              </div>

              {/* Transit Options cards */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">โปรดเลือกช่องทางการเดินทางเพื่อไปเรียน</p>

                {routesData.map(route => {
                  const isThisRouteSelected = chosenRoute === route.id;
                  
                  return (
                    <div 
                      key={route.id}
                      className={`bg-white rounded-2xl p-3 border-2 transition-all flex justify-between items-center ${
                        isThisRouteSelected 
                          ? 'border-emerald-500 bg-emerald-50/20' 
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold text-lg ${
                          route.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                          route.color === 'indigo' ? 'bg-indigo-50 text-indigo-700' :
                          route.color === 'pink' ? 'bg-pink-50 text-pink-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {route.id.includes('walk') ? '👟' : route.id.includes('bike') ? '🚲' : route.id.includes('pop') ? '🚌' : '🛵'}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-[11px] font-bold text-slate-800 leading-tight">{route.title}</h4>
                            {route.isEco && (
                              <span className="text-[8px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-extrabold uppercase shrink-0">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{route.desc}</p>
                          <p className="text-[9px] text-slate-400 mt-1">
                            ⏱️ {route.time} | 📏 {route.dist} | 🌳 คาร์บอน: <span className="font-bold text-rose-500">{route.carbon}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        {chosenRoute ? (
                          isThisRouteSelected ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> เดินทางแล้ว
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">จำกัดสิทธิ์</span>
                          )
                        ) : (
                          <button 
                            onClick={() => handleSelectRoute(route)}
                            className={`text-[10px] font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                              route.isEco 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                : 'bg-slate-800 hover:bg-slate-900 text-white'
                            }`}
                          >
                            ทำภารกิจ
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: QUESTS BOARD */}
          {activeTab === 'quests' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              {/* Category buttons selection */}
              <div className="bg-white p-1 rounded-2xl border border-slate-200/80 grid grid-cols-4 gap-1 select-none">
                {['daily', 'classroom', 'lab', 'weekly'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveQuestTab(tab)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all cursor-pointer ${
                      activeQuestTab === tab 
                        ? 'bg-pink-600 text-white' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab === 'daily' ? 'รายวัน' : tab === 'classroom' ? 'ห้องเรียน' : tab === 'lab' ? 'ห้องแล็บ' : 'ท้าทาย'}
                  </button>
                ))}
              </div>

              {/* Dynamic list rendering */}
              <div className="space-y-2.5">
                {questsData[activeQuestTab].map((quest) => {
                  const isCompleted = completedQuests.includes(quest.id);
                  
                  return (
                    <div 
                      key={quest.id}
                      className={`bg-white rounded-2xl p-3 border-2 transition-all relative overflow-hidden ${
                        isCompleted 
                          ? 'border-emerald-200 bg-emerald-50/10' 
                          : 'border-slate-100 hover:border-slate-200/80'
                      }`}
                    >
                      <span className={`absolute top-0 left-0 text-[8px] font-black px-2 py-0.5 rounded-br-lg uppercase ${
                        quest.rarity === 'Legendary' ? 'bg-amber-500 text-slate-950' :
                        quest.rarity === 'Epic' ? 'bg-purple-600 text-white' :
                        quest.rarity === 'Rare' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {quest.rarity}
                      </span>

                      <div className="flex items-start gap-3 mt-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">
                          {quest.icon}
                        </div>

                        <div className="flex-1">
                          <h4 className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                            {quest.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{quest.desc}</p>
                          
                          <div className="mt-2 flex gap-3 text-[9px] font-semibold text-slate-400">
                            <span className="flex items-center gap-0.5 text-yellow-600">
                              🪙 +{quest.reward}
                            </span>
                            <span className="flex items-center gap-0.5 text-pink-600">
                              ⚡ +{quest.xp} XP
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center self-center">
                          {isCompleted ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-4 h-4" /> สำเร็จแล้ว
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleQuestActionClick(quest)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                            >
                              ทำภารกิจ
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: WALLET & ECO-COIN SHOP */}
          {activeTab === 'wallet' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              {/* Premium Card Displaying coins */}
              <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-4 text-white relative overflow-hidden border border-indigo-500/20 shadow-md">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                  <Wallet className="w-36 h-36" />
                </div>
                
                <p className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase">
                  Chulalongkorn Eco-Token Wallet
                </p>
                <h3 className="text-3xl font-black mt-2 tracking-tight text-yellow-300">
                  {coins.toLocaleString()} <span className="text-xs font-bold text-white">ECO-COINS</span>
                </h3>

                <div className="mt-4 pt-3 border-t border-indigo-800 flex justify-between text-[10px] text-indigo-200">
                  <div>
                    <p className="text-[9px] text-indigo-400">เทียบเท่าส่วนลดมัดจำ</p>
                    <p className="font-bold text-white">{ (coins / 10).toFixed(0) } บาท</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-indigo-400">ระดับเครดิตคาร์บอน</p>
                    <p className="font-bold text-emerald-400">Class-A Carbon Saver</p>
                  </div>
                </div>
              </div>

              {/* Rewards List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-pink-600" /> ของรางวัลในรั้วมหาวิทยาลัย
                </h4>

                <div className="space-y-2.5">
                  {rewardsList.map((reward) => (
                    <div 
                      key={reward.id}
                      className="bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg shrink-0">
                          {reward.icon}
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-slate-800">{reward.title}</h5>
                          <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{reward.desc}</p>
                          <p className="text-[9px] text-slate-400 mt-1">ใช้ {reward.cost} 🪙 แลกซื้อ</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleRedeem(reward)}
                        className="bg-pink-600 hover:bg-pink-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer"
                      >
                        แลกสิทธิ์
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">ประวัติการทำความดีและแลกของ</h4>
                
                <div className="space-y-1.5">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="bg-white p-2.5 rounded-xl border border-slate-100 flex justify-between items-center text-[10px]">
                      <div>
                        <p className="font-bold text-slate-800">{tx.title}</p>
                        <p className="text-[8px] text-slate-400 mt-0.5">{tx.date}</p>
                      </div>
                      <span className={`font-black ${
                        tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {tx.type === 'earn' ? `+${tx.change}` : tx.change} 🪙
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: GUILD WARS & LEADERBOARD (VPP PANEL) */}
          {activeTab === 'guild' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              {/* Virtual Power Plant Interactive Board */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-4 relative overflow-hidden border border-indigo-500/25 shadow-md">
                <div className="absolute right-[-15px] top-[-10px] opacity-10">
                  <Sun className="w-32 h-32 text-yellow-300 animate-pulse" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full font-bold uppercase border border-indigo-500/20 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" /> Virtual Power Plant
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold">● ตลาดซื้อขายไฟเปิดอยู่</span>
                  </div>

                  <h3 className="text-sm font-bold mt-2.5">ตลาดซื้อขายไฟจุฬาส่วนเกิน (VPP Active)</h3>
                  <p className="text-[10px] text-indigo-200 mt-1 leading-relaxed">
                    ตึกคณะวิศวกรรมศาสตร์ผลิตไฟจาก Solar Cell เกินการใช้งานในระบบขณะนี้ คุณสามารถโหวตเพื่อนำพลังงานส่วนเกินไปแลกเป็นรางวัลเหรียญกองกลางได้!
                  </p>

                  <div className="mt-4 pt-3 border-t border-indigo-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[9px] text-indigo-400">กำลังไฟส่วนเกินจำหน่ายได้</p>
                      <p className="text-base font-black text-yellow-300">120 kW</p>
                    </div>

                    <button 
                      onClick={() => {
                        setCoins(prev => prev + 200);
                        triggerToast("⚡ แปลงโซลาร์ล้นระบบคณะวิศวกรรมศาสตร์สำเร็จ (+200 Coins)");
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black px-3 py-2 rounded-xl flex items-center gap-1 shadow cursor-pointer"
                    >
                      ส่งจ่ายเข้าสโมฯ คณะ (+200🪙)
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Contribution Clean Energy Saved Card */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sun className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[11px] font-extrabold text-emerald-400 tracking-wider uppercase">พลังสะอาดที่คุณช่วยลดให้คณะ</h4>
                  <p className="text-base font-black text-slate-800 mt-0.5">
                    {personalEnergySaved} <span className="text-xs font-semibold text-slate-500">kWh สะสม</span>
                  </p>
                </div>
              </div>

              {/* Leaderboard rankings adjusted to show clean energy saved details */}
              <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
                    <Award className="w-4 h-4 text-pink-600 animate-pulse" /> Faculty Leaderboard (RES-Rank)
                  </h4>
                  <span className="text-[9px] text-slate-400 font-semibold">ฤดูกาลที่ 1</span>
                </div>

                <div className="space-y-2.5">
                  {/* Guild Rank 1: Engineering */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/20 border border-emerald-100 rounded-2xl p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-black text-xs flex items-center justify-center">
                          👑 1
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-slate-800">วิศวกรรมศาสตร์ (ENG)</h5>
                          <p className="text-[9px] text-slate-500">พลังสะอาดสะสมลดได้: <span className="font-extrabold text-emerald-600">2,450 kWh</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-700 block">45.5 RES</span>
                        <span className="text-[8px] text-slate-400">ตัวคูณ x1.2</span>
                      </div>
                    </div>
                    {/* Visual RES sub-metrics values */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[8px] font-mono text-slate-500">
                      <span>ประหยัดไฟ: 24% (x0.5)</span>
                      <span>หมุนเวียน: 55% (x0.3)</span>
                      <span>ส่วนร่วม: 85% (x0.2)</span>
                    </div>
                  </div>

                  {/* Guild Rank 2: Science */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 text-slate-700 font-black text-xs flex items-center justify-center">
                          2
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-slate-800">วิทยาศาสตร์ (SCI)</h5>
                          <p className="text-[9px] text-slate-500">พลังสะอาดสะสมลดได้: <span className="font-semibold text-slate-700">1,980 kWh</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-700 block">42.0 RES</span>
                        <span className="text-[8px] text-slate-400">ตัวคูณ x1.1</span>
                      </div>
                    </div>
                    {/* Visual RES sub-metrics values */}
                    <div className="mt-2 pt-2 border-t border-slate-100/60 flex justify-between text-[8px] font-mono text-slate-400">
                      <span>ประหยัดไฟ: 18% (x0.5)</span>
                      <span>หมุนเวียน: 60% (x0.3)</span>
                      <span>ส่วนร่วม: 75% (x0.2)</span>
                    </div>
                  </div>

                  {/* Guild Rank 3: Architecture */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 text-slate-700 font-black text-xs flex items-center justify-center">
                          3
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-slate-800">สถาปัตยกรรมศาสตร์ (ARC)</h5>
                          <p className="text-[9px] text-slate-500">พลังสะอาดสะสมลดได้: <span className="font-semibold text-slate-700">1,420 kWh</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-500 block">37.5 RES</span>
                        <span className="text-[8px] text-slate-400">ตัวคูณ x1.0</span>
                      </div>
                    </div>
                    {/* Visual RES sub-metrics values */}
                    <div className="mt-2 pt-2 border-t border-slate-100/60 flex justify-between text-[8px] font-mono text-slate-400">
                      <span>ประหยัดไฟ: 15% (x0.5)</span>
                      <span>หมุนเวียน: 40% (x0.3)</span>
                      <span>ส่วนร่วม: 90% (x0.2)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-[9px] text-slate-500 leading-normal flex items-start gap-1.5">
                  <span className="text-emerald-600 text-base shrink-0">💡</span>
                  <p>
                    <span className="font-extrabold text-slate-700">กลไกการปรับเปลี่ยนพฤติกรรม:</span> ยิ่งคนในกิลด์ช่วยกันกดยืนยันปิดแอร์ห้องเรียน หรือเพิ่มสัดส่วนพลังงาน Solar-Share คณะคุณจะได้รับคะแนน **RES สูงสุด** ประจำสัปดาห์!
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* INTERACTIVE QUEST VERIFICATION OVERLAY (Slide 4 Mockup Simulator Flow with claim choices) */}
        {activeVerificationQuest && (
          <div className="absolute inset-0 bg-[#090D1A] z-50 flex flex-col justify-between p-5 text-white animate-scaleUp">
            
            {/* Step Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-[10px] font-extrabold bg-pink-950/80 text-pink-400 border border-pink-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                STEP {verificationStep} OF 3
              </span>
              <button 
                onClick={() => setActiveVerificationQuest(null)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FLOW STEP 1: QUEST INFORMATIONAL ACCEPTANCE */}
            {verificationStep === 1 && (
              <div className="flex-1 flex flex-col justify-between py-4 space-y-4">
                <div className="space-y-4 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-pink-500/10">
                    {activeVerificationQuest.icon}
                  </div>
                  <div>
                    <span className="text-[10px] text-pink-400 font-extrabold tracking-widest uppercase">
                      {activeVerificationQuest.isRoute ? 'TRANSIT BRIEFING' : 'QUEST BRIEFING'}
                    </span>
                    <h3 className="text-xl font-black mt-1">{activeVerificationQuest.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 px-4 leading-relaxed">{activeVerificationQuest.desc}</p>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">📍 สถานที่ตั้งเควส:</span>
                      <span className="text-slate-300 font-bold text-right max-w-[180px]">{activeVerificationQuest.location}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">🔌 เทคโนโลยีการทวนสอบ:</span>
                      <span className="text-emerald-400 font-bold text-right max-w-[180px]">{activeVerificationQuest.verifyTech}</span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-2 border-t border-slate-900">
                      <span className="text-slate-500">🪙 รางวัล Coins:</span>
                      <span className="text-yellow-400 font-bold font-mono">+{activeVerificationQuest.reward} EC</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">⭐ รางวัล XP:</span>
                      <span className="text-pink-400 font-bold font-mono">+{activeVerificationQuest.xp} XP</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setVerificationStep(2);
                      runCameraVerificationLogs();
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/15 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-slate-950" /> เริ่มการสแกนทวนสอบพฤติกรรม
                  </button>
                  <p className="text-[9px] text-slate-500 text-center">
                    เมื่อกดแล้วจะเปิดระบบจำลองกล้องและดึงค่า GPS ทรานแซกชันจริง
                  </p>
                </div>
              </div>
            )}

            {/* FLOW STEP 2: CAMERA VIEWPORT & SENSOR TELEMETRY */}
            {verificationStep === 2 && (
              <div className="flex-1 flex flex-col justify-between py-4">
                
                {/* Simulated Camera Viewfinder */}
                <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-slate-950 rounded-[32px] border-2 border-slate-800 overflow-hidden flex items-center justify-center">
                  
                  {/* Camera Corner Borders */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-pink-500"></div>
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-pink-500"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-pink-500"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-pink-500"></div>

                  {/* Horizontal Scanline Laser */}
                  <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-bounce top-1/2 z-10"></div>
                  
                  {/* Vector mock image preview based on quest item */}
                  <div className="text-center opacity-70 z-0 select-none px-4">
                    <span className="text-7xl block mb-2 animate-pulse">{activeVerificationQuest.icon}</span>
                    
                    {activeVerificationQuest.id.includes('bike') ? (
                      <p className="text-[9px] text-slate-400">กรุณาจัดเฟรมภาพให้เห็นรหัส Green CU Bike เพื่อให้ AI ตรวจจับวิเคราะห์สีและโครงสร้างรถ...</p>
                    ) : activeVerificationQuest.id.includes('pop') ? (
                      <p className="text-[9px] text-slate-400">กรุณาสแกน QR Code สติ๊กเกอร์ตรวจทวนความถี่รถป๊อบไฟฟ้าสวัสดิการที่ติดอยู่ในห้องโดยสาร...</p>
                    ) : (
                      <p className="text-[9px] text-slate-400">CAMERA PREVIEW: [{activeVerificationQuest.title}]</p>
                    )}
                  </div>

                  {/* Scanning Status Badge */}
                  <div className="absolute bottom-4 bg-slate-900/95 border border-slate-800 px-3 py-1 rounded-full text-[9px] font-mono text-emerald-400 z-20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    EDGE_AI_SCANNING_ACTIVE
                  </div>
                </div>

                {/* Simulated Real-time Logging terminal */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">TELEMETRY VERIFICATION STREAM</span>
                    <span className="text-[9px] font-mono text-pink-400">[13.7367° N, 100.5331° E]</span>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 h-28 font-mono text-[9px] text-left text-slate-300 space-y-1.5 overflow-y-auto">
                    {scanningLogs.map((log, index) => (
                      <div key={index} className="leading-relaxed animate-fadeIn">
                        {log}
                      </div>
                    ))}
                    {isScanningActive && (
                      <div className="text-slate-500 animate-pulse">● กำลังประมวลผลข้อมูล...</div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-slate-400">การสแกนและ GPS จะจับตำแหน่งความจริงใจ</p>
                  <p className="text-[9px] text-slate-600 mt-1">ระบบ AI และเซ็นเซอร์จะทวนสอบตำแหน่งเครื่องแบบปลอดภัยไร้การโกง</p>
                </div>

              </div>
            )}

            {/* FLOW STEP 3: SUCCESS & VICTORY CLAIM SCREEN (Offering Claim vs Claim & Share choices) */}
            {verificationStep === 3 && (
              <div className="flex-1 flex flex-col justify-between py-4">
                
                <div className="space-y-4 text-center py-4">
                  {/* Glowing Victory Ring */}
                  <div className="relative w-20 h-24 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute inset-0 border-4 border-emerald-400/30 rounded-full animate-spin-slow"></div>
                    <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-500/30">
                      <Check className="w-8 h-8 stroke-[3.5px]" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">MISSION COMPLETED</span>
                    <h3 className="text-2xl font-black text-white mt-1">QUEST COMPLETED!</h3>
                    <p className="text-xs text-slate-400 mt-1">คุณประหยัดพลังงานสำเร็จพร้อมได้รับรางวัลแล้ว</p>
                  </div>

                  {/* Rewards Breakdown Cards */}
                  <div className="grid grid-cols-2 gap-3 max-w-[260px] mx-auto">
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
                      <p className="text-[9px] text-slate-500">ได้รับเหรียญสะสม</p>
                      <p className="text-sm font-black text-yellow-400 mt-0.5">+{activeVerificationQuest.reward} Coins 🪙</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
                      <p className="text-[9px] text-slate-500">ได้รับค่าประสบการณ์</p>
                      <p className="text-sm font-black text-pink-400 mt-0.5">+{activeVerificationQuest.xp} XP 🌟</p>
                    </div>
                  </div>
                </div>

                {/* Dual Decision Choice Buttons (Claim vs Claim & Share) */}
                <div className="space-y-2 max-w-[280px] mx-auto w-full">
                  <button
                    onClick={handleClaimAndShare}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/15 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4 text-slate-950" /> รับรางวัลและแชร์กรีนการ์ด (Claim & Share)
                  </button>

                  <button
                    onClick={handleClaimOnly}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs border border-slate-700/60 cursor-pointer"
                  >
                    รับรางวัลเท่านั้น (Claim Only)
                  </button>

                  <p className="text-[9px] text-slate-500 text-center mt-1">
                    การแชร์ลง IG Story จะเพิ่มการตื่นตัวและคะแนนสะสมภาพรวมของสโมฯ คณะ
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

        {/* BOTTOM GLOBAL MOBILE TAB NAVIGATION BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-[64px] bg-white border-t border-slate-200/80 px-4 py-2 flex justify-around items-center rounded-t-2xl shadow-lg z-20 select-none shrink-0">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'home' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5.5 h-5.5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">หน้าแรก</span>
          </button>

          <button 
            onClick={() => setActiveTab('route')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'route' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MapPin className={`w-5.5 h-5.5 ${activeTab === 'route' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">สแกนเส้นทาง</span>
          </button>

          <button 
            onClick={() => setActiveTab('quests')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'quests' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Award className={`w-5.5 h-5.5 ${activeTab === 'quests' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">เควส</span>
          </button>

          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'wallet' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Wallet className={`w-5.5 h-5.5 ${activeTab === 'wallet' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">กระเป๋าเงิน</span>
          </button>

          <button 
            onClick={() => setActiveTab('guild')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'guild' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users className={`w-5.5 h-5.5 ${activeTab === 'guild' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">อันดับคณะ</span>
          </button>

        </div>

      </div>

      {/* STRARVA-STYLE GORGEOUS GREEN IMPACT STORY MODAL OVERLAY (1:1 Aspect Ratio Exporter) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[999] p-4 select-none overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] w-full max-w-[360px] p-5 relative flex flex-col gap-4 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-white text-xs font-black tracking-wide flex items-center gap-1">
                <Share2 className="w-4 h-4 text-emerald-400" /> ECO-STORY GENERATOR
              </h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Selector Palette */}
            <div className="flex justify-between items-center bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-pink-400" /> เลือกธีมพื้นหลัง:
              </span>
              <div className="flex gap-1.5">
                {['cyberpunk', 'emerald', 'aurora', 'sunset', 'transparent'].map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setStoryTheme(t);
                    }}
                    title={t === 'transparent' ? 'พื้นหลังโปร่งใส' : `ธีม ${t}`}
                    className={`w-5 h-5 rounded-full border cursor-pointer ${
                      t === 'emerald' ? 'bg-[#022c22] border-[#10B981]' :
                      t === 'cyberpunk' ? 'bg-gradient-to-br from-[#4a0422] to-[#0a0209] border-[#f43f5e]' :
                      t === 'aurora' ? 'bg-gradient-to-br from-[#0c1033] to-[#010408] border-[#38bdf8]' :
                      t === 'sunset' ? 'bg-gradient-to-br from-[#3b1704] to-[#080301] border-[#f59e0b]' :
                      'bg-slate-800 border-slate-400 border-dashed relative after:content-[""] after:absolute after:inset-1 after:border-t after:border-rose-400 after:rotate-45'
                    } ${storyTheme === t ? 'scale-125 ring-2 ring-white/50' : 'opacity-70'}`}
                  />
                ))}
              </div>
            </div>

            {/* Hidden canvas rendering block */}
            <canvas ref={canvasRef} className="hidden" />

            {/* REAL NATIVE IMAGE CONTAINER (Base64 for perfect touch-hold mobile compatibility) */}
            <div className="relative flex justify-center items-center w-[328px] h-[328px] mx-auto rounded-[36px] overflow-hidden bg-slate-950/40 border border-slate-800/50">
              {exportedImageUrl ? (
                <img 
                  src={exportedImageUrl} 
                  alt="CUVERSE Eco Story Map Card" 
                  className="w-full h-full object-contain cursor-pointer pointer-events-auto select-all"
                  title="แตะค้างที่รูปภาพเพื่อบันทึก"
                />
              ) : (
                <div className="text-white text-xs font-medium animate-pulse flex flex-col items-center gap-2">
                  <span className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
                  กำลังสร้างพิกัดแผนที่กรีน...
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5 shrink-0">
              <div className="bg-slate-950/60 p-2.5 text-center rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 leading-normal">
                  💡 <span className="font-extrabold text-[#10B981]">เคล็ดลับบนมือถือ:</span> แตะนิ้วค้างไว้ที่ตัวการ์ดภาพด้านบนเพื่อเลือกบันทึกรูปภาพ (Save Image) ลงแกลเลอรีได้ทันที!
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  disabled={!exportedImageUrl}
                  className="flex-1 bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-black text-[10.5px] flex items-center justify-center gap-1 shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" /> ดาวน์โหลด PNG
                </button>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-4 rounded-xl font-bold text-[10.5px] transition-colors cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
