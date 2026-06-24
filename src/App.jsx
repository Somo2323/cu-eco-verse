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
  Palette
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, route, quests, wallet, guild
  const [activeQuestTab, setActiveQuestTab] = useState('daily'); // daily, classroom, lab, weekly
  
  const [coins, setCoins] = useState(1250);
  const [carbonSaved, setCarbonSaved] = useState(42.5); // in kg CO2e
  const [streak, setStreak] = useState(4);
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(3);
  const [chosenRoute, setChosenRoute] = useState(null); // stores selected route ID
  const [completedQuests, setCompletedQuests] = useState([]); // Array of completed quest IDs
  
  const personalEnergySaved = (carbonSaved * 1.5).toFixed(1);

  // Sharing states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [storyTheme, setStoryTheme] = useState('cyberpunk'); // cyberpunk, emerald, aurora, sunset, transparent
  const [exportedImageUrl, setExportedImageUrl] = useState(null); // Holds generated Base64 image URL
  
  const activityEnergyValues = {
    r_walk: 0.35,
    r_bike: 0.28,
    r_pop: 0.18,
    r_car: 0.0,
    q_loop: 0.75,
    q_refill: 0.30,
    q_shade: 1.80,
    q_proj: 2.70,
    q_reset: 2.25,
    q_ac: 1.50,
    q_phantom: 3.30,
    q_fume: 5.25,
    q_freezer: 2.55,
    q_streak: 7.50,
    q_raid: 12.00
  };

  const calculateTodayEnergySaved = () => {
    let total = 0;
    if (chosenRoute && activityEnergyValues[chosenRoute]) {
      total += activityEnergyValues[chosenRoute];
    }
    completedQuests.forEach(questId => {
      if (activityEnergyValues[questId]) {
        total += activityEnergyValues[questId];
      }
    });
    if (total === 0) return "5.90"; // Base matching representation
    return total.toFixed(2);
  };

  const getTodayBadges = () => {
    const badges = [];
    if (chosenRoute === 'r_walk') badges.push({ emoji: '👟', label: 'Walk' });
    if (chosenRoute === 'r_bike') badges.push({ emoji: '🚲', label: 'Bike' });
    if (chosenRoute === 'r_pop') badges.push({ emoji: '🚌', label: 'EV Pop' });
    
    if (completedQuests.includes('q_loop')) badges.push({ emoji: '🍱', label: 'Bento' });
    if (completedQuests.includes('q_refill')) badges.push({ emoji: '💧', label: 'Water' });
    if (completedQuests.includes('q_proj') || completedQuests.includes('q_phantom')) badges.push({ emoji: '🔌', label: 'Patrol' });

    if (badges.length === 0) {
      badges.push({ emoji: '👟', label: 'Walk' });
      badges.push({ emoji: '🍱', label: 'Bento' });
      badges.push({ emoji: '💧', label: 'Water' });
      badges.push({ emoji: '🔌', label: 'Patrol' });
    }
    return badges.slice(0, 4);
  };

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', text: '🚨 ภูตคาร์บอน (Carbon Ghost) ก่อกวน! ตึกวิศวฯ 3 พบการเปิดไฟทิ้งไว้ในวันหยุด!' },
    { id: 2, type: 'rare', text: '🌟 เควส Rare ระดับตำนานเปิดแล้ว: ปิดระบบแล็บชั้น 4 คณะวิทยาศาสตร์' }
  ]);

  const [startPoint, setStartPoint] = useState('eng3');
  const [endPoint, setEndPoint] = useState('library');

  const [vppTradable, setVppTradable] = useState(120); // kW
  const [vppTraded, setVppTraded] = useState(false);

  const [toast, setToast] = useState(null);
  
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'แลกกล่องข้าวหมุนเวียนสำเร็จ', change: -50, type: 'spend', date: 'วันนี้' },
    { id: 2, title: 'ภารกิจ Phantom Load Patrol สำเร็จ', change: 50, type: 'earn', date: 'วันนี้' },
    { id: 3, title: 'โบนัสเดินเรียน Chula Forest', change: 25, type: 'earn', date: 'เมื่อวาน' },
  ]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const xpNeededForNextLevel = level * 100;
  
  const addXP = (amount) => {
    let newXp = xp + amount;
    let newLevel = level;
    if (newXp >= xpNeededForNextLevel) {
      newXp = newXp - xpNeededForNextLevel;
      newLevel = level + 1;
      triggerToast(`🎉 LEVEL UP! ตอนนี้คุณก้าวสู่ระดับ ${newLevel} แล้ว!`, 'levelUp');
    }
    setXp(newXp);
    setLevel(newLevel);
  };

  const questsData = {
    daily: [
      { id: 'q_loop', title: 'Loop Breaker', desc: 'คืนกล่องข้าวหมุนเวียนผ่านตู้อัจฉริยะในโรงอาหาร', reward: 15, xp: 30, carbon: 0.5, rarity: 'Common', icon: '🍱' },
      { id: 'q_refill', title: 'Refill Ranger', desc: 'เติมน้ำดื่มที่ตู้กรองอัจฉริยะแทนการซื้อน้ำขวดใหม่', reward: 10, xp: 20, carbon: 0.2, rarity: 'Common', icon: '💧' },
      { id: 'q_shade', title: 'Shade Walker', desc: 'เดินผ่านเส้นทางต้นไม้ร่มรื่น Chula Urban Forest', reward: 25, xp: 40, carbon: 1.2, rarity: 'Rare', icon: '🌳' },
    ],
    classroom: [
      { id: 'q_proj', title: 'Projector Slayer', desc: 'ตรวจเช็คและปิดโปรเจกเตอร์หลังเลิกชั้นเรียน 10 นาที', reward: 40, xp: 60, carbon: 1.8, rarity: 'Epic', icon: '🔌' },
      { id: 'q_reset', title: 'Study Room Reset', desc: 'กดยืนยันการปิดไฟและล็อกห้องหลังใช้ห้องประชุมเสร็จ', reward: 30, xp: 50, carbon: 1.5, rarity: 'Rare', icon: '🚪' },
      { id: 'q_ac', title: 'Quick Cooldown', desc: 'ปรับอุณหภูมิแอร์ขึ้นเป็น 26°C ร่วมกับพัดลมช่วงบ่ายเรียน', reward: 20, xp: 30, carbon: 1.0, rarity: 'Common', icon: '❄️' },
    ],
    lab: [
      { id: 'q_phantom', title: 'Phantom Load Patrol', desc: 'กวาดล้างพลังงานแฝง ดึงปลั๊กอุปกรณ์สแตนบายในแล็บเคมี', reward: 50, xp: 80, carbon: 2.2, rarity: 'Epic', icon: '🕵️‍♂️' },
      { id: 'q_fume', title: 'Fume Hood Master', desc: 'ดึงบานหน้าต่างตู้ควันเคมี (Fume Hood) ลงให้อยู่ในระดับปลอดภัย', reward: 80, xp: 120, carbon: 3.5, rarity: 'Legendary', icon: '🧪' },
      { id: 'q_freezer', title: 'Freezer Guardian', desc: 'จัดระเบียบตู้แช่แข็ง -80°C และปิดประตูตู้ให้สนิทใน 10 วินาที', reward: 35, xp: 55, carbon: 1.7, rarity: 'Rare', icon: '🥶' },
    ],
    weekly: [
      { id: 'q_streak', title: '3-Day Green Streak', desc: 'เลือกใช้เส้นทางเดินทางรักษ์โลกติดต่อกันเป็นเวลา 3 วัน', reward: 120, xp: 200, carbon: 5.0, rarity: 'Legendary', icon: '⚡' },
      { id: 'q_raid', title: 'Faculty Raid: 300 Actions', desc: 'ร่วมมือกับเพื่อนในคณะเคลียร์เควสห้องเรียนรวมครบเป้าหมาย', reward: 150, xp: 250, carbon: 8.0, rarity: 'Epic', icon: '🏰' },
    ],
  };

  const handleCompleteQuest = (quest) => {
    if (completedQuests.includes(quest.id)) return;

    setCompletedQuests([...completedQuests, quest.id]);
    setCoins(prev => prev + quest.reward);
    setCarbonSaved(prev => +(prev + quest.carbon).toFixed(1));
    addXP(quest.xp);
    setStreak(prev => prev + 1);

    const newTx = {
      id: Date.now(),
      title: `ทำเควส ${quest.title} สำเร็จ`,
      change: quest.reward,
      type: 'earn',
      date: 'วันนี้'
    };
    setTransactions([newTx, ...transactions]);

    triggerToast(`🎉 เควสสำเร็จ! รับ +${quest.reward} 🪙 และ +${quest.xp} XP!`);
  };

  const routesData = [
    { id: 'r_walk', title: 'Walk via Chula Forest', desc: 'เดินผ่านพื้นที่ร่มรื่นใต้เงาไม้ใหญ่จามจุรี', time: '8 นาที', dist: '550m', carbon: '0g', coins: 20, isEco: true, color: 'emerald' },
    { id: 'r_bike', title: 'Bike via Green Lane', desc: 'ปั่นจักรยาน CU Bike เลียบทางเฉพาะสีเขียว', time: '3 นาที', dist: '600m', carbon: '4g', coins: 12, isEco: false, color: 'indigo' },
    { id: 'r_pop', title: 'Pop Bus EV (Line 1)', desc: 'นั่งรถป๊อบพลังงานไฟฟ้า EV ประจำเส้นทางหลัก', time: '5 นาที', dist: '1.2km', carbon: '15g', coins: 6, isEco: false, color: 'pink' },
    { id: 'r_car', title: 'วินมอเตอร์ไซค์น้ำมัน', desc: 'เดินทางผ่านเส้นทางถนนวิทยบริการแบบใช้น้ำมัน', time: '2 นาที', dist: '500m', carbon: '180g', coins: 0, isEco: false, color: 'slate' }
  ];

  const handleSelectRoute = (route) => {
    if (chosenRoute) {
      triggerToast("คุณได้จำลองการเดินทางของวันนี้ไปแล้ว!", "info");
      return;
    }

    setChosenRoute(route.id);
    let finalReward = route.coins;
    let textBonus = "";

    if (route.isEco) {
      finalReward += 5;
      textBonus = " + โบนัสความรักษ์โลก 5 🪙!";
      setStreak(prev => prev + 1);
    }

    setCoins(prev => prev + finalReward);
    const carbonDelta = +((180 - parseInt(route.carbon)) / 1000).toFixed(2);
    setCarbonSaved(prev => +(prev + Math.max(0, carbonDelta)).toFixed(2));
    addXP(30);

    const newTx = {
      id: Date.now(),
      title: `เดินทางด้วย ${route.title}`,
      change: finalReward,
      type: 'earn',
      date: 'วันนี้'
    };
    setTransactions([newTx, ...transactions]);

    triggerToast(`🚲 เดินทางสำเร็จ! ได้รับ ${finalReward} 🪙${textBonus}`);
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

    triggerToast(`🎁 แลกสำเร็จ! รหัสสิทธิ์สแกนถูกเก็บลงหน้า Profile แล้ว`, 'success');
  };

  // Helper for backward compatible rounded paths
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

  // Pure native HTML5 Canvas drawing representing image_88f30b.png precisely
  const renderCanvasImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, 600, 680);

    // 1. Draw Card Background with appropriate gradients
    if (storyTheme !== 'transparent') {
      const grad = ctx.createLinearGradient(0, 0, 600, 680);
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
      drawRoundedRect(ctx, 0, 0, 600, 680, 48);
      ctx.fill();
    }

    // 2. Logo CUVERSE (Top-left)
    // Small emerald sphere
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(60, 65, 11, 0, Math.PI * 2);
    ctx.fill();

    // CU Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CU', 80, 65);

    // VERSE Text
    ctx.fillStyle = '#10B981';
    ctx.fillText('VERSE', 115, 65);

    // 3. Streak Pill Badge (Top-right)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundedRect(ctx, 420, 45, 140, 36, 18);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`STREAK: ${streak} DAYS`, 490, 63);

    // 4. Center Metrics Block
    // Spark icon & Subtitle
    ctx.fillStyle = '#f59e0b';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ พลังงานลดโลกร้อนวันนี้', 300, 220);

    // Main Value (Energy kWh)
    const valText = calculateTodayEnergySaved();
    ctx.font = '900 76px sans-serif';
    const valW = ctx.measureText(valText).width;

    ctx.font = '300 30px sans-serif';
    const unitW = ctx.measureText(' kWh').width;

    const startX = 300 - ((valW + unitW) / 2);

    ctx.fillStyle = '#10B981';
    ctx.font = '900 76px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(valText, startX, 310);

    ctx.fillStyle = '#ffffff';
    ctx.font = '300 30px sans-serif';
    ctx.fillText(' kWh', startX + valW, 298);

    // Carbon Savings Detail
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`เทียบเท่าการประหยัดคาร์บอน ${carbonSaved.toFixed(1)} kg`, 300, 365);

    // 5. Badges Panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    drawRoundedRect(ctx, 40, 430, 520, 140, 28);
    ctx.fill();

    const badges = getTodayBadges();
    const colW = 520 / 4;
    badges.forEach((b, idx) => {
      const colX = 40 + (idx * colW) + (colW / 2);

      // Emoji Symbol
      ctx.font = '42px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.emoji, colX, 492);

      // Label Text
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(b.label.toUpperCase(), colX, 532);
    });

    // 6. Footer (Geotag)
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📍 CHULALONGKORN UNIV.', 40, 640);

    ctx.fillStyle = '#10B981';
    ctx.textAlign = 'right';
    ctx.fillText('13.7367° N, 100.5331° E', 560, 640);

    // Convert directly to base64 PNG data URL
    const dataUrl = canvas.toDataURL('image/png');
    setExportedImageUrl(dataUrl);
  };

  useEffect(() => {
    if (isShareModalOpen) {
      renderCanvasImage();
    }
  }, [isShareModalOpen, storyTheme, coins, carbonSaved, completedQuests, chosenRoute, streak]);

  // Reliable native file download
  const handleDownload = () => {
    if (!exportedImageUrl) return;
    try {
      const link = document.createElement('a');
      link.href = exportedImageUrl;
      link.download = `cuverse_story_${storyTheme}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("💾 บันทึกรูปภาพกรีนการ์ดสำเร็จ!");
    } catch (err) {
      console.error(err);
      triggerToast("กรุณาใช้นิ้วแตะค้างที่รูปภาพการ์ดเพื่อกดบันทึกโดยตรงได้เลยครับ", "info");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center min-h-screen bg-slate-950 font-sans p-6 antialiased text-slate-800">
      
      {/* LEFT COLUMN: Project branding and info */}
      <div className="max-w-md text-white space-y-4 px-4 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-3 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Hackathon Prototype v3.0 (RES Engine)
        </div>
        <h2 className="text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
          CU Eco-Verse
        </h2>
      </div>

      {/* RIGHT COLUMN: Mobile simulator container */}
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

        {/* Brand Bar Header */}
        <div className="bg-white border-b border-slate-100 px-4 py-2 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-black tracking-wider text-slate-800">ECO-VERSE</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-bounce" />
            <span>Streak: {streak} วัน</span>
          </div>
        </div>

        {/* Dynamic Toast Render inside Mobile Frame */}
        {toast && (
          <div className="absolute top-12 left-4 right-4 bg-slate-900 text-white text-[10.5px] p-2.5 rounded-xl shadow-lg z-50 flex items-center gap-2 border border-slate-800 animate-bounce">
            <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
            <p className="leading-tight">{toast.message}</p>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENTS */}
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
                    <span>{xp}/{xpNeededForNextLevel} XP</span>
                  </div>
                  <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${(xp / xpNeededForNextLevel) * 100}%` }}></div>
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
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white p-3.5 rounded-2xl border border-emerald-500/25 shadow-md flex items-center justify-between transition-all font-black text-[11px] uppercase tracking-wide group"
              >
                <span className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                  แชร์กรีนการ์ดวันนี้ลง Story อวดเพื่่อน ๆ กัน!
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
                    onClick={() => setActiveTab('quests')}
                    className="w-full bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs flex justify-between items-center text-left hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-lg">🔌</div>
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-800">ปิดโปรเจกเตอร์และเช็คระบบห้องเรียน</h5>
                        <p className="text-[9px] text-slate-500">เคลียร์พลังงานแฝงตึกคณะวิศวกรรมศาสตร์</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('route')}
                    className="w-full bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs flex justify-between items-center text-left hover:bg-slate-50 transition-all"
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
                          {route.id === 'r_walk' ? '👟' : route.id === 'r_bike' ? '🚲' : route.id === 'r_pop' ? '🚌' : '🛵'}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-[11px] font-bold text-slate-800">{route.title}</h4>
                            {route.isEco && (
                              <span className="text-[8px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-extrabold uppercase">
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

                      <div className="text-right shrink-0">
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
                            className={`text-[10px] font-black px-3 py-1.5 rounded-xl transition-all ${
                              route.isEco 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                : 'bg-slate-800 hover:bg-slate-900 text-white'
                            }`}
                          >
                            +{route.coins}🪙
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
                    className={`py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all ${
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
                            <span className="flex items-center gap-0.5 text-emerald-600">
                              🌳 ลดคาร์บอน {quest.carbon} kg
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
                              onClick={() => handleCompleteQuest(quest)}
                              className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors"
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
                    <p className="text-[9px] text-indigo-400">เทียบเท่าสิทธิ์คืนมัดจำ</p>
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
                        className="bg-pink-600 hover:bg-pink-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap"
                      >
                        แลกสิทธิ์
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions list */}
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
                  <Sun className="w-32 h-32 animate-spin-slow text-yellow-300" />
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
                      <p className="text-base font-black text-yellow-300">{vppTradable} kW</p>
                    </div>

                    {vppTraded ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> โหวตแลกสำเร็จแล้ว!
                      </span>
                    ) : (
                      <button 
                        onClick={() => {
                          setVppTraded(true);
                          setCoins(prev => prev + 200);
                          triggerToast("⚡ แปลงโซลาร์ล้นระบบคณะวิศวกรรมศาสตร์เป็นงบกิจกรรมสำเร็จ (+200 Coins)");
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black px-3 py-2 rounded-xl flex items-center gap-1 shadow"
                      >
                        ส่งจ่ายเข้าสโมฯ คณะ (+200🪙)
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Contribution Clean Energy Saved Card */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sun className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">พลังสะอาดที่คุณช่วยลดให้คณะ</h4>
                  <p className="text-base font-black text-slate-800 mt-0.5">
                    {personalEnergySaved} <span className="text-xs font-semibold text-slate-500">kWh สะสม</span>
                  </p>
                </div>
              </div>

              {/* Leaderboard rankings adjusted to use exact formula calculations */}
              <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
                    <Award className="w-4 h-4 text-pink-600 animate-pulse" /> Faculty Leaderboard (RES-Rank)
                  </h4>
                  <span className="text-[9px] text-slate-400 font-semibold">ฤดูกาลที่ 1</span>
                </div>

                <div className="space-y-2.5">
                  {/* Guild Rank 1: Engineering */}
                  {/* Calculation: Saving 24%, Clean Energy 55%, Participation 85% -> RES = 45.5 */}
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
                  {/* Calculation: Saving 18%, Clean Energy 60%, Participation 75% -> RES = 42.0 */}
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
                  {/* Calculation: Saving 15%, Clean Energy 40%, Participation 90% -> RES = 37.5 */}
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

        {/* BOTTOM GLOBAL MOBILE TAB NAVIGATION BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-[64px] bg-white border-t border-slate-200/80 px-4 py-2 flex justify-around items-center rounded-t-2xl shadow-lg z-20 select-none shrink-0">
          
          {/* Tab 1: Home */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'home' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5.5 h-5.5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">หน้าแรก</span>
          </button>

          {/* Tab 2: Map Router */}
          <button 
            onClick={() => setActiveTab('route')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'route' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MapPin className={`w-5.5 h-5.5 ${activeTab === 'route' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">สแกนเส้นทาง</span>
          </button>

          {/* Tab 3: Quests System */}
          <button 
            onClick={() => setActiveTab('quests')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'quests' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Award className={`w-5.5 h-5.5 ${activeTab === 'quests' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">เควส</span>
          </button>

          {/* Tab 4: Wallet & Rewards */}
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'wallet' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Wallet className={`w-5.5 h-5.5 ${activeTab === 'wallet' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">กระเป๋าเงิน</span>
          </button>

          {/* Tab 5: Guild Wars */}
          <button 
            onClick={() => setActiveTab('guild')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'guild' ? 'text-pink-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users className={`w-5.5 h-5.5 ${activeTab === 'guild' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">อันดับคณะ</span>
          </button>

        </div>

      </div>

      {/* STRARVA-STYLE GORGEOUS GREEN IMPACT STORY MODAL OVERLAY */}
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
                className="p-1 text-slate-400 hover:text-white rounded-full bg-slate-800"
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
                    className={`w-5 h-5 rounded-full border ${
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

            {/* REAL NATIVE IMAGE CONTAINER (Direct display of pre-generated PNG url for perfect touch-save compatibility) */}
            <div className="relative flex justify-center items-center w-[328px] h-[370px] mx-auto rounded-[36px] overflow-hidden bg-slate-950/40 border border-slate-800/50">
              {exportedImageUrl ? (
                <img 
                  src={exportedImageUrl} 
                  alt="CUVERSE Eco Story Card" 
                  className="w-full h-full object-contain cursor-pointer pointer-events-auto select-all select-none"
                  title="แตะค้างที่รูปภาพเพื่อบันทึก"
                />
              ) : (
                <div className="text-white text-xs font-medium animate-pulse flex flex-col items-center gap-2">
                  <span className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
                  กำลังสร้างการ์ดรักษ์โลก...
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
                  className="flex-1 bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-black text-[10.5px] flex items-center justify-center gap-1 shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" /> ดาวน์โหลด PNG
                </button>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-4 rounded-xl font-bold text-[10.5px] transition-colors"
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