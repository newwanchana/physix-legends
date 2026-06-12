===================================================================
PHYSIX Legends - Physics Formula Learning Game
Version 1.0.0
===================================================================

📖 ภาพรวม
---------
PHYSIX Legends คือเกมเพื่อการศึกษาสำหรับฝึกสูตรฟิสิกส์และคณิตศาสตร์
เป็นระบบ Web App / PWA ที่สร้างด้วย Google Apps Script และใช้ Google Sheets
เป็นฐานข้อมูลหลัก

เป้าหมายหลัก:
- ช่วยนักเรียนมัธยมศึกษา ม.4-ม.6 ฝึกสูตรฟิสิกส์
- ให้ข้อมูลกลับมาแก่ครูและผู้เรียนเพื่อการปรับปรุง
- สร้างแรงจูงใจผ่านระบบคะแนน ดาว และอันดับ

===================================================================
🚀 การติดตั้ง
=============

ขั้นตอนที่ 1: สร้าง Google Apps Script Project
-------------------------------------------------
1. ไปที่ script.google.com
2. สร้าง New Project
3. ตั้งชื่อ "PHYSIX Legends"

ขั้นตอนที่ 2: สร้าง Google Sheet
---------------------------------
1. สร้าง Google Sheet ใหม่
2. ตั้งชื่อ "PHYSIX_DB"
3. คัดลอก URL และนำไปไว้ในตัวแปร SPREADSHEET_ID

ขั้นตอนที่ 3: เพิ่มไฟล์โค้ด
----------------------------
ใน Google Apps Script Editor ให้:

1. ลบไฟล์ Code.gs เดิม
2. สร้างไฟล์ใหม่ดังนี้:

   - Code.gs (Google Apps Script backend)
   - index.html (HTML main structure)
   - CSS.html (Stylesheet)
   - Data.html (Game data & formulas)
   - JS.html (Frontend logic)

3. คัดลอกโค้ดจากแต่ละไฟล์เข้าสู่ตัวเดียวกัน

ขั้นตอนที่ 4: เชื่อมต่อกับ Google Sheet
----------------------------------------
ในไฟล์ Code.gs ที่บรรทัด 13:

const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID';

แทนที่ YOUR_GOOGLE_SHEET_ID ด้วย ID ของ Sheet ของคุณ

ID สามารถหาได้จากโครงสร้าง URL:
https://docs.google.com/spreadsheets/d/{ID}/edit

ขั้นตอนที่ 5: Deploy
--------------------
1. คลิก Deploy (ปุ่มกลม ที่มุมขวา)
2. เลือก "New deployment"
3. เลือก Type: "Web app"
4. ตั้งค่า:
   - Execute as: your email
   - Who has access: Anyone
5. คัดลอก URL ที่ได้

===================================================================
🎮 วิธีใช้งาน
=============

สำหรับนักเรียน
--------------

1. เข้าสู่ระบบ / สมัครสมาชิก
   - ใช้รหัสนักเรียน + PIN 4 หลัก
   - ข้อมูลจะถูก Hash ก่อนบันทึก

2. ดูแดชบอร์ด
   - ดูคะแนน, EXP, Rank, ดาวสะสม
   - ดูสูตรที่ต้องทบทวน
   - ดูการจัดอันดับ Top 5

3. เลือกโหมด
   - สมการฟิสิกส์ (เปิดใช้งานแล้ว)
   - คณิตศาสตร์สำหรับฟิสิกส์ (Coming Soon)

4. เลือกชั้นปี
   - ม.4 (เปิดใช้งานแล้ว)
   - ม.5, ม.6 (Coming Soon)

5. เลือกบท (ปัจจุบัน ม.4 มี 6 บท)
   - การเคลื่อนที่แนวตรง (เปิดใช้งานแล้ว)
   - อื่น ๆ (Coming Soon)

6. ทำ Pre-Test (20 ข้อ)
   - ไม่บังคับตอบถูก
   - ใช้วัดระดับก่อนเรียน
   - ระบบแนะนำระดับความยาก

7. เลือกระดับความยาก
   - Easy (ซ่อน 1 ช่อง, มีจำนวน)
   - Medium (ซ่อน 2 ช่อง)
   - Hard (ซ่อน 3 ช่อง)
   - Hell (ซ่อนทั้งหมด)

8. เลือก Stage
   - 9 Stage ด่านฝึก
   - 1 Stage Boss (Post-Test)

9. เล่นเกม Formula Arena
   - ดูสูตร
   - เลือกตัวแปร/ค่า จากแบงค์ Token
   - ลากไปใส่ในช่องว่าง
   - ตรวจคำตอบ
   - ต้องตอบถูกจึงไปข้อต่อไป

10. เก็บคะแนนและดาว
    - ตัวเลือกถูกเพิ่มเติม
    - บันทึกสูตรที่ผิด

===================================================================
📊 โครงสร้างฐานข้อมูล
====================

Google Sheet จะสร้างแผนดังต่อไปนี้อัตโนมัติ:

1. Players
   - playerId (ค่า Unique)
   - playerName
   - classroom
   - seatNumber
   - studentId (ต้องไม่ซ้ำกัน)
   - pinHash
   - totalScore
   - totalExp
   - rank
   - totalStars
   - preTestScores (JSON)
   - completedStages (JSON)
   - wrongFormulas (JSON)
   - createdAt
   - lastLogin

2. StageProgress
   - playerId
   - gradeId
   - modeId
   - lessonId
   - levelId
   - stageNum
   - score
   - stars
   - completedAt
   - attempts

3. PreTestResults
   - playerId
   - gradeId
   - lessonId
   - score
   - correctCount
   - wrongCount
   - accuracy
   - timeUsed
   - completedAt

4. WrongFormulas
   - playerId
   - formulaId
   - attempts
   - lastWrong
   - explain

===================================================================
🔐 ระบบ Security
================

PIN Hashing:
- ไม่เก็บ PIN แบบ Plain Text
- ใช้ Simple Hash Function ที่ Apps Script

Login Flow:
1. ผู้ใช้กรอก รหัสนักเรียน + PIN
2. Backend ค้นหา studentId ในตาราง Players
3. Hash PIN ที่รับมา
4. เปรียบเทียบกับ pinHash ที่เก็บไว้
5. ถ้าตรงกัน ให้ Login สำเร็จ

ข้อมูลที่ส่งมา/ไป:
- ใช้ Google Apps Script Security
- ข้อมูลบันทึกในโปรเจกต์ Google Sheet เดียว
- ไม่ส่งข้อมูลออกไปนอกระบบ

===================================================================
📝 สูตรและข้อมูล
================

ที่อยู่ Data.html:

Formula Bank:
- 16 สูตรพื้นฐานสำหรับ ม.4 Linear Motion
- Schema: id, gradeId, modeId, lessonId, topic, formula, template, slots, level, tags, distractors, hint, explain
- แต่ละสูตรมี Distractors (ตัวเลือกที่ผิด) ให้เลือก

Pre-Test Questions:
- 20 ข้อเสริม/ตรวจสอบแต่ละบท
- ปัจจุบัน ม.4 Linear Motion มี 20 ข้อครบ

Stage Themes:
- Stage 1: สูตรพื้นฐาน
- Stage 2: ตัวแปรหาย
- Stage 3: เศษส่วน
- Stage 4: ย้ายรูปสมการ
- Stage 5: สูตรไม่มีเวลา
- Stage 6: สูตรผสม
- Stage 7: สูตรที่มักพลาด
- Stage 8: สุ่มรวม
- Stage 9: เตรียมก่อน Boss
- Stage 10: Boss Post-Test

Difficulty Levels:
- Easy: ซ่อน 1 ช่อง, มีจำนวน, Score x1.0
- Medium: ซ่อน 2 ช่อง, Score x1.2
- Hard: ซ่อน 3 ช่อง, Score x1.5
- Hell: ซ่อนทั้งหมด, Score x2.0

===================================================================
🎯 ระบบคะแนน
=============

การคำนวณคะแนนต่อ Stage:
- Max Score ต่อข้อ = 100 คะแนน
- ลดเนื่องจากเวลา = (เวลาที่ใช้ / เวลาสูงสุด) × 50
- ลดเนื่องจากผิด = จำนวนครั้งที่ผิด × 10

ดาว:
- 3 ดาว: > 90%
- 2 ดาว: > 70%
- 1 ดาว: > 50%
- 0 ดาว: < 50%

Rank System:
- Rank 1 (Novice): 0-99 EXP 🥚
- Rank 2 (Learner): 100-299 EXP 🐣
- Rank 3 (Master): 300-599 EXP 🦅
- Rank 4 (Expert): 600-999 EXP 🏆
- Rank 5 (Legend): 1000-1499 EXP 👑
- Rank 6 (Immortal): 1500+ EXP ⭐

EXP = คะแนน / 10

===================================================================
🛠️ การปรับแต่ง
================

เพิ่มสูตรใหม่:
1. เปิด Data.html
2. ค้นหา FORMULA_BANK array
3. เพิ่มอ็บเจ็ก formula ใหม่ตามรูปแบบ:

{
  id: 'unique_id',
  gradeId: 'm4',
  modeId: 'physics_formula',
  lessonId: 'linear_motion',
  topic: 'ชื่อหัวข้อ',
  formula: 'v = u + at',
  template: '[[v]] = [[u]] + [[a]][[t]]',
  slots: { v: 'v', u: 'u', a: 'a', t: 't' },
  level: 1,
  tags: ['basic', 'variable'],
  distractors: ['s', 'm', 'F', 'g'],
  hint: 'คำใบ้...',
  explain: 'คำอธิบาย...'
}

แสดงเศษส่วน:
<span class="frac">
  <span class="frac-top">v - u</span>
  <span class="frac-bottom">t</span>
</span>

เพิ่มบท/บทเรียน:
1. เปิด Data.html
2. ค้นหา LESSONS object
3. เพิ่มบทใหม่ในอาร์เรย์ของ m4.physics_formula:

{
  id: 'newton',
  name: 'แรงและกฎของนิวตัน',
  description: '...',
  active: false,  // เปลี่ยนเป็น true เพื่อเปิดใช้งาน
  icon: '⚡',
  order: 3
}

เพิ่มชั้นปี (ม.5, ม.6):
1. เปิด Data.html
2. ค้นหา LESSONS object
3. เพิ่มหมวด m5 และ m6 ด้วยโครงสร้างเดียวกัน

===================================================================
🐛 Troubleshooting
==================

ปัญหา: Deploy ไม่ได้
วิธีแก้:
- ตรวจสอบว่า Code.gs ไม่มี syntax error
- ลองสร้าง New Deployment แล้วก็ Redeploy

ปัญหา: ไม่สามารถบันทึกข้อมูล
วิธีแก้:
- ตรวจสอบว่า Google Sheet เปิดอยู่
- ตรวจสอบ SPREADSHEET_ID ถูกต้องหรือไม่
- ตรวจสอบ Permission ของ Sheet

ปัญหา: สูตรไม่แสดง
วิธีแก้:
- ตรวจสอบ Data.html ว่าสูตรอยู่ในอาร์เรย์ FORMULA_BANK หรือไม่
- ตรวจสอบ lessonId, gradeId, modeId ตรงกับที่เลือกหรือไม่
- ตรวจสอบ active: true ในหมวด lesson

ปัญหา: เศษส่วนแสดงผิด
วิธีแก้:
- ตรวจสอบ template ใน formula ใช้ HTML class ที่ถูกต้อง
- อ่างวagain CSS class .frac-top และ .frac-bottom

===================================================================
📱 PWA Features
===============

ไฟล์ที่ต้องเพิ่มเติมในอนาคต (Phase 2):
- manifest.json (ข้อมูล App)
- service-worker.js (Offline Support)
- icons (icon ต่างขนาด)

ปัจจุบัน Web App สามารถ:
- เข้าถึงได้ผ่าน URL
- Responsive บน Mobile
- บันทึกข้อมูลใน Google Sheet

ในอนาคต PWA ตัวเต็ม:
- สามารถติดตั้งได้บน Home Screen
- ทำงานได้ Offline
- Push Notification

===================================================================
📚 อ้างอิงทรัพยากร
==================

Google Apps Script Documentation:
https://developers.google.com/apps-script/overview

Google Sheets API:
https://developers.google.com/sheets/api

HTML Fractions Display:
ใช้ CSS display: flex กับ border-bottom สำหรับแสดงเศษส่วน

Game Design References:
- Stage Progression: Classic Level Design
- Difficulty Scaling: Difficulty Parameters
- Feedback System: Immediate Response

===================================================================
📧 Support & Updates
====================

Phase 1 (Current):
✅ Authentication (Student ID + PIN)
✅ Dashboard
✅ Pre-Test System
✅ Formula Arena (Easy/Medium/Hard/Hell)
✅ Linear Motion Lesson (ม.4)
✅ 16 Formulas Base Bank
✅ Scoring & Ranking System

Phase 2 (Planned):
⏳ PWA (Offline, Install)
⏳ More Lessons (Motion Types, Newton, etc.)
⏳ Extended Formula Bank
⏳ Analytics Dashboard for Teachers
⏳ ม.5 & ม.6 Content

Phase 3 (Future):
⏳ AppSheet Teacher Dashboard
⏳ Real-time Leaderboards
⏳ Social Features
⏳ Advanced Analytics
⏳ Customizable Content

===================================================================
📄 License
==========

PHYSIX Legends v1.0.0
Created for Educational Purposes
2024

ใช้งานได้อย่างอิสระในสถานศึกษา

===================================================================
Version: 1.0.0
Last Updated: June 2024
===================================================================
