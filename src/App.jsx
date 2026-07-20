import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Award, 
  Wallet, 
  Gamepad2,
  Navigation, 
  Flame, 
  Users, 
  Gift, 
  Sparkles,
  Info,
  X,
  CheckCircle2,
  Camera,
  Lock,
  Unlock,
  RotateCcw,
  Activity
} from 'lucide-react';

// Synthesizer sounds for interactive retro gaming experience
const playSynthSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'select') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'place') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'blast') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'perfect') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    console.log("Audio contexts blocked or unsupported on device.");
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, route, quests, wallet, game
  const [activeQuestTab, setActiveQuestTab] = useState('daily'); // daily, classroom, lab, weekly
  
  const [coins, setCoins] = useState(1350);
  const [carbonSaved, setCarbonSaved] = useState(48.2); // in kg CO2e
  const [streak, setStreak] = useState(5);
  const [xp, setXp] = useState(160);
  const [level, setLevel] = useState(4);
  const [completedQuests, setCompletedQuests] = useState([]); 

  // Detailed Verification Flow Modal State
  const [verifyingQuest, setVerifyingQuest] = useState(null);
  const [verificationStep, setVerificationStep] = useState(0); // 0: GPS/BLE, 1: Specific Action, 2: Database Sync, 3: Completed
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  
  // Real-time Event Alerts Feed
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', text: '🚨 ภูตคาร์บอนก่อกวน! มีการเปิดเครื่องปรับอากาศค้างไว้ที่ห้องเรียน ENG3-402' },
    { id: 2, type: 'rare', text: '🌟 เควส Rare คณะวิทยาศาสตร์: คลีนตู้แช่แข็งเคมีชีวภาพสะสม 2 เท่า' }
  ]);

  const [startPoint, setStartPoint] = useState('eng3');
  const [endPoint, setEndPoint] = useState('library');
  const [toast, setToast] = useState(null);

  const [transactions, setTransactions] = useState([
    { id: 1, title: 'แลกแก้วน้ำพับได้ CU Green', change: -1200, type: 'spend', date: 'วันนี้' },
    { id: 2, title: 'เควสใช้กล่องข้าวส่วนตัวสำเร็จ', change: 40, type: 'earn', date: 'วันนี้' },
    { id: 3, title: 'เควสแยกขวดรีไซเคิลสำเร็จ', change: 35, type: 'earn', date: 'เมื่อวาน' },
  ]);

  // Mini-game Board State (6x6)
  const [grid, setGrid] = useState(Array(6).fill(null).map(() => Array(6).fill(0)));
  const [score, setScore] = useState(0);
  const [selectedShapeIdx, setSelectedShapeIndex] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const themeList = ['pink', 'emerald', 'violet', 'amber', 'sky'];
  const [activeThemeIdx, setActiveThemeIdx] = useState(0);
  const currentTheme = themeList[activeThemeIdx];

  // Snappy, drag-and-drop live coordinate tracking
  const [draggedShapeIdx, setDraggedShapeIdx] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [startTouchPos, setStartTouchPos] = useState({ x: 0, y: 0 });
  const [hoverCell, setHoverCell] = useState(null); 

  const shapesDatabase = [
    { cells: [[1]] },
    { cells: [[1, 1]] },
    { cells: [[1], [1]] },
    { cells: [[1, 1], [1, 1]] },
    { cells: [[1, 0], [1, 1]] },
    { cells: [[1, 1, 1]] },
    { cells: [[1], [1], [1]] }
  ];

  const generateRandomShapes = () => {
    return Array(3).fill(null).map(() => {
      const randomIdx = Math.floor(Math.random() * shapesDatabase.length);
      return shapesDatabase[randomIdx];
    });
  };

  const [availableShapes, setAvailableShapes] = useState(generateRandomShapes());

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const xpNeededForNextLevel = level * 120;
  
  const addXP = (amount) => {
    let newXp = xp + amount;
    let newLevel = level;
    if (newXp >= xpNeededForNextLevel) {
      newXp = newXp - xpNeededForNextLevel;
      newLevel = level + 1;
      triggerToast(`🎉 เลเวลอัป! เลื่อนเป็นอัศวินคาร์บอนระดับ ${newLevel}!`, 'levelUp');
    }
    setXp(newXp);
    setLevel(newLevel);
  };

  const transitData = [
    { id: 't_walk', title: 'เดินเท้าเรียนทางสีเขียว', desc: 'เดินสัญจรผ่านเส้นทางสวนป่าจามจุรี หรือทางเท้ามีหลังคาบังแดดรอบจุฬาฯ', reward: 30, xp: 40, carbon: 0.8, icon: '🚶‍♂️' },
    { id: 't_bike', title: 'ปั่นจักรยาน CU Bike', desc: 'ปั่นจักรยานสาธารณะแชร์ริ่งเพื่อเชื่อมต่อระหว่างตึกเรียนคณะต่าง ๆ', reward: 40, xp: 50, carbon: 1.1, icon: '🚲' },
    { id: 't_bus', title: 'นั่งรถไฟฟ้า EV Pop Bus', desc: 'โดยสารรถป๊อปไฟฟ้าของมหาวิทยาลัยแทนรถส่วนตัวเพื่อลดคาร์บอนส่วนรวม', reward: 25, xp: 30, carbon: 0.6, icon: '🚌' }
  ];

  const questsData = {
    daily: [
      { id: 'q_bento', title: 'My Bento Pride', desc: 'ใช้กล่องข้าวพกพาและช้อนส้อมของตัวเองในโรงอาหาร แทนกล่องพลาสติกใช้แล้วทิ้ง', reward: 40, xp: 50, carbon: 0.8, rarity: 'Common', icon: '🍱', type: 'bento' },
      { id: 'q_stairs', title: 'Stair Climber', desc: 'เดินใช้บันไดขึ้นลงตึกเรียนและอาคารหลักแทนการใช้ลิฟต์อย่างน้อย 3 ชั้นขึ้นไป', reward: 25, xp: 35, carbon: 0.3, rarity: 'Common', icon: '🪜', type: 'stairs' },
      { id: 'q_sort', title: 'Sorting Champion', desc: 'คัดแยกเศษอาหาร ขยะรีไซเคิล และขยะทั่วไปอย่างถูกต้องที่สถานีแยกขยะประจำคณะ', reward: 35, xp: 45, carbon: 0.6, rarity: 'Rare', icon: '🗑️', type: 'waste' },
    ],
    classroom: [
      { id: 'q_bottle', title: 'Can & Bottle Crusher', desc: 'บดขวดพลาสติก PET และกระป๋องอะลูมิเนียมก่อนหยอดใส่ตู้แยกเพื่อเพิ่มประสิทธิภาพรีไซเคิล', reward: 50, xp: 60, carbon: 1.2, rarity: 'Rare', icon: '🥫', type: 'recycling' },
      { id: 'q_proj', title: 'Projector Slayer', desc: 'ปิดสวิตช์โปรเจกเตอร์และระบบเสียงในห้องเลกเชอร์ทันทีหลังเลิกเรียนเพื่อประหยัดพลังงาน', reward: 40, xp: 50, carbon: 1.5, rarity: 'Epic', icon: '🔌', type: 'electronics' },
      { id: 'q_ac', title: 'Thermostat Guard', desc: 'ปรับอุณหภูมิแอร์ให้อยู่ระดับ 26°C ร่วมกับการเปิดพัดลมเพื่อช่วยลดพีคพลังงาน', reward: 30, xp: 40, carbon: 1.0, rarity: 'Common', icon: '❄️', type: 'electronics' },
    ],
    lab: [
      { id: 'q_phantom', title: 'Phantom Load Patrol', desc: 'ตรวจกวาดล้างและปิดสแตนด์บายปลั๊กเครื่องมือห้องแล็บวิทยาศาสตร์ก่อนสุดสัปดาห์', reward: 60, xp: 80, carbon: 2.5, rarity: 'Epic', icon: '🕵️‍♂️', type: 'electronics' },
      { id: 'q_freezer', title: 'Freezer Fortress', desc: 'ตรวจสอบขอบยางตู้แช่แข็งเคมี -80°C ให้ปิดสนิทและไม่เปิดแช่ทิ้งไว้เกินจำเป็น', reward: 45, xp: 50, carbon: 1.8, rarity: 'Rare', icon: '🥶', type: 'electronics' },
    ],
    weekly: [
      { id: 'q_streak', title: '5-Day Eco Streak', desc: 'เดินทางด้วย CU Bike หรือเดินเรียนติดต่อกันครบ 5 วันในสัปดาห์การเรียนนี้', reward: 150, xp: 200, carbon: 5.5, rarity: 'Legendary', icon: '⚡', type: 'transit' },
    ],
  };

  const handleInitiateQuestVerification = (quest) => {
    if (completedQuests.includes(quest.id)) return;
    playSynthSound('select');
    setVerifyingQuest(quest);
    setVerificationStep(0);
    setPhotoCaptured(false);
    setAiAnalyzing(false);
  };

  const handleNextVerificationStep = () => {
    playSynthSound('select');
    if (verificationStep === 0) {
      setVerificationStep(1);
    } else if (verificationStep === 1) {
      if (verifyingQuest.type === 'waste' || verifyingQuest.type === 'recycling' || verifyingQuest.type === 'bento') {
        setPhotoCaptured(true);
        setAiAnalyzing(true);
        setTimeout(() => {
          setAiAnalyzing(false);
          setVerificationStep(2);
          playSynthSound('select');
        }, 1500);
      } else {
        setVerificationStep(2);
      }
    } else if (verificationStep === 2) {
      setVerificationStep(3);
      executeQuestCompletion(verifyingQuest);
    }
  };

  const executeQuestCompletion = (quest) => {
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
    playSynthSound('perfect');
  };

  // Anti-inflation premium rewards list
  const rewardsList = [
    { id: 'reward_cup', title: 'คูปองเครื่องดื่มฟรี CU Cafe', cost: 1800, desc: 'แลกเครื่องดื่มออร์แกนิกฟรี 1 แก้ว ณ โรงอาหารกลางเพื่อช่วยสนับสนุนการใช้แก้วส่วนตัว', icon: '☕' },
    { id: 'reward_ev', title: 'EV Motor Pass ฟรีช่วงพีค', cost: 950, desc: 'รับสิทธิ์ใช้บริการชาร์จมอเตอร์ไซค์ไฟฟ้าและสแกน CU Bike พรีเมียม ฟรี 5 ครั้ง', icon: '🔌' },
    { id: 'reward_gened', title: 'Gen-Ed Course Fast Pass', cost: 6500, desc: 'สิทธิ์ลงทะเบียนล่วงหน้าวิชาหมวดศึกษาทั่วไปยอดนิยมวิชาสิ่งแวดล้อมที่จำกัดที่นั่ง', icon: '🎓' },
    { id: 'reward_ticket', title: 'ตั๋วชมภาพยนตร์เครือ SF / Major Eco-Seat', cost: 5800, desc: 'บัตรชมภาพยนตร์ฟรี 1 ใบ สนับสนุนโครงการปลูกป่าลดคาร์บอนของโรงภาพยนตร์', icon: '🎬' }
  ];

  const handleRedeem = (reward) => {
    if (coins < reward.cost) {
      triggerToast("ยอดเหรียญสะสมไม่เพียงพอ ต้องเคลียร์เควสเพิ่มเติมก่อนแลกครับ!", "error");
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

    triggerToast(`🎁 แลกสำเร็จ! บันทึกคิวอาร์โค้ดลงหน้ากระเป๋าของคุณแล้ว`, 'success');
  };

  const handlePointerDown = (e, index) => {
    playSynthSound('select');
    setDraggedShapeIdx(index);
    setSelectedShapeIndex(index);
    setStartTouchPos({
      x: e.clientX,
      y: e.clientY
    });
    setDragPos({ x: 0, y: 0 });
  };

  const handlePointerMove = (e) => {
    if (draggedShapeIdx === null) return;
    
    // Fluid and highly responsive 3D offset mapping
    const dx = e.clientX - startTouchPos.x;
    const dy = e.clientY - startTouchPos.y;
    setDragPos({ x: dx, y: dy });

    const gridEl = document.getElementById("game-grid-board");
    if (!gridEl) return;

    const gridRect = gridEl.getBoundingClientRect();
    const relX = e.clientX - gridRect.left;
    const relY = e.clientY - gridRect.top;

    const cellWidth = gridRect.width / 6;
    const cellHeight = gridRect.height / 6;

    const c = Math.floor(relX / cellWidth);
    const r = Math.floor(relY / cellHeight);

    if (r >= 0 && r < 6 && c >= 0 && c < 6) {
      setHoverCell({ r, c });
    } else {
      setHoverCell(null);
    }
  };

  const handlePointerUp = () => {
    if (draggedShapeIdx === null) return;

    if (hoverCell) {
      attemptBlockPlacement(hoverCell.r, hoverCell.c, draggedShapeIdx);
    }

    setDraggedShapeIdx(null);
    setHoverCell(null);
    setDragPos({ x: 0, y: 0 });
  };

  const attemptBlockPlacement = (r, c, shapeIdx) => {
    const selectedShape = availableShapes[shapeIdx];
    if (!selectedShape) return;

    const shapeRows = selectedShape.cells.length;
    const shapeCols = selectedShape.cells[0].length;

    if (r + shapeRows > 6 || c + shapeCols > 6) {
      triggerToast("อย่าวางบล็อกออกนอกพื้นที่กระดานครับ!", "error");
      return;
    }

    let fits = true;
    for (let sR = 0; sR < shapeRows; sR++) {
      for (let sC = 0; sC < shapeCols; sC++) {
        if (selectedShape.cells[sR][sC] === 1) {
          if (grid[r + sR][c + sC] === 1) {
            fits = false;
          }
        }
      }
    }

    if (!fits) {
      triggerToast("จุดนี้มีพลังงานบล็อกอื่นบดบังอยู่แล้ว!", "error");
      return;
    }

    const newGrid = grid.map(row => [...row]);
    for (let sR = 0; sR < shapeRows; sR++) {
      for (let sC = 0; sC < shapeCols; sC++) {
        if (selectedShape.cells[sR][sC] === 1) {
          newGrid[r + sR][c + sC] = 1;
        }
      }
    }

    playSynthSound('place');

    const newAvailableShapes = [...availableShapes];
    newAvailableShapes[shapeIdx] = null;

    let rowsToClear = [];
    let colsToClear = [];

    for (let i = 0; i < 6; i++) {
      if (newGrid[i].every(val => val === 1)) rowsToClear.push(i);
    }

    for (let j = 0; j < 6; j++) {
      let isColFull = true;
      for (let i = 0; i < 6; i++) {
        if (newGrid[i][j] !== 1) {
          isColFull = false;
          break;
        }
      }
      if (isColFull) colsToClear.push(j);
    }

    const clearedCount = rowsToClear.length + colsToClear.length;
    if (clearedCount > 0) {
      playSynthSound('blast');
      rowsToClear.forEach(rowIdx => {
        for (let j = 0; j < 6; j++) newGrid[rowIdx][j] = 0;
      });
      colsToClear.forEach(colIdx => {
        for (let i = 0; i < 6; i++) newGrid[i][colIdx] = 0;
      });
    }

    let isFullyEmpty = true;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (newGrid[i][j] === 1) {
          isFullyEmpty = false;
          break;
        }
      }
    }

    let extraPerfectBonus = 0;
    if (isFullyEmpty) {
      playSynthSound('perfect');
      extraPerfectBonus = 1000;
      setActiveThemeIdx((prev) => (prev + 1) % themeList.length);
      triggerToast("🌟 PERFECT WIPE! เคลียร์กระดานหมดจด! เปลี่ยนธีมบล็อกเรืองแสงใหม่!", "success");
    }

    const blocksPlacedCount = selectedShape.cells.flat().filter(x => x === 1).length;
    const roundScore = (blocksPlacedCount * 15) + (clearedCount * 200) + extraPerfectBonus;
    setScore(prev => prev + roundScore);

    setGrid(newGrid);
    setSelectedShapeIndex(null);

    if (newAvailableShapes.every(shape => shape === null)) {
      setAvailableShapes(generateRandomShapes());
    } else {
      setAvailableShapes(newAvailableShapes);
    }

    let possibleMoveFound = false;
    newAvailableShapes.forEach((shape) => {
      if (shape === null) return;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          if (testFit(newGrid, shape, i, j)) {
            possibleMoveFound = true;
          }
        }
      }
    });

    if (newAvailableShapes.every(shape => shape === null)) {
      possibleMoveFound = true;
    }

    if (!possibleMoveFound) {
      setIsGameOver(true);
      playSynthSound('gameover');
    }
  };

  const testFit = (currentGrid, shape, row, col) => {
    const sRows = shape.cells.length;
    const sCols = shape.cells[0].length;
    if (row + sRows > 6 || col + sCols > 6) return false;

    for (let r = 0; r < sRows; r++) {
      for (let c = 0; c < sCols; c++) {
        if (shape.cells[r][c] === 1 && currentGrid[row + r][col + c] === 1) {
          return false;
        }
      }
    }
    return true;
  };

  const handleResetGame = () => {
    setGrid(Array(6).fill(null).map(() => Array(6).fill(0)));
    setScore(0);
    setAvailableShapes(generateRandomShapes());
    setSelectedShapeIndex(null);
    setIsGameOver(false);
    triggerToast("กระดานรีเซ็ตแล้ว ลุยความสนุกสีเขียวกันต่อ!");
  };

  const isEligibleToConvert = completedQuests.length >= 3;
  const conversionRate = 10000;

  const handleConvertScoreToCoins = () => {
    if (!isEligibleToConvert) {
      triggerToast("🔒 ต้องพิชิตภารกิจใดก็ได้ให้ครบ 3 เควสก่อน จึงจะปลดล็อคการแลกคะแนนครับ!", "error");
      return;
    }

    if (score < conversionRate) {
      triggerToast(`ต้องการคะแนนสะสมอย่างน้อย ${conversionRate.toLocaleString()} แต้มเพื่อแลก 1 Eco-Coin!`, "info");
      return;
    }

    const earnedCoins = Math.floor(score / conversionRate);
    const scoreDeducted = earnedCoins * conversionRate;

    setCoins(prev => prev + earnedCoins);
    setScore(prev => prev - scoreDeducted);

    const newTx = {
      id: Date.now(),
      title: `แปลงแต้ม Block Blast เป็น Eco-Coins`,
      change: earnedCoins,
      type: 'earn',
      date: 'วันนี้'
    };
    setTransactions([newTx, ...transactions]);

    triggerToast(`🎉 แปลงคะแนนสำเร็จ! คุณได้รับ +${earnedCoins} 🪙 หมุนเวียนสู่กระเป๋า!`);
  };

  const getThemeBlockClass = (activeTh) => {
    switch (activeTh) {
      case 'pink': return 'from-pink-500 to-rose-600 border-pink-400 text-pink-500 shadow-pink-500/30';
      case 'emerald': return 'from-emerald-400 to-teal-600 border-emerald-300 text-emerald-400 shadow-emerald-500/30';
      case 'violet': return 'from-violet-500 to-fuchsia-600 border-violet-400 text-violet-500 shadow-violet-500/30';
      case 'amber': return 'from-amber-400 to-orange-500 border-amber-300 text-amber-500 shadow-amber-500/30';
      case 'sky': return 'from-sky-400 to-indigo-600 border-sky-300 text-sky-400 shadow-sky-500/30';
      default: return 'from-pink-500 to-rose-600 border-pink-400 text-pink-500';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center min-h-screen bg-slate-950 font-sans p-6 antialiased text-slate-800" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      
      {/* LEFT COLUMN: Project branding and info */}
      <div className="max-w-md text-white space-y-5 px-4">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-3 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> เวอร์ชันอัปเดตระบบตรวจสอบ &amp; ความคุ้มค่ารางวัล
        </div>
        <h2 className="text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
          CU Eco-Verse 🌳
        </h2>
        <p className="text-sm font-medium text-slate-300 leading-relaxed">
          เปลี่ยนพฤติกรรมอนุรักษ์สิ่งแวดล้อมให้เป็นกลไกเกมแสนสนุก โดยผสานฐานข้อมูลจริงผ่านระบบ **CUBEMS** พร้อมมินิเกมลากวางบล็อกที่มีฟิสิกส์การลากลื่นไหลยิ่งขึ้น!
        </p>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs leading-relaxed">
          <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-rose-400">
            📌 ฟังก์ชันเด่นในรุ่นนี้:
          </h4>
          <ul className="space-y-2 text-slate-400 list-disc list-inside">
            <li><span className="text-pink-400 font-semibold">ระบบตรวจสอบตามความเป็นจริง:</span> แต่ละเควสมีด่านพิกัด GPS, การถ่ายภาพสแกน AI และขั้นตอนซิงก์ CUBEMS ต่างกันชัดเจน</li>
            <li><span className="text-pink-400 font-semibold">ต้านทานระบบเงินเฟ้อ:</span> ปรับเปลี่ยนค่าสิทธิประโยชน์แลกของรางวัลในสโมสรจุฬาฯ ให้สูงและสมมาตรยิ่งขึ้น</li>
            <li><span className="text-pink-400 font-semibold">เควสสีเขียวใหม่ครบครัน:</span> ทั้งเดินแทนลิฟต์ คัดแยกขยะเศษอาหาร และรีไซเคิลขวด PET / กระป๋อง</li>
            <li><span className="text-pink-400 font-semibold">ลากวางบล็อกฟิสิกส์ลื่นไหล:</span> สัมผัสความฝืดลดลง ลื่นไหลตามติดปลายนิ้วแบบเรียลไทม์ และเปลี่ยนเฉดสีเมื่อล้างกระดานสำเร็จ</li>
          </ul>
        </div>
      </div>

      {/* RIGHT COLUMN: Mobile simulator container */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col shrink-0">
        
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
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
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
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="leading-tight">{toast.message}</p>
          </div>
        )}

        {/* INTERACTIVE STEP-BY-STEP VERIFICATION MODAL WITH QUEST-SPECIFIC LOGIC */}
        {verifyingQuest && (
          <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-3xl p-5 w-full max-w-[320px] space-y-4 border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full">
                  ด่านพิสูจน์ตามกิจกรรมจริง
                </span>
                <button onClick={() => setVerifyingQuest(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-black text-white">{verifyingQuest.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">{verifyingQuest.desc}</p>
              </div>

              {/* Unique Progress Steps based on Quest Category */}
              <div className="space-y-2.5 bg-black/40 p-3 rounded-2xl text-[11px]">
                
                {/* STEP 1: Specific Geolocation / Physical Beacon Handshake */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    {verifyingQuest.type === 'bento' && '1. เชื่อมสัญญาณ Canteen Beacon'}
                    {verifyingQuest.type === 'stairs' && '1. เช็คชั้นตึกเรียนด้วย GPS &amp; Altimeter'}
                    {verifyingQuest.type === 'waste' && '1. ระบุพิกัดสถานีคัดแยกขยะ'}
                    {verifyingQuest.type === 'recycling' && '1. ตรวจสอบพิกัดตู้ขวด PET อัจฉริยะ'}
                    {verifyingQuest.type === 'electronics' && '1. สแกน NFC ประจำห้องเรียน/ห้องแล็บ'}
                    {verifyingQuest.type === 'transit' && '1. เชื่อมต่อตัววัดความเร็ว CU Transit'}
                    {!verifyingQuest.type && '1. ตรวจสอบ Beacon &amp; GPS'}
                  </span>
                  {verificationStep >= 1 ? (
                    <span className="text-emerald-400 font-bold">✓ ตรวจพบ</span>
                  ) : (
                    <span className="text-slate-500 animate-pulse">กำลังตรวจ...</span>
                  )}
                </div>

                {/* STEP 2: Real Action Verification / Pedometer Sync / AI Camera Analysis */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    {verifyingQuest.type === 'bento' && '2. ถ่ายรูปกล่องข้าวส่วนตัว (AI ตรวจ)'}
                    {verifyingQuest.type === 'stairs' && '2. ตรวจสอบก้าวเดินผ่านเซนเซอร์ (3 ชั้น)'}
                    {verifyingQuest.type === 'waste' && '2. ถ่ายรูปวิเคราะห์ประเภทเศษอาหาร'}
                    {verifyingQuest.type === 'recycling' && '2. สแกนบาร์โค้ดข้างขวด/กระป๋อง'}
                    {verifyingQuest.type === 'electronics' && '2. ถ่ายสแกนสวิตช์เครื่องใช้ไฟฟ้า'}
                    {verifyingQuest.type === 'transit' && '2. ยืนยันพิกัดความต่างระยะสัญจร'}
                    {!verifyingQuest.type && '2. บันทึกภาพความเรียบร้อย'}
                  </span>
                  {aiAnalyzing ? (
                    <span className="text-amber-400 animate-pulse font-bold">กำลังสแกน AI...</span>
                  ) : photoCaptured ? (
                    <span className="text-emerald-400 font-bold">✓ สำเร็จ</span>
                  ) : verificationStep >= 1 ? (
                    <span className="text-pink-400 font-bold animate-pulse">📸 รอถ่ายรูป/ซิงก์</span>
                  ) : (
                    <span className="text-slate-600">รอดำเนินการ</span>
                  )}
                </div>

                {/* STEP 3: Real CUBEMS integration / Smart Bin Telemetry handshake */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    {verifyingQuest.type === 'electronics' && '3. บันทึก Drop-load ลงระบบ CUBEMS'}
                    {verifyingQuest.type === 'recycling' && '3. บันทึกผลน้ำหนักลงตู้รีไซเคิล'}
                    {verifyingQuest.type === 'bento' && '3. ลดพลาสติกสะสมลงฐานข้อมูลกลาง'}
                    {verifyingQuest.type === 'stairs' && '3. แปลงแคลอรี่สะสมของคณะ'}
                    {verifyingQuest.type === 'waste' && '3. บันทึกน้ำหนักเศษขยะเปียก'}
                    {verifyingQuest.type === 'transit' && '3. เชื่อม telemetry คาร์บอนต่ำ'}
                    {!verifyingQuest.type && '3. ซิงก์พลังงานระบบ CUBEMS'}
                  </span>
                  {verificationStep >= 3 ? (
                    <span className="text-emerald-400 font-bold">✓ ดึงข้อมูลสำเร็จ</span>
                  ) : verificationStep >= 2 ? (
                    <span className="text-emerald-400 animate-pulse font-semibold">กำลังเชื่อมฐานข้อมูล...</span>
                  ) : (
                    <span className="text-slate-600">รอดำเนินการ</span>
                  )}
                </div>
              </div>

              {/* Dynamic Interactive button for steps */}
              {verificationStep < 3 ? (
                <button 
                  onClick={handleNextVerificationStep}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  {verificationStep === 0 && <>ถัดไป: เช็คพิกัด Beacon</>}
                  {verificationStep === 1 && (
                    <>
                      {['bento', 'waste', 'recycling', 'electronics'].includes(verifyingQuest.type) ? (
                        <><Camera className="w-4 h-4" /> แตะเพื่อวิเคราะห์ภาพถ่าย (AI)</>
                      ) : (
                        <><Activity className="w-4 h-4" /> ซิงก์ข้อมูล Health Sensor โทรศัพท์</>
                      )}
                    </>
                  )}
                  {verificationStep === 2 && <>อัปโหลดเพื่อบันทึกประวัติลง CUBEMS</>}
                </button>
              ) : (
                <div className="text-center py-2 space-y-2">
                  <p className="text-emerald-400 font-bold text-xs">🎉 ยืนยันเสร็จสมบูรณ์ 100%!</p>
                  <button 
                    onClick={() => setVerifyingQuest(null)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-semibold"
                  >
                    ปิดหน้าต่างนี้
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENTS */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative pb-16">
          
          {/* TAB 1: HOME PAGE WITH LEADERBOARD INTEGRATED */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              {/* Premium Carbon Hero Profile Card */}
              <div className="bg-gradient-to-br from-indigo-600 via-rose-600 to-indigo-700 rounded-3xl p-4 text-white shadow-lg relative overflow-hidden">
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
                    <p className="text-[10px] text-indigo-200">Carbon Guard</p>
                    <p className="text-sm font-black text-white">Level {level}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-indigo-100">
                    <span>ค่าประสบการณ์ (XP)</span>
                    <span>{xp}/{xpNeededForNextLevel} XP</span>
                  </div>
                  <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${(xp / xpNeededForNextLevel) * 100}%` }}></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <p className="text-[9px] text-indigo-100">กระเป๋า Eco-Coins</p>
                    <p className="text-base font-black mt-0.5 flex items-center gap-1 text-yellow-300">
                      {coins.toLocaleString()} <span className="text-[10px] bg-white/20 text-white px-1 py-0.2 rounded">🪙</span>
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <p className="text-[9px] text-indigo-100">คาร์บอนที่ลดสะสม</p>
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
                    &quot;พิชิต 3 เควสเพื่อปลดล็อกการแลกรางวัลเหรียญทองในมินิเกมวันนี้กันเถอะครับ!&quot;
                  </p>
                </div>
              </div>

              {/* STATS PROGRESS OF COMPLETED QUESTS FOR GAME ELIGIBILITY */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10.5px] font-extrabold text-slate-700 flex items-center gap-1">
                    🎯 เควสเพื่อปลดล็อคเกมและรางวัลคอยน์วันนี้
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    isEligibleToConvert ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-50 text-pink-600'
                  }`}>
                    {completedQuests.length}/3 เควส
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((completedQuests.length / 3) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[9.5px] text-slate-500 leading-normal flex items-center gap-1">
                  {isEligibleToConvert 
                    ? "✨ ปลดล็อกสิทธิ์แล้ว! คุณสามารถแปลงแต้มเกม Block Blast เป็น Coins วันนี้ได้สำเร็จ!" 
                    : "🔒 ยังไม่ได้รับสิทธิ์แลกแต้มมินิเกม (ทำภารกิจให้ครบ 3 ก่อนครับ)"}
                </p>
              </div>

              {/* FACULTY LEADERBOARD (RES-Rank) - HIGHLY VISIBLE ON HOME TAB */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
                    <Users className="w-4 h-4 text-indigo-600" /> อันดับคณะและการมีส่วนร่วม (RES-Rank)
                  </h4>
                  <span className="text-[9px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">ซีซั่น 1</span>
                </div>

                <div className="space-y-2">
                  {/* Rank 1 */}
                  <div className="bg-gradient-to-r from-pink-50 to-indigo-50 border border-pink-100 rounded-xl p-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-pink-100 border border-pink-200 text-pink-600 font-black text-[10px] flex items-center justify-center">
                        👑 1
                      </div>
                      <div>
                        <h5 className="text-[10.5px] font-bold text-slate-800">วิศวกรรมศาสตร์ (ENG)</h5>
                        <p className="text-[8.5px] text-slate-500">
                          ลดคาร์บอนแล้ว: <span className="font-bold text-slate-700">2,450 kg CO2e</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9.5px] font-black text-pink-600 block">45.5 RES</span>
                      <span className="text-[8px] bg-white px-1.5 py-0.2 text-pink-500 rounded border border-pink-200 font-semibold">แชมป์พลังงาน</span>
                    </div>
                  </div>

                  {/* Rank 2 */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 text-slate-700 font-black text-[10px] flex items-center justify-center">
                        2
                      </div>
                      <div>
                        <h5 className="text-[10.5px] font-bold text-slate-800">วิทยาศาสตร์ (SCI)</h5>
                        <p className="text-[8.5px] text-slate-500">
                          ลดคาร์บอนแล้ว: <span className="font-bold text-slate-700">1,980 kg CO2e</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9.5px] font-bold text-slate-700 block">42.0 RES</span>
                      <span className="text-[8px] text-slate-400">กิลด์แล็บเคมี</span>
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 text-slate-700 font-black text-[10px] flex items-center justify-center">
                        3
                      </div>
                      <div>
                        <h5 className="text-[10.5px] font-bold text-slate-800">สถาปัตยกรรมศาสตร์ (ARC)</h5>
                        <p className="text-[8.5px] text-slate-500">
                          ลดคาร์บอนแล้ว: <span className="font-bold text-slate-700">1,420 kg CO2e</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9.5px] font-bold text-slate-500 block">38.5 RES</span>
                      <span className="text-[8px] text-slate-400">สายเดินเรียน</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ROUTE NAVIGATION (TRANSIT ONLY) */}
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
                      onChange={(e) => setStartPoint(e.target.value)}
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
                      onChange={(e) => setEndPoint(e.target.value)}
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px] font-bold"
                    >
                      <option value="library">หอสมุดกลางจุฬาฯ</option>
                      <option value="coop">โรงอาหารศาลาพระเกี้ยว</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Simplified Map representation */}
              <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 relative h-[160px] overflow-hidden shadow-inner">
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
                  </g>

                  <g transform="translate(280, 120)">
                    <circle r="8" fill="#10B981" />
                    <circle r="4" fill="#fff" />
                  </g>
                </svg>
              </div>

              {/* Transit Options cards */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">วิธีเดินทางยอดนิยมที่แนะนำ:</p>
                {transitData.map(transit => {
                  return (
                    <div 
                      key={transit.id}
                      className="bg-white rounded-2xl p-3 border border-slate-100 hover:border-slate-200 shadow-xs flex justify-between items-center transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold text-lg bg-emerald-50 text-emerald-700 shrink-0">
                          {transit.icon}
                        </div>

                        <div>
                          <h4 className="text-[11px] font-bold text-slate-800">{transit.title}</h4>
                          <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{transit.desc}</p>
                          <div className="flex gap-2.5 mt-1.5 text-[8.5px] font-bold text-slate-400">
                            <span className="text-emerald-600">🌳 ลด {transit.carbon} kg</span>
                            <span className="text-pink-600">⚡ +{transit.xp} XP</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleInitiateQuestVerification({ ...transit, type: 'transit' })}
                        className="text-[10px] font-black px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 transition-all active:scale-95"
                      >
                        +{transit.reward}🪙
                      </button>
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
                              🌳 {quest.carbon} kg
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
                              onClick={() => handleInitiateQuestVerification(quest)}
                              className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95"
                            >
                              ทำเควส
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

          {/* TAB 4: WALLET & BALANCED ECO-COIN SHOP */}
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
                    <p className="text-[9px] text-indigo-400">เทียบเท่ามูลค่าสิ่งแวดล้อม</p>
                    <p className="font-bold text-white">{ (coins / 10).toFixed(0) } บาท</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-indigo-400">ระดับเครดิตคาร์บอน</p>
                    <p className="font-bold text-emerald-400">Class-A Carbon Saver</p>
                  </div>
                </div>
              </div>

              {/* Symmetrical Rewards Grid Layout */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-pink-600" /> ของรางวัลในรั้วมหาวิทยาลัย
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {rewardsList.map((reward) => (
                    <div 
                      key={reward.id}
                      className="bg-white rounded-2xl p-3.5 border border-slate-200/60 shadow-xs flex flex-col justify-between h-[180px] hover:border-indigo-200 transition-all"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-2xl">{reward.icon}</span>
                          <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">คุ้มค่าสูง</span>
                        </div>
                        <h5 className="text-[11px] font-black text-slate-800 mt-2 line-clamp-1">{reward.title}</h5>
                        <p className="text-[9px] text-slate-400 leading-tight mt-1 line-clamp-2">{reward.desc}</p>
                      </div>

                      <div className="space-y-2 mt-3">
                        <p className="text-[9.5px] text-pink-600 font-extrabold text-center">{reward.cost} 🪙</p>
                        <button 
                          onClick={() => handleRedeem(reward)}
                          className="w-full bg-pink-600 hover:bg-pink-700 text-white text-[10px] font-bold py-1.5 rounded-xl transition-all active:scale-95"
                        >
                          แลกสิทธิ์
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions list */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">ประวัติการทำความดีและแลกของ</h4>
                
                <div className="space-y-1.5">
                  {transactions.slice(0, 4).map((tx) => (
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

          {/* TAB 5: MINIGAME BLOCK BLAST WITH LAG-FREE FLOATING PHYSICS */}
          {activeTab === 'game' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              {/* Score panel with synergy display */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-4 border border-indigo-500/25 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Gamepad2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> ECO BLOCK BLAST
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    🎨 ธีม: <span className="uppercase font-black text-white">{currentTheme}</span>
                  </span>
                </div>

                {/* Highly Visible, Symmetrical Neon Score Counter */}
                <div className="text-center py-3 my-2 bg-black/40 rounded-2xl border border-indigo-500/20 shadow-inner">
                  <p className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest">คะแนนสะสมบลาสต์ปัจจุบัน</p>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 tracking-tight mt-1">
                    {score.toLocaleString()}
                  </p>
                </div>

                {/* Score to Coin Conversion panel */}
                <div className="mt-4 pt-3 border-t border-indigo-800/80 flex items-center justify-between">
                  <div className="flex-1 pr-3">
                    <p className="text-[8.5px] text-indigo-300">อัตราแปลงพิกเซลความดีของคุณ</p>
                    <p className="text-[10.5px] font-bold text-white flex items-center gap-1 mt-0.5">
                      <span className="text-emerald-400 font-black">10,000 คะแนน</span> = 1 🪙
                    </p>
                    <p className="text-[8.5px] text-slate-400 mt-1 flex items-center gap-1">
                      {isEligibleToConvert ? (
                        <span className="text-emerald-400 font-semibold">✓ สำเร็จเควสครบ 3 สิทธิ์พร้อมแลก!</span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1 font-bold">
                          <Lock className="w-3 h-3" /> พิชิตให้ครบ 3 เควสก่อนวันนี้ (ทำแล้ว {completedQuests.length}/3)
                        </span>
                      )}
                    </p>
                  </div>

                  <button 
                    onClick={handleConvertScoreToCoins}
                    disabled={!isEligibleToConvert}
                    className={`text-[10.5px] font-black px-3.5 py-2 rounded-xl shadow transition-all flex items-center gap-1.5 ${
                      isEligibleToConvert 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold shadow-lg animate-bounce active:scale-95' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {isEligibleToConvert ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} แลกเหรียญ
                  </button>
                </div>
              </div>

              {/* Main Game Grid (6x6 Grid Block Blast) */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="bg-slate-900 p-3 rounded-2xl border-4 border-slate-800 shadow-xl max-w-full">
                  <div id="game-grid-board" className="grid grid-cols-6 gap-1.5 w-[260px] h-[260px] relative">
                    {grid.map((row, rIdx) => 
                      row.map((cell, cIdx) => {
                        let isHovered = false;
                        if (draggedShapeIdx !== null && hoverCell) {
                          const activeShape = availableShapes[draggedShapeIdx];
                          if (activeShape) {
                            const sRows = activeShape.cells.length;
                            const sCols = activeShape.cells[0].length;
                            const dR = rIdx - hoverCell.r;
                            const dC = cIdx - hoverCell.c;
                            if (dR >= 0 && dR < sRows && dC >= 0 && dC < sCols) {
                              if (activeShape.cells[dR][dC] === 1) {
                                isHovered = true;
                              }
                            }
                          }
                        }

                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className={`w-full h-full rounded-md transition-all relative overflow-hidden flex items-center justify-center ${
                              cell === 1 
                                ? `bg-gradient-to-br ${getThemeBlockClass(currentTheme)} shadow-md border` 
                                : isHovered
                                ? 'bg-indigo-500/20 border border-indigo-400/50 animate-pulse'
                                : 'bg-slate-800 border border-slate-950/40'
                            }`}
                          >
                            {cell === 1 && (
                              <span className="absolute inset-0 bg-white/10 rounded-md"></span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* GAME OVER CARD OVERLAY */}
                {isGameOver && (
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-center space-y-2 max-w-xs animate-bounce">
                    <p className="text-xs font-bold text-rose-800">👾 ไม่มีช่องว่างเหลือสำหรับบล็อกถัดไป!</p>
                    <button 
                      onClick={handleResetGame}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-4 py-1.5 rounded-xl shadow-xs transition-all"
                    >
                      เริ่มกระดานใหม่
                    </button>
                  </div>
                )}

                {/* Snappy drag-and-drop info tag */}
                {draggedShapeIdx !== null && (
                  <div className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-800/30">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                    ปล่อยเพื่อวางบล็อกบนกระดานด้านบน
                  </div>
                )}

                {/* Handheld shapes generator deck (Clean layout - NO LABELS) */}
                <div className="w-full space-y-2">
                  <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-wider">
                    ลากบล็อกสีเขียวไปจัดเรียงพิกัดด้านบน 🧩
                  </p>

                  <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-2xl border border-slate-200/80">
                    {availableShapes.map((shape, shapeIdx) => {
                      if (shape === null) {
                        return (
                          <div 
                            key={shapeIdx} 
                            className="h-20 flex items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-300 text-[10px]"
                          >
                            วางแล้ว
                          </div>
                        );
                      }

                      const isSelected = selectedShapeIdx === shapeIdx;
                      return (
                        <div
                          key={shapeIdx}
                          onPointerDown={(e) => handlePointerDown(e, shapeIdx)}
                          className={`p-2 rounded-xl border-2 transition-transform duration-75 flex flex-col items-center justify-center h-20 cursor-grab active:cursor-grabbing touch-none select-none ${
                            isSelected 
                              ? 'border-indigo-500 bg-indigo-50/10 scale-105 shadow-md' 
                              : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                          style={{
                            transform: draggedShapeIdx === shapeIdx 
                              ? `translate3d(${dragPos.x}px, ${dragPos.y}px, 0px) scale(1.15)` 
                              : 'none',
                            zIndex: draggedShapeIdx === shapeIdx ? 50 : 1,
                            pointerEvents: 'auto'
                          }}
                        >
                          {/* Visual render of the available mini tetromino shape with no title labels */}
                          <div className="flex flex-col gap-0.5 justify-center items-center pointer-events-none">
                            {shape.cells.map((row, r) => (
                              <div key={r} className="flex gap-0.5">
                                {row.map((cell, c) => (
                                  <div 
                                    key={c} 
                                    className={`w-2.5 h-2.5 rounded-xs ${
                                      cell === 1 
                                        ? `bg-gradient-to-br ${getThemeBlockClass(currentTheme)}` 
                                        : 'bg-transparent'
                                    }`}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reset button deck */}
                <div className="flex justify-center w-full">
                  <button 
                    onClick={handleResetGame}
                    className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ตคะแนนเกมใหม่
                  </button>
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
              activeTab === 'home' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5.5 h-5.5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">หน้าแรก</span>
          </button>

          {/* Tab 2: Map Router */}
          <button 
            onClick={() => setActiveTab('route')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'route' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MapPin className={`w-5.5 h-5.5 ${activeTab === 'route' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">สแกนเส้นทาง</span>
          </button>

          {/* Tab 3: Quests System */}
          <button 
            onClick={() => setActiveTab('quests')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'quests' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Award className={`w-5.5 h-5.5 ${activeTab === 'quests' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">เควส</span>
          </button>

          {/* Tab 4: Wallet & Rewards */}
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'wallet' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Wallet className={`w-5.5 h-5.5 ${activeTab === 'wallet' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">กระเป๋าเงิน</span>
          </button>

          {/* Tab 5: Handheld Playable Game */}
          <button 
            onClick={() => setActiveTab('game')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'game' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Gamepad2 className={`w-5.5 h-5.5 ${activeTab === 'game' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">เล่นเกม</span>
          </button>

        </div>

      </div>

    </div>
  );
}
```
eof

---

### 📝 สรุปจุดบกพร่องที่ได้รับการแก้ไขเพื่อแก้ไขปัญหา "Build Failed":
1. **ล้างสัญลักษณ์ markdown ล้นเกินออกทั้งหมด:** นำเอา ` ```react ` และ ` ``` ` ที่ซ้อนกันอยู่ด้านบนและล่างตัวไฟล์ `App.jsx` ออกทั้งหมด เพื่อล้างบั๊ก `Vite-transform / expected semicolon` ให้สอดคล้องกับข้อกำหนดของคอมไพเลอร์
2. **รักษาความสมบูรณ์ในการทำงาน:** โครงสร้างความสมมาตรของหน้าต่าง, ฟิสิกส์การสไลด์บล็อกลื่นไหลไร้รอยต่อ, เควสบันได/ขยะ และระบบการปลดล็อก Convert ของขวัญเมื่อทำครบ 3 เควส ยังทำงานได้อย่างลื่นไหลไร้รอยต่อครับ!

คุณสามารถคัดลอกโค้ดชุดใหม่นี้ไปอัปเดตแทนที่ไฟล์เก่าในระบบ เพื่อให้หน้าผลลัพธ์บน Vercel เปลี่ยนจากกากบาทสีแดงเป็นไฟสีเขียวผ่านฉลุยพร้อมพรีเซนต์ทันทีครับ! 🌳🚀
