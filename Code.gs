// ===================================================================
// PHYSIX Legends - Google Apps Script Backend
// ===================================================================

const SHEET_NAME = 'PHYSIX_DB';
const VERSION = '1.0.0';

// ===================================================================
// 1. DO_GET - Serve Web App
// ===================================================================

function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ===================================================================
// 2. FILE INCLUSION FOR TEMPLATING
// ===================================================================

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ===================================================================
// 3. SPREADSHEET UTILITIES
// ===================================================================

function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function ensureHeaders(sheetName, headers) {
  const sheet = getOrCreateSheet(sheetName);
  const firstRow = sheet.getRange(1, 1, 1, sheet.getMaxColumns()).getValues()[0];
  
  if (firstRow.filter(h => h).length === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

// ===================================================================
// 4. PLAYER DATA MANAGEMENT
// ===================================================================

function createPlayerProfile(playerName, classroom, seatNumber, studentId, hashedPin) {
  const sheet = getOrCreateSheet('Players');
  ensureHeaders('Players', [
    'playerId', 'playerName', 'classroom', 'seatNumber', 'studentId', 
    'pinHash', 'totalScore', 'totalExp', 'rank', 'totalStars', 
    'preTestScores', 'completedStages', 'wrongFormulas', 'createdAt', 'lastLogin'
  ]);
  
  const playerId = 'P_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const timestamp = new Date().toISOString();
  
  const newRow = [
    playerId, playerName, classroom, seatNumber, studentId, 
    hashedPin, 0, 0, 1, 0, 
    '{}', '{}', '{}', timestamp, timestamp
  ];
  
  sheet.appendRow(newRow);
  return playerId;
}

function findPlayerByStudentId(studentId) {
  const sheet = getOrCreateSheet('Players');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === studentId) {
      return {
        playerId: data[i][0],
        playerName: data[i][1],
        classroom: data[i][2],
        seatNumber: data[i][3],
        studentId: data[i][4],
        pinHash: data[i][5],
        totalScore: data[i][6],
        totalExp: data[i][7],
        rank: data[i][8],
        totalStars: data[i][9],
        preTestScores: JSON.parse(data[i][10] || '{}'),
        completedStages: JSON.parse(data[i][11] || '{}'),
        wrongFormulas: JSON.parse(data[i][12] || '{}'),
        rowIndex: i + 1
      };
    }
  }
  return null;
}

function updatePlayerLastLogin(playerId) {
  const sheet = getOrCreateSheet('Players');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === playerId) {
      sheet.getRange(i + 1, 15).setValue(new Date().toISOString());
      break;
    }
  }
}

function updatePlayerScore(playerId, scoreData) {
  const sheet = getOrCreateSheet('Players');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === playerId) {
      const row = i + 1;
      sheet.getRange(row, 7).setValue(scoreData.totalScore);
      sheet.getRange(row, 8).setValue(scoreData.totalExp);
      sheet.getRange(row, 9).setValue(scoreData.rank);
      sheet.getRange(row, 10).setValue(scoreData.totalStars);
      sheet.getRange(row, 11).setValue(JSON.stringify(scoreData.preTestScores || {}));
      sheet.getRange(row, 12).setValue(JSON.stringify(scoreData.completedStages || {}));
      sheet.getRange(row, 13).setValue(JSON.stringify(scoreData.wrongFormulas || {}));
      break;
    }
  }
}

// ===================================================================
// 5. HASH/VERIFY PIN
// ===================================================================

function hashPin(pin) {
  const str = pin.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function verifyPin(pin, hash) {
  return hashPin(pin) === hash;
}

// ===================================================================
// 6. STAGE PROGRESS TRACKING
// ===================================================================

function recordStageCompletion(playerId, gradeId, modeId, lessonId, levelId, stageNum, score, stars) {
  const sheet = getOrCreateSheet('StageProgress');
  ensureHeaders('StageProgress', [
    'playerId', 'gradeId', 'modeId', 'lessonId', 'levelId', 'stageNum',
    'score', 'stars', 'completedAt', 'attempts'
  ]);
  
  const key = `${gradeId}_${modeId}_${lessonId}_${levelId}_${stageNum}`;
  const existingRow = findStageRecord(playerId, key);
  
  if (existingRow) {
    const row = existingRow.row;
    sheet.getRange(row, 7).setValue(Math.max(score, existingRow.score));
    sheet.getRange(row, 8).setValue(Math.max(stars, existingRow.stars));
    sheet.getRange(row, 10).setValue(existingRow.attempts + 1);
  } else {
    const timestamp = new Date().toISOString();
    sheet.appendRow([
      playerId, gradeId, modeId, lessonId, levelId, stageNum,
      score, stars, timestamp, 1
    ]);
  }
}

function findStageRecord(playerId, key) {
  const sheet = getOrCreateSheet('StageProgress');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const stageKey = `${data[i][1]}_${data[i][2]}_${data[i][3]}_${data[i][4]}_${data[i][5]}`;
    if (data[i][0] === playerId && stageKey === key) {
      return {
        row: i + 1,
        score: data[i][6],
        stars: data[i][7],
        attempts: data[i][9]
      };
    }
  }
  return null;
}

// ===================================================================
// 7. PRE-TEST RESULTS
// ===================================================================

function recordPreTest(playerId, gradeId, lessonId, score, correctCount, wrongCount, accuracy, timeUsed) {
  const sheet = getOrCreateSheet('PreTestResults');
  ensureHeaders('PreTestResults', [
    'playerId', 'gradeId', 'lessonId', 'score', 'correctCount', 
    'wrongCount', 'accuracy', 'timeUsed', 'completedAt'
  ]);
  
  const timestamp = new Date().toISOString();
  sheet.appendRow([
    playerId, gradeId, lessonId, score, correctCount, 
    wrongCount, accuracy, timeUsed, timestamp
  ]);
}

// ===================================================================
// 8. WRONG FORMULA TRACKING
// ===================================================================

function recordWrongFormula(playerId, formulaId, attempts, explain) {
  const sheet = getOrCreateSheet('WrongFormulas');
  ensureHeaders('WrongFormulas', [
    'playerId', 'formulaId', 'attempts', 'lastWrong', 'explain'
  ]);
  
  const existingRow = findWrongFormulaRecord(playerId, formulaId);
  
  if (existingRow) {
    const row = existingRow.row;
    sheet.getRange(row, 3).setValue(existingRow.attempts + attempts);
    sheet.getRange(row, 4).setValue(new Date().toISOString());
  } else {
    const timestamp = new Date().toISOString();
    sheet.appendRow([
      playerId, formulaId, attempts, timestamp, explain
    ]);
  }
}

function findWrongFormulaRecord(playerId, formulaId) {
  const sheet = getOrCreateSheet('WrongFormulas');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === playerId && data[i][1] === formulaId) {
      return {
        row: i + 1,
        attempts: data[i][2]
      };
    }
  }
  return null;
}

// ===================================================================
// 9. PUBLIC API FOR FRONTEND
// ===================================================================

function checkStudentIdExists(studentId) {
  return findPlayerByStudentId(studentId) !== null;
}

function registerNewPlayer(playerName, classroom, seatNumber, studentId, pin) {
  if (checkStudentIdExists(studentId)) {
    return { success: false, message: 'รหัสนักเรียนนี้ลงทะเบียนแล้ว' };
  }
  
  const hashedPin = hashPin(pin);
  const playerId = createPlayerProfile(playerName, classroom, seatNumber, studentId, hashedPin);
  
  return {
    success: true,
    playerId: playerId,
    message: 'สมัครสำเร็จ'
  };
}

function loginPlayer(studentId, pin) {
  const player = findPlayerByStudentId(studentId);
  
  if (!player) {
    return { success: false, message: 'รหัสนักเรียนไม่ถูกต้อง' };
  }
  
  if (!verifyPin(pin, player.pinHash)) {
    return { success: false, message: 'PIN ไม่ถูกต้อง' };
  }
  
  updatePlayerLastLogin(player.playerId);
  
  return {
    success: true,
    playerId: player.playerId,
    playerName: player.playerName,
    classroom: player.classroom,
    seatNumber: player.seatNumber,
    totalScore: player.totalScore,
    totalExp: player.totalExp,
    rank: player.rank,
    totalStars: player.totalStars,
    preTestScores: player.preTestScores,
    completedStages: player.completedStages,
    wrongFormulas: player.wrongFormulas
  };
}

function getPlayerProfile(playerId) {
  const sheet = getOrCreateSheet('Players');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === playerId) {
      return {
        playerId: data[i][0],
        playerName: data[i][1],
        classroom: data[i][2],
        seatNumber: data[i][3],
        totalScore: data[i][6],
        totalExp: data[i][7],
        rank: data[i][8],
        totalStars: data[i][9],
        preTestScores: JSON.parse(data[i][10] || '{}'),
        completedStages: JSON.parse(data[i][11] || '{}'),
        wrongFormulas: JSON.parse(data[i][12] || '{}')
      };
    }
  }
  return null;
}

function getTopPlayers(limit = 5) {
  const sheet = getOrCreateSheet('Players');
  const data = sheet.getDataRange().getValues().slice(1);
  
  const sorted = data
    .map((row, idx) => ({
      playerId: row[0],
      playerName: row[1],
      classroom: row[2],
      seatNumber: row[3],
      totalScore: row[6],
      totalExp: row[7],
      rank: row[8],
      totalStars: row[9]
    }))
    .sort((a, b) => (b.totalScore + b.totalExp * 10) - (a.totalScore + a.totalExp * 10))
    .slice(0, limit);
  
  return sorted;
}

function saveStageResult(playerId, gradeId, modeId, lessonId, levelId, stageNum, score, stars, wrongFormulas) {
  recordStageCompletion(playerId, gradeId, modeId, lessonId, levelId, stageNum, score, stars);
  
  // บันทึกสูตรที่ผิด
  if (wrongFormulas && Array.isArray(wrongFormulas)) {
    wrongFormulas.forEach(fw => {
      recordWrongFormula(playerId, fw.formulaId, fw.attempts, fw.explain);
    });
  }
  
  // อัปเดตคะแนนรวม
  const player = getPlayerProfile(playerId);
  const newTotalScore = (player.totalScore || 0) + score;
  const newTotalExp = (player.totalExp || 0) + Math.floor(score / 10);
  const newRank = calculateRank(newTotalExp);
  const newTotalStars = (player.totalStars || 0) + stars;
  
  updatePlayerScore(playerId, {
    totalScore: newTotalScore,
    totalExp: newTotalExp,
    rank: newRank,
    totalStars: newTotalStars,
    preTestScores: player.preTestScores,
    completedStages: {
      ...player.completedStages,
      [`${gradeId}_${modeId}_${lessonId}_${levelId}_${stageNum}`]: {
        score: score,
        stars: stars,
        completedAt: new Date().toISOString()
      }
    },
    wrongFormulas: player.wrongFormulas
  });
  
  return {
    newTotalScore: newTotalScore,
    newTotalExp: newTotalExp,
    newRank: newRank,
    newTotalStars: newTotalStars
  };
}

function savePreTestResult(playerId, gradeId, lessonId, testData) {
  recordPreTest(playerId, gradeId, lessonId, testData.score, testData.correctCount, 
                testData.wrongCount, testData.accuracy, testData.timeUsed);
  
  return {
    success: true,
    message: 'บันทึกผลการวัดก่อนเรียนสำเร็จ'
  };
}

function calculateRank(totalExp) {
  if (totalExp < 100) return 1;
  if (totalExp < 300) return 2;
  if (totalExp < 600) return 3;
  if (totalExp < 1000) return 4;
  if (totalExp < 1500) return 5;
  return 6;
}
