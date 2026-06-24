import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Award, 
  Wallet, 
  Navigation, 
  Zap, 
  Trash2, 
  Flame, 
  Users, 
  Gift, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  TrendingDown, 
  Sparkles,
  Info,
  Clock,
  ChevronRight,
  ShieldCheck,
  Sun,
  X,
  Droplet
} from 'lucide-react';

export default function App() {
  // Navigation & Sub-Tabs State
  const [activeTab, setActiveTab] = useState('home'); // home, route, quests, wallet, guild
  const [activeQuestTab, setActiveQuestTab] = useState('daily'); // daily, classroom, lab, weekly
  
  // Real-time Player State
  const [coins, setCoins] = useState(1250);
  const [carbonSaved, setCarbonSaved] = useState(42.5); // in kg CO2e
  const [streak, setStreak] = useState(4);
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(3);
  const [chosenRoute, setChosenRoute] = useState(null); // stores selected route ID
  const [completedQuests, setCompletedQuests] = useState([]); // Array of completed quest IDs
  
  // Interactive Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', text: '🚨 ภูตคาร์บอน (Carbon Ghost) ก่อกวน! ตึกวิศวฯ 3 พบการเปิดไฟทิ้งไว้ในวันหยุด!' },
    { id: 2, type: 'rare', text: '🌟 เควส Rare ระดับตำนานเปิดแล้ว: ปิดระบบแล็บชั้น 4 คณะวิทยาศาสตร์' }
  ]);

  // Route Planning State
  const [startPoint, setStartPoint] = useState('eng3');
  const [endPoint, setEndPoint] = useState('library');

  // VPP Trading States
  const [vppTradable, setVppTradable] = useState(120); // kW
  const [vppTraded, setVppTraded] = useState(false);

  // Interactive Toast State
  const [toast, setToast] = useState(null);
  
  // Custom transaction log for Wallet
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'แลกกล่องข้าวหมุนเวียนสำเร็จ', change: -50, type: 'spend', date: 'วันนี้' },
    { id: 2, title: 'ภารกิจ Phantom Load Patrol สำเร็จ', change: 50, type: 'earn', date: 'วันนี้' },
    { id: 3, title: 'โบนัสเดินเรียน Chula Forest', change: 25, type: 'earn', date: 'เมื่อวาน' },
  ]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // XP Progress and Levelling Logic
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

  // Interactive Quest Lists
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

    // Add transaction history
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

  // Route details with rewards and impact calculations
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
      finalReward += 5; // Eco Best Bonus
      textBonus = " + โบนัสความรักษ์โลก 5 🪙!";
      setStreak(prev => prev + 1);
    }

    setCoins(prev => prev + finalReward);
    // Rough estimate of saving compared to motor vehicle (saving ~180g)
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

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center min-h-screen bg-slate-950 font-sans p-6 antialiased text-slate-800">
      
      {/* LEFT COLUMN: Project branding and info */}
      <div className="max-w-md text-white space-y-4 px-4">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-3 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Hackathon Prototype v2.5 (Playable)
        </div>
        <h2 className="text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
          CU Eco-Verse
        </h2>
        <p className="text-sm font-medium text-slate-300 leading-relaxed">
          เปลี่ยนไอเดียด้านระบบประหยัดพลังงานที่ซับซ้อนให้กลายเป็น **"เกม RPG บนโลกจริง"** สะสม Eco-Coins ลดคาร์บอนฟุตพริ้นท์จริงผ่านแอปจำลองบนสมาร์ตโฟนของนิสิตทุกคน
        </p>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
          <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-rose-400">
            💡 แถบเมนูด้านล่างสุดรองรับ:
          </h4>
          <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
            <li><span className="text-pink-400 font-semibold">หน้าแรก</span> - ตรวจเช็คค่าสถานะสะสมและมาสคอต</li>
            <li><span className="text-pink-400 font-semibold">สแกนเส้นทาง</span> - ค้นหาและจำลองแผนที่เดินทาง</li>
            <li><span className="text-pink-400 font-semibold">เควส</span> - หมวดหมู่เควสรายวัน เรียน แล็บ และจำลองการปิดอุปกรณ์</li>
            <li><span className="text-pink-400 font-semibold">กระเป๋าเงิน</span> - กระเป๋าจัดเก็บและแลกของรางวัลจำลอง</li>
            <li><span className="text-pink-400 font-semibold">อันดับคณะ</span> - แสดงตารางกิลด์และระบบซื้อขายไฟ VPP</li>
          </ul>
        </div>
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
                    <h3 className="text-base font-black mt-1">เกียรติศักดิ์ วิศวฯ ปี 1</h3>
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
                    "ยินดีต้อนรับสู่อารยธรรมคาร์บอนต่ำในจุฬาฯ! ลองกดเมนูด้านล่าง เพื่อทำเควสและเดินประหยัดพลังงานกันได้เลยครับ!"
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

              {/* Leaderboard rankings */}
              <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
                    <Users className="w-4 h-4 text-pink-600" /> ตารางคะแนนและกิลด์ระหว่างคณะ (Guilds)
                  </h4>
                  <span className="text-[9px] text-slate-400 font-semibold">ฤดูกาลที่ 1</span>
                </div>

                <div className="space-y-2.5">
                  {/* Guild Rank 1 */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-pink-100 border border-pink-200 text-pink-600 font-black text-xs flex items-center justify-center">
                        👑 1
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-800">วิศวกรรมศาสตร์ (ENG-Guild)</h5>
                        <p className="text-[9px] text-slate-500">
                          พลังงานสะอาดที่ลดได้: <span className="font-bold text-slate-700">2,450 kWh</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-pink-600 block">x1.2 โบนัส</span>
                      <span className="text-[8px] text-slate-400">แชมป์ปิดสวิตช์ห้อง</span>
                    </div>
                  </div>

                  {/* Guild Rank 2 */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 text-slate-700 font-black text-xs flex items-center justify-center">
                        2
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-800">วิทยาศาสตร์ (SCI-Guild)</h5>
                        <p className="text-[9px] text-slate-500">
                          พลังงานสะอาดที่ลดได้: <span className="font-bold text-slate-700">1,980 kWh</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-700 block">x1.1 โบนัส</span>
                      <span className="text-[8px] text-slate-400">แชมป์ดูแลห้องแล็บ</span>
                    </div>
                  </div>

                  {/* Guild Rank 3 */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 text-slate-700 font-black text-xs flex items-center justify-center">
                        3
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-800">สถาปัตยกรรมศาสตร์ (ARC)</h5>
                        <p className="text-[9px] text-slate-500">
                          พลังงานสะอาดที่ลดได้: <span className="font-bold text-slate-700">1,420 kWh</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 block">x1.0 โบนัส</span>
                      <span className="text-[8px] text-slate-400">แชมป์เดินประหยัดไฟ</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-[9px] text-slate-500 leading-normal">
                  💡 <span className="font-extrabold text-slate-700">กติกาการแข่งแบบร่วมมือ:</span> ยิ่งคนในคณะร่วมใจทำเควสและเดินเรียนเยอะขึ้น ตัวคูณ Multiplier ของคณะจะยิ่งสูง ซึ่งจะช่วยเปลี่ยนโซลาร์พลังงานเป็นเหรียญเงินกิจกรรมคณะได้มากขึ้นเท่านั้น!
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

    </div>
  );
}