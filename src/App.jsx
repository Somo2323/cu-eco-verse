import React, { useState, useRef } from 'react';
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
  Lock,
  Unlock,
  RotateCcw,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

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
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24);
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
    console.log("Audio API blocked or unsupported.");
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeQuestCategory, setActiveQuestCategory] = useState('zero_waste');
  
  const [coins, setCoins] = useState(1280);
  const [carbonSaved, setCarbonSaved] = useState(38.4);
  const [streak, setStreak] = useState(5);
  const [xp, setXp] = useState(180);
  const [level, setLevel] = useState(4);
  const [completedQuests, setCompletedQuests] = useState([]);

  // Quest Verification Modal State
  const [verifyingQuest, setVerifyingQuest] = useState(null);
  const [verificationStep, setVerificationStep] = useState(0);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Social / Party State
  const [partyMembers, setPartyMembers] = useState(['คุณ (หัวหน้าทีม)', 'นพดล (วิศวฯ)', 'สุดารัตน์ (อักษรฯ)']);
  const [friendCodeInput, setFriendCodeInput] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', text: '🚨 ตรวจพบการเปิดแอร์ค้างที่ตึก ENG3-402! ทำเควส CUBEMS ด่วน' },
    { id: 2, type: 'rare', text: '🌟 เควส Co-Op: ชวนเพื่อนทำเควสสำเร็จวันนี้ รับ +20 Eco-Coins แชร์ทั้งปาร์ตี้!' }
  ]);

  const [startPoint, setStartPoint] = useState('eng3');
  const [endPoint, setEndPoint] = useState('library');
  const [toast, setToast] = useState(null);

  const [transactions, setTransactions] = useState([
    { id: 1, title: 'แลกแก้วน้ำพับได้ CU Green', change: -1200, type: 'spend', date: 'วันนี้' },
    { id: 2, title: 'เควสกล่องข้าวหมุนเวียน (Bento)', change: 20, type: 'earn', date: 'วันนี้' },
    { id: 3, title: 'เควสคัดแยกขวด PET', change: 10, type: 'earn', date: 'เมื่อวาน' },
  ]);

  const [grid, setGrid] = useState(Array(6).fill(null).map(() => Array(6).fill(0)));
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const themeList = ['emerald', 'sky', 'pink', 'violet', 'amber'];
  const [activeThemeIdx, setActiveThemeIdx] = useState(0);
  const currentTheme = themeList[activeThemeIdx];

  // Fluid Drag state with Floating Lift Offset
  const [draggedShapeIdx, setDraggedShapeIdx] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [startTouchPos, setStartTouchPos] = useState({ x: 0, y: 0 });
  const [hoverCell, setHoverCell] = useState(null);

  // 15+ Board-friendly shapes (1x1, 1x2, 1x3, small corners, small T)
  const shapesDatabase = [
    { cells: [[1]] }, // Single 1x1 Dot (Super helper)
    { cells: [[1]] }, // Double weight for 1x1
    { cells: [[1, 1]] }, // 1x2 Horizontal
    { cells: [[1], [1]] }, // 2x1 Vertical
    { cells: [[1, 1, 1]] }, // 1x3 Horizontal
    { cells: [[1], [1], [1]] }, // 3x1 Vertical
    { cells: [[1, 1], [1, 1]] }, // 2x2 Square
    { cells: [[1, 0], [1, 1]] }, // Small L bottom-left
    { cells: [[0, 1], [1, 1]] }, // Small L bottom-right
    { cells: [[1, 1], [1, 0]] }, // Small L top-left
    { cells: [[1, 1], [0, 1]] }, // Small L top-right
    { cells: [[1, 1, 1], [0, 1, 0]] }, // Small T
    { cells: [[1, 0], [0, 1]] }, // Mini Diagonal
    { cells: [[1, 1, 1, 1]] }, // 1x4 Line
    { cells: [[1], [1], [1], [1]] } // 4x1 Line
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
      triggerToast(`🎉 เลเวลอัป! เลื่อนระดับเป็น อัศวินคาร์บอน Level ${newLevel}!`, 'levelUp');
    }
    setXp(newXp);
    setLevel(newLevel);
  };

  const mobilityData = [
    { id: 'm_bus', title: 'นั่งรถไฟฟ้า EV Pop Bus', desc: 'โดยสารรถป๊อปไฟฟ้าของมหาวิทยาลัยแทนรถส่วนตัว', verify: 'GPS + สแกน QR บนรถ', risk: 'ปานกลาง', riskDesc: 'GPS Spoof ได้ แต่ต้องมี QR ยืนยัน', reward: 10, xp: 25, carbon: 0.6, icon: '🚌' },
    { id: 'm_walk', title: 'เดินสัญจรทางสีเขียว', desc: 'เดินเรียนผ่านเส้นทางสวนป่าจามจุรี หรือทางเท้าบังแดด', verify: 'GPS + เช็คความเร็วเฉลี่ย', risk: 'ง่าย', riskDesc: 'ตรวจจับพิกัดก้าวเดินและความเร็ว', reward: 15, xp: 35, carbon: 0.8, icon: '🚶‍♂️' },
    { id: 'm_bike', title: 'ปั่นจักรยาน CU Bike', desc: 'ปั่นจักรยานสาธารณะแชร์ริ่งเพื่อเชื่อมต่อระหว่างตึกเรียน', verify: 'GPS + เช็คความเร็วเฉลี่ย', risk: 'ง่าย', riskDesc: 'คำนวณความเร็วการปั่นสัญจร', reward: 15, xp: 35, carbon: 1.1, icon: '🚲' }
  ];

  const zeroWasteQuests = [
    { id: 'zw_sort', title: 'คัดแยกขยะประจำคณะ', desc: 'แยกขยะทั่วไป ขยะรีไซเคิล และเศษอาหาร ณ จุดแยกขยะ', verify: 'ถ่ายรูป + สแกน QR (วันละครั้ง)', risk: 'ง่าย', riskDesc: 'ป้องกันถ่ายซ้ำด้วย AI & Timestamp', reward: 10, xp: 25, carbon: 0.5, icon: '🗑️' },
    { id: 'zw_bottle', title: 'คัดแยกขวด PET / กระป๋อง', desc: 'บดขวดพลาสติก PET หรือกระป๋องก่อนหยอดใส่ตู้รีไซเคิล', verify: 'ถ่ายรูป + สแกน QR (วันละครั้ง)', risk: 'ง่าย', riskDesc: 'ตรวจจับรูปภาพขวดบดร่วมกับบาร์โค้ด', reward: 10, xp: 25, carbon: 0.7, icon: '🥫' },
    { id: 'zw_recycle', title: 'ส่งขยะแห้งเข้ากระบวนการรีไซเคิล', desc: 'รวบรวมกล่องลัง กระดาษ หรือพลาสติกยืดส่งจุดรับรีไซเคิล', verify: 'ถ่ายรูป + สแกน QR (วันละครั้ง)', risk: 'ง่าย', riskDesc: 'ตรวจพิกัดและรูปถ่ายจุดรีไซเคิล', reward: 10, xp: 25, carbon: 0.8, icon: '♻️' },
    { id: 'zw_bento', title: 'กล่องข้าว / ภาชนะหมุนเวียน', desc: 'ใช้กล่องข้าวและช้อนส้อมพกพาในโรงอาหาร สแกน QR ผ่านร้านค้า', verify: 'ถ่ายรูป + สแกน QR ผ่านร้านค้า', risk: 'ยาก', riskDesc: 'พนักงานร้านค้าเป็นคนยื่น QR ยืนยันเอง', reward: 20, xp: 45, carbon: 1.2, icon: '🍱' },
    { id: 'zw_water', title: 'เติมน้ำดื่ม (ห้ามใช้ขวดพลาสติก)', desc: 'นำกระบอกน้ำส่วนตัวมาเติมน้ำดื่ม ณ จุดบริการตู้เติมน้ำ', verify: 'ถ่ายรูป + สแกน QR ที่จุดเติมน้ำ', risk: 'ง่าย', riskDesc: 'ตรวจจับรูปถ่ายกระบอกน้ำพกพา', reward: 10, xp: 25, carbon: 0.4, icon: '💧' }
  ];

  const energyQuests = [
    { id: 'be_power', title: 'ปิด/เปิดไฟฟ้าในห้องเรียน (On/Off)', desc: 'ปิดสวิตช์ไฟและแอร์เมื่อเลิกใช้งาน ระบบเทียบข้อมูล CUBEMS', verify: 'ข้อมูล Real-time จาก CUBEMS', risk: 'ยาก', riskDesc: 'ตรวจข้อมูลจริงจากมิเตอร์ไฟฟ้าประจำตึก', reward: 20, xp: 50, carbon: 2.0, icon: '🔌' },
    { id: 'be_stairs', title: 'เดินขึ้นบันไดแทนการใช้ลิฟต์', desc: 'เดินขึ้นลงบันไดตึกเรียนตั้งแต่ 3 ชั้นขึ้นไป สแกน QR ประจำชั้น', verify: 'สแกน QR Code ยืนยันพิกัดทุกชั้น', risk: 'ยาก', riskDesc: 'ต้องสแกนจุดจริงครบทุกชั้น ปลอมแปลงยาก', reward: 15, xp: 35, carbon: 0.5, icon: '🪜' }
  ];

  const socialQuests = [
    { id: 'sc_friend', title: 'ชวนเพื่อนทำเควสร่วมกันสำเร็จ 1 ข้อ', desc: 'จับคู่ทำเควสสิ่งแวดล้อมใดก็ได้สำเร็จร่วมกันในวันนี้', verify: 'ยืนยันความสำเร็จร่วมกันในกลุ่มปาร์ตี้', risk: 'ปานกลาง', riskDesc: 'แบ่งรางวัล 20 Eco-Coins ให้ทุกคนในกลุ่ม', reward: 20, xp: 60, carbon: 1.5, icon: '👥' }
  ];

  const handleInitiateQuestVerification = (quest) => {
    if (completedQuests.includes(quest.id)) {
      triggerToast("🔒 เควสนี้ทำสำเร็จแล้วในวันนี้! (จำกัดวันละ 1 รอบ)", "info");
      return;
    }
    playSynthSound('select');
    setVerifyingQuest(quest);
    setVerificationStep(0);
    setPhotoCaptured(false);
    setQrScanned(false);
    setAiAnalyzing(false);
  };

  const handleNextVerificationStep = () => {
    playSynthSound('select');
    if (verificationStep === 0) {
      setVerificationStep(1);
    } else if (verificationStep === 1) {
      setAiAnalyzing(true);
      setTimeout(() => {
        setAiAnalyzing(false);
        setPhotoCaptured(true);
        setQrScanned(true);
        setVerificationStep(2);
        playSynthSound('select');
      }, 1200);
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
      title: `สำเร็จเควส ${quest.title}`,
      change: quest.reward,
      type: 'earn',
      date: 'วันนี้'
    };
    setTransactions([newTx, ...transactions]);
    playSynthSound('perfect');
  };

  const handleAddPartyMember = () => {
    if (!friendCodeInput.trim()) return;
    setPartyMembers([...partyMembers, `เพื่อนไอดี: ${friendCodeInput.trim()}`]);
    setFriendCodeInput('');
    triggerToast("✨ เข้าร่วมปาร์ตี้เรียบร้อย!");
  };

  const rewardsList = [
    { id: 'reward_cup', title: 'คูปองเครื่องดื่มฟรี CU Cafe', cost: 1800, desc: 'เครื่องดื่มฟรี 1 แก้วเมื่อนำแก้วส่วนตัวมาใช้', icon: '☕' },
    { id: 'reward_ev', title: 'EV Motor Pass ฟรีช่วงพีค', cost: 950, desc: 'รับสิทธิ์ชาร์จมอเตอร์ไซค์ไฟฟ้า ฟรี 5 ครั้ง', icon: '🔌' },
    { id: 'reward_gened', title: 'Gen-Ed Course Fast Pass', cost: 6500, desc: 'สิทธิ์ลงทะเบียนวิชาหมวดศึกษาทั่วไปยอดนิยมล่วงหน้า', icon: '🎓' },
    { id: 'reward_ticket', title: 'ตั๋วชมภาพยนตร์ Eco-Seat', cost: 5800, desc: 'ตั๋วภาพยนตร์ฟรี 1 ใบ สนับสนุนโครงการปลูกป่า', icon: '🎬' }
  ];

  const handleRedeem = (reward) => {
    if (coins < reward.cost) {
      triggerToast("ยอด Eco-Coins สะสมไม่เพียงพอ!", "error");
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
    triggerToast(`🎁 แลกสำเร็จ! บันทึกสิทธิ์ลงกระเป๋าของคุณแล้ว`);
  };

  const FLOATING_Y_OFFSET = -70; // Float piece above finger so player can see board

  const handlePointerDown = (e, index) => {
    playSynthSound('select');
    setDraggedShapeIdx(index);
    setStartTouchPos({ x: e.clientX, y: e.clientY });
    setDragPos({ x: 0, y: FLOATING_Y_OFFSET });
  };

  const handlePointerMove = (e) => {
    if (draggedShapeIdx === null) return;
    
    const dx = e.clientX - startTouchPos.x;
    const dy = (e.clientY - startTouchPos.y) + FLOATING_Y_OFFSET;
    setDragPos({ x: dx, y: dy });

    const gridEl = document.getElementById("game-grid-board");
    if (!gridEl) return;

    const gridRect = gridEl.getBoundingClientRect();
    // Calculate targeted cell taking floating Y offset into account
    const targetX = e.clientX;
    const targetY = e.clientY + FLOATING_Y_OFFSET;

    const relX = targetX - gridRect.left;
    const relY = targetY - gridRect.top;

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
      triggerToast("อย่าวางบล็อกออกนอกกระดานครับ!", "error");
      return;
    }

    let fits = true;
    for (let sR = 0; sR < shapeRows; sR++) {
      for (let sC = 0; sC < shapeCols; sC++) {
        if (selectedShape.cells[sR][sC] === 1 && grid[r + sR][c + sC] === 1) {
          fits = false;
        }
      }
    }

    if (!fits) {
      triggerToast("จุดนี้มีบล็อกอื่นบดบังอยู่แล้ว!", "error");
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
      triggerToast("🌟 PERFECT WIPE! เคลียร์กระดานหมดจด! สลับธีมสีใหม่!", "success");
    }

    const blocksPlacedCount = selectedShape.cells.flat().filter(x => x === 1).length;
    const roundScore = (blocksPlacedCount * 20) + (clearedCount * 250) + extraPerfectBonus;
    setScore(prev => prev + roundScore);

    setGrid(newGrid);

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
    setIsGameOver(false);
    triggerToast("กระดานรีเซ็ตแล้ว ลุยต่อได้เลย!");
  };

  const isEligibleToConvert = completedQuests.length >= 3;
  const conversionRate = 10000;

  const handleConvertScoreToCoins = () => {
    if (!isEligibleToConvert) {
      triggerToast("🔒 ต้องพิชิตภารกิจให้ครบ 3 เควสก่อนวันนี้!", "error");
      return;
    }

    if (score < conversionRate) {
      triggerToast(`ต้องการอย่างน้อย ${conversionRate.toLocaleString()} แต้มเพื่อแลก 1 Eco-Coin!`, "info");
      return;
    }

    const earnedCoins = Math.floor(score / conversionRate);
    const scoreDeducted = earnedCoins * conversionRate;

    setCoins(prev => prev + earnedCoins);
    setScore(prev => prev - scoreDeducted);

    const newTx = {
      id: Date.now(),
      title: "แปลงคะแนน Block Blast เป็น Eco-Coins",
      change: earnedCoins,
      type: 'earn',
      date: 'วันนี้'
    };
    setTransactions([newTx, ...transactions]);
    triggerToast(`🎉 แปลงคะแนนสำเร็จ! +${earnedCoins} 🪙 สู่กระเป๋า!`);
  };

  const getThemeBlockClass = (activeTh) => {
    switch (activeTh) {
      case 'emerald': return 'from-emerald-400 to-teal-600 border-emerald-300 text-emerald-400 shadow-emerald-500/30';
      case 'sky': return 'from-sky-400 to-indigo-600 border-sky-300 text-sky-400 shadow-sky-500/30';
      case 'pink': return 'from-pink-500 to-rose-600 border-pink-400 text-pink-500 shadow-pink-500/30';
      case 'violet': return 'from-violet-500 to-fuchsia-600 border-violet-400 text-violet-500 shadow-violet-500/30';
      case 'amber': return 'from-amber-400 to-orange-500 border-amber-300 text-amber-500 shadow-amber-500/30';
      default: return 'from-emerald-400 to-teal-600 border-emerald-300 text-emerald-400';
    }
  };

  const getRiskBadge = (risk) => {
    if (risk === 'ยาก') {
      return (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> โกงยาก (ความน่าเชื่อถือสูง)
        </span>
      );
    } else if (risk === 'ปานกลาง') {
      return (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-amber-600" /> โกงปานกลาง (ต้องสแกน QR)
        </span>
      );
    } else {
      return (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
          <Info className="w-3 h-3 text-orange-600" /> โกงง่าย (ตรวจด้วย AI &amp; Timestamp)
        </span>
      );
    }
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen bg-slate-950 font-sans p-2 sm:p-6 antialiased text-slate-800 select-none overflow-hidden" 
      onPointerMove={handlePointerMove} 
      onPointerUp={handlePointerUp}
    >
      
      {/* MOBILE DEVICE CONTAINER (CENTERED ONLY, NO SIDE TEXT) */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col shrink-0">
        
        {/* Hardware Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
        </div>

        {/* Status Bar */}
        <div className="w-full h-9 bg-slate-50 text-slate-900 flex justify-between items-center px-6 pt-2 text-[11px] font-bold z-30 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-extrabold">5G CU_WiFi</span>
            <div className="w-4 h-2.5 border border-slate-900 rounded-xs p-[1px] flex items-center">
              <div className="h-full w-2.5 bg-slate-950 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Brand Bar Header */}
        <div className="bg-white border-b border-slate-100 px-4 py-2 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-black tracking-wider text-slate-800">CU ECO-VERSE</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-bounce" />
            <span>Streak: {streak} วัน</span>
          </div>
        </div>

        {/* Dynamic Toast Popup */}
        {toast && (
          <div className="absolute top-12 left-4 right-4 bg-slate-900 text-white text-[10.5px] p-2.5 rounded-xl shadow-lg z-50 flex items-center gap-2 border border-slate-800 animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="leading-tight">{toast.message}</p>
          </div>
        )}

        {/* VERIFICATION MODAL */}
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
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{verifyingQuest.icon}</span>
                  <div>
                    <h4 className="text-sm font-black text-white">{verifyingQuest.title}</h4>
                    <p className="text-[10px] text-pink-400 font-bold">รับ +{verifyingQuest.reward} Eco-Coins 🪙</p>
                  </div>
                </div>
                <div className="mt-2">
                  {getRiskBadge(verifyingQuest.risk)}
                </div>
              </div>

              <div className="space-y-2 bg-black/40 p-3 rounded-2xl text-[10.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    1. {verifyingQuest.verify.split('+')[0] || 'ตรวจสอบตำแหน่ง'}
                  </span>
                  {verificationStep >= 1 ? (
                    <span className="text-emerald-400 font-bold">✓ ตรวจพบ</span>
                  ) : (
                    <span className="text-slate-500 animate-pulse">กำลังสแกน...</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    2. {verifyingQuest.verify.split('+')[1] || 'สแกน QR / ยืนยัน'}
                  </span>
                  {aiAnalyzing ? (
                    <span className="text-amber-400 animate-pulse font-bold">กำลังสแกน...</span>
                  ) : photoCaptured || qrScanned ? (
                    <span className="text-emerald-400 font-bold">✓ ผ่านด่าน</span>
                  ) : verificationStep >= 1 ? (
                    <span className="text-pink-400 font-bold animate-pulse">📸 รอสแกน/ถ่ายรูป</span>
                  ) : (
                    <span className="text-slate-600">รอดำเนินการ</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    3. บันทึกผลลงฐานข้อมูล
                  </span>
                  {verificationStep >= 3 ? (
                    <span className="text-emerald-400 font-bold">✓ สำเร็จแล้ว</span>
                  ) : verificationStep >= 2 ? (
                    <span className="text-emerald-400 animate-pulse font-semibold">กำลังซิงก์...</span>
                  ) : (
                    <span className="text-slate-600">รอดำเนินการ</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-xl text-[9.5px] text-slate-300 leading-tight">
                <strong>💡 กลไกป้องกันการโกง:</strong> {verifyingQuest.riskDesc}
              </div>

              {verificationStep < 3 ? (
                <button 
                  onClick={handleNextVerificationStep}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  {verificationStep === 0 && <>ถัดไป: สแกนพิกัด GPS / Beacon</>}
                  {verificationStep === 1 && (
                    <><QrCode className="w-4 h-4" /> แตะเพื่อสแกน QR / ถ่ายรูปยืนยัน</>
                  )}
                  {verificationStep === 2 && <>อัปโหลดเพื่อบันทึกประวัติการทำเควส</>}
                </button>
              ) : (
                <div className="text-center py-2 space-y-2">
                  <p className="text-emerald-400 font-bold text-xs">🎉 ทำเควสสำเร็จ! ได้รับ +{verifyingQuest.reward} Eco-Coins</p>
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

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative pb-16">
          
          {/* TAB 1: HOME PAGE */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 rounded-3xl p-4 text-white shadow-lg relative overflow-hidden">
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
                    <p className="text-[10px] text-emerald-100">Carbon Guard</p>
                    <p className="text-sm font-black text-white">Level {level}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-emerald-100">
                    <span>ค่าประสบการณ์ (XP)</span>
                    <span>{xp}/{xpNeededForNextLevel} XP</span>
                  </div>
                  <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full transition-all duration-500" style={{ width: `${(xp / xpNeededForNextLevel) * 100}%` }}></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <p className="text-[9px] text-emerald-100">กระเป๋า Eco-Coins</p>
                    <p className="text-base font-black mt-0.5 flex items-center gap-1 text-yellow-300">
                      {coins.toLocaleString()} <span className="text-[10px] bg-white/20 text-white px-1 py-0.2 rounded">🪙</span>
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <p className="text-[9px] text-emerald-100">คาร์บอนที่ลดสะสม</p>
                    <p className="text-base font-black mt-0.5 text-emerald-300">
                      {carbonSaved} <span className="text-[10px] text-white">kg CO₂e</span>
                    </p>
                  </div>
                </div>
              </div>

              {notifications.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 relative">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <Info className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 pr-6">
                    <p className="text-[11px] font-bold text-amber-900">การแจ้งเตือนเควสด่วน:</p>
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

              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10.5px] font-extrabold text-slate-700 flex items-center gap-1">
                    🎯 เงื่อนไขปลดล็อคการแปลงคะแนนเกมวันนี้
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    isEligibleToConvert ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-50 text-pink-600'
                  }`}>
                    {completedQuests.length}/3 เควส
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((completedQuests.length / 3) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[9.5px] text-slate-500 leading-normal flex items-center gap-1">
                  {isEligibleToConvert 
                    ? "✨ ปลดล็อกสิทธิ์แล้ว! คุณสามารถแปลงคะแนน Block Blast เป็น Eco-Coins วันนี้!" 
                    : "🔒 ต้องพิชิตภารกิจอย่างน้อย 3 เควสก่อน จึงจะแปลงคะแนนมินิเกมได้ครับ"}
                </p>
              </div>

              {/* Faculty Leaderboard */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
                    <Users className="w-4 h-4 text-emerald-600" /> อันดับคณะและการมีส่วนร่วม (RES-Rank)
                  </h4>
                  <span className="text-[9px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">ซีซั่น 1</span>
                </div>

                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-black text-[10px] flex items-center justify-center">
                        👑 1
                      </div>
                      <div>
                        <h5 className="text-[10.5px] font-bold text-slate-800">วิศวกรรมศาสตร์ (ENG)</h5>
                        <p className="text-[8.5px] text-slate-500">ลดคาร์บอนแล้ว: <span className="font-bold text-slate-700">2,450 kg CO2e</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9.5px] font-black text-emerald-600 block">45.5 RES</span>
                      <span className="text-[8px] bg-white px-1.5 py-0.2 text-emerald-600 rounded border border-emerald-200 font-semibold">แชมป์พลังงาน</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 text-slate-700 font-black text-[10px] flex items-center justify-center">2</div>
                      <div>
                        <h5 className="text-[10.5px] font-bold text-slate-800">วิทยาศาสตร์ (SCI)</h5>
                        <p className="text-[8.5px] text-slate-500">ลดคาร์บอนแล้ว: <span className="font-bold text-slate-700">1,980 kg CO2e</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9.5px] font-bold text-slate-700 block">42.0 RES</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GREEN MOBILITY */}
          {activeTab === 'route' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Navigation className="w-4.5 h-4.5 text-emerald-600" />
                  <span className="text-xs font-black text-slate-800">สแกนเส้นทาง Green Mobility</span>
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

              <div className="space-y-2.5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">หมวดเควสเดินทางคาร์บอนต่ำ:</p>
                {mobilityData.map(mQuest => {
                  const isDone = completedQuests.includes(mQuest.id);
                  return (
                    <div 
                      key={mQuest.id}
                      className="bg-white rounded-2xl p-3 border border-slate-100 hover:border-slate-200 shadow-xs flex justify-between items-center transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold text-lg bg-emerald-50 text-emerald-700 shrink-0">
                          {mQuest.icon}
                        </div>

                        <div>
                          <h4 className="text-[11px] font-bold text-slate-800">{mQuest.title}</h4>
                          <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{mQuest.desc}</p>
                          <div className="mt-1">
                            {getRiskBadge(mQuest.risk)}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right space-y-1">
                        <span className="text-[10.5px] font-black text-emerald-600 block">+{mQuest.reward} 🪙</span>
                        {isDone ? (
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-lg block">
                            ทำแล้ววันนี้
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleInitiateQuestVerification(mQuest)}
                            className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95"
                          >
                            ทำเควส
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
              
              <div className="bg-white p-1 rounded-2xl border border-slate-200/80 grid grid-cols-3 gap-1 select-none">
                <button
                  onClick={() => setActiveQuestCategory('zero_waste')}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                    activeQuestCategory === 'zero_waste' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Zero Waste
                </button>
                <button
                  onClick={() => setActiveQuestCategory('energy')}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                    activeQuestCategory === 'energy' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Building Energy
                </button>
                <button
                  onClick={() => setActiveQuestCategory('social')}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                    activeQuestCategory === 'social' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ชวนเพื่อน (Co-Op)
                </button>
              </div>

              {activeQuestCategory === 'zero_waste' && (
                <div className="space-y-2.5">
                  {zeroWasteQuests.map((quest) => {
                    const isDone = completedQuests.includes(quest.id);
                    return (
                      <div key={quest.id} className="bg-white rounded-2xl p-3 border border-slate-100 hover:border-slate-200 shadow-xs flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">
                            {quest.icon}
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800">{quest.title}</h4>
                            <p className="text-[9.5px] text-slate-500 leading-tight mt-0.5">{quest.desc}</p>
                            <div className="mt-1">
                              {getRiskBadge(quest.risk)}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right space-y-1">
                          <span className="text-[10.5px] font-black text-emerald-600 block">+{quest.reward} 🪙</span>
                          {isDone ? (
                            <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-lg block">
                              ทำแล้ววันนี้
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleInitiateQuestVerification(quest)}
                              className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition-all active:scale-95"
                            >
                              ทำเควส
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeQuestCategory === 'energy' && (
                <div className="space-y-2.5">
                  {energyQuests.map((quest) => {
                    const isDone = completedQuests.includes(quest.id);
                    return (
                      <div key={quest.id} className="bg-white rounded-2xl p-3 border border-slate-100 hover:border-slate-200 shadow-xs flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">
                            {quest.icon}
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800">{quest.title}</h4>
                            <p className="text-[9.5px] text-slate-500 leading-tight mt-0.5">{quest.desc}</p>
                            <div className="mt-1">
                              {getRiskBadge(quest.risk)}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right space-y-1">
                          <span className="text-[10.5px] font-black text-emerald-600 block">+{quest.reward} 🪙</span>
                          {isDone ? (
                            <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-lg block">
                              ทำแล้ววันนี้
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleInitiateQuestVerification(quest)}
                              className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition-all active:scale-95"
                            >
                              ทำเควส
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeQuestCategory === 'social' && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-3.5 space-y-3 border border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black flex items-center gap-1.5 text-indigo-300">
                        <Users className="w-4 h-4 text-emerald-400" /> สมาชิกปาร์ตี้ Co-Op วันนี้
                      </h4>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        +{socialQuests[0].reward} Coins/คน
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {partyMembers.map((member, idx) => (
                        <div key={idx} className="bg-white/10 px-2.5 py-1.5 rounded-xl text-[10px] flex justify-between items-center">
                          <span>{member}</span>
                          <span className="text-emerald-400 font-bold">✓ พร้อมทำเควส</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input 
                        type="text" 
                        placeholder="กรอกไอดีเพื่อนเพื่อชวนร่วมทีม..." 
                        value={friendCodeInput}
                        onChange={(e) => setFriendCodeInput(e.target.value)}
                        className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-xl px-2.5 py-1 text-[10px]"
                      />
                      <button 
                        onClick={handleAddPartyMember}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1 rounded-xl text-[10px] flex items-center gap-1"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> ชวน
                      </button>
                    </div>
                  </div>

                  {socialQuests.map((quest) => {
                    const isDone = completedQuests.includes(quest.id);
                    return (
                      <div key={quest.id} className="bg-white rounded-2xl p-3 border border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">
                            {quest.icon}
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800">{quest.title}</h4>
                            <p className="text-[9.5px] text-slate-500 mt-0.5">{quest.desc}</p>
                            <div className="mt-1">
                              {getRiskBadge(quest.risk)}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right space-y-1">
                          <span className="text-[10.5px] font-black text-emerald-600 block">+{quest.reward} 🪙</span>
                          {isDone ? (
                            <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-lg block">
                              ทำแล้ววันนี้
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleInitiateQuestVerification(quest)}
                              className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95"
                            >
                              ทำเควสทีม
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: WALLET */}
          {activeTab === 'wallet' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
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
                    <p className="font-bold text-white">{(coins / 10).toFixed(0)} บาท</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-indigo-400">ระดับเครดิตคาร์บอน</p>
                    <p className="font-bold text-emerald-400">Class-A Carbon Saver</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-600" /> ของรางวัลสิทธิประโยชน์จุฬาฯ
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
                        <p className="text-[9.5px] text-emerald-600 font-extrabold text-center">{reward.cost} 🪙</p>
                        <button 
                          onClick={() => handleRedeem(reward)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 rounded-xl transition-all active:scale-95"
                        >
                          แลกสิทธิ์
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">ประวัติการสะสมและการแลกของ</h4>
                <div className="space-y-1.5">
                  {transactions.slice(0, 4).map((tx) => (
                    <div key={tx.id} className="bg-white p-2.5 rounded-xl border border-slate-100 flex justify-between items-center text-[10px]">
                      <div>
                        <p className="font-bold text-slate-800">{tx.title}</p>
                        <p className="text-[8px] text-slate-400 mt-0.5">{tx.date}</p>
                      </div>
                      <span className={`font-black ${tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'earn' ? `+${tx.change}` : tx.change} 🪙
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: GAME BLOCK BLAST */}
          {activeTab === 'game' && (
            <div className="p-4 space-y-4 animate-fadeIn">
              
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-4 border border-indigo-500/25 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <Gamepad2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> ECO BLOCK BLAST
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full font-bold uppercase border border-emerald-500/30">
                    🎨 ธีม: {currentTheme}
                  </span>
                </div>

                <div className="text-center py-3 my-2 bg-black/40 rounded-2xl border border-indigo-500/20 shadow-inner">
                  <p className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest">คะแนนสะสมบลาสต์ปัจจุบัน</p>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 tracking-tight mt-1">
                    {score.toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-800/80 flex items-center justify-between">
                  <div className="flex-1 pr-3">
                    <p className="text-[8.5px] text-indigo-300">อัตราแปลงคะแนนเป็น Eco-Coins</p>
                    <p className="text-[10.5px] font-bold text-white flex items-center gap-1 mt-0.5">
                      <span className="text-emerald-400 font-black">10,000 คะแนน</span> = 1 🪙
                    </p>
                    <p className="text-[8.5px] text-slate-400 mt-1">
                      {isEligibleToConvert ? (
                        <span className="text-emerald-400 font-semibold">✓ พิชิตครบ 3 เควสตามเงื่อนไขวันนี้แล้ว!</span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
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

              {/* 6x6 Grid Block Blast */}
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
                              if (activeShape.cells[dR][dC] === 1) isHovered = true;
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
                                ? 'bg-emerald-500/30 border border-emerald-400/80 animate-pulse'
                                : 'bg-slate-800 border border-slate-950/40'
                            }`}
                          >
                            {cell === 1 && <span className="absolute inset-0 bg-white/10 rounded-md"></span>}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

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

                {/* Handheld shapes deck */}
                <div className="w-full space-y-2">
                  <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-wider">
                    แตะแล้วลากบล็อกไปวางบนกระดานด้านบน 🧩
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

                      const isBeingDragged = draggedShapeIdx === shapeIdx;
                      return (
                        <div
                          key={shapeIdx}
                          onPointerDown={(e) => handlePointerDown(e, shapeIdx)}
                          className={`p-2 rounded-xl border-2 transition-transform duration-75 flex flex-col items-center justify-center h-20 cursor-grab active:cursor-grabbing touch-none select-none ${
                            isBeingDragged 
                              ? 'border-emerald-500 bg-emerald-50/20 shadow-xl' 
                              : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                          style={{
                            transform: isBeingDragged 
                              ? `translate3d(${dragPos.x}px, ${dragPos.y}px, 0px) scale(1.25)` 
                              : 'none',
                            zIndex: isBeingDragged ? 50 : 1,
                            pointerEvents: 'auto'
                          }}
                        >
                          <div className="flex flex-col gap-0.5 justify-center items-center pointer-events-none">
                            {shape.cells.map((row, r) => (
                              <div key={r} className="flex gap-0.5">
                                {row.map((cell, c) => (
                                  <div 
                                    key={c} 
                                    className={`w-2.5 h-2.5 rounded-xs ${
                                      cell === 1 ? `bg-gradient-to-br ${getThemeBlockClass(currentTheme)}` : 'bg-transparent'
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

                <div className="flex justify-center w-full">
                  <button 
                    onClick={handleResetGame}
                    className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ตกระดานใหม่
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-[64px] bg-white border-t border-slate-200/80 px-4 py-2 flex justify-around items-center rounded-t-2xl shadow-lg z-20 select-none shrink-0">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'home' ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5.5 h-5.5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">หน้าแรก</span>
          </button>

          <button 
            onClick={() => setActiveTab('route')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'route' ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MapPin className={`w-5.5 h-5.5 ${activeTab === 'route' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">สแกนเส้นทาง</span>
          </button>

          <button 
            onClick={() => setActiveTab('quests')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'quests' ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Award className={`w-5.5 h-5.5 ${activeTab === 'quests' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">เควส</span>
          </button>

          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'wallet' ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Wallet className={`w-5.5 h-5.5 ${activeTab === 'wallet' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[9px] font-extrabold mt-1">กระเป๋าเงิน</span>
          </button>

          <button 
            onClick={() => setActiveTab('game')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'game' ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600'
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
