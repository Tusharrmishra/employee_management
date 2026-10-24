# Staffroll HRMS: frontend (mock data)
Run: `npm install && npm run dev`  ·  Tests: `npm test`
Demo logins (password `demo123`): admin@demo.com, hr@demo.com, manager@demo.com, employee@demo.com
All data lives in memory (`src/context/Store.jsx`, seeded from `src/data/mock.js`) and resets on refresh.
To connect the backend later, replace `mutate()` calls with API requests, page by page.
Not yet included: salary-structure editor, holiday/leave-type CRUD UI, document uploads, XLSX/PDF reports, ZIP payslips.
