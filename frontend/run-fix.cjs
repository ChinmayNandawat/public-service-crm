const fs = require('fs');
let code = fs.readFileSync('src/pages/ManageComplaints.tsx', 'utf8');

// 1. Remove all dark: modifiers for slate colors
code = code.replace(/dark:(bg|text|border|divide|hover:bg|hover:text)-slate-\d+(?:\/\d+)?\s?/g, '');
code = code.replace(/dark:text-white\s?/g, '');
code = code.replace(/text-slate-950/g, 'text-slate-50');

// 2. Map existing 'light' classes to proper 'dark' base classes for auto-flipping
code = code.replace(/bg-white/g, 'bg-slate-900');
code = code.replace(/bg-slate-50(?=\s|\/|")/g, 'bg-slate-800');
code = code.replace(/bg-slate-100(?=\s|\/|")/g, 'bg-slate-800');
code = code.replace(/bg-slate-200(?=\s|\/|")/g, 'bg-slate-700');

code = code.replace(/text-slate-900(?=\s|\/|")/g, 'text-slate-50');
code = code.replace(/text-slate-800(?=\s|\/|")/g, 'text-slate-100');
code = code.replace(/text-slate-700(?=\s|\/|")/g, 'text-slate-200');
code = code.replace(/text-slate-600(?=\s|\/|")/g, 'text-slate-300');
code = code.replace(/text-slate-500(?=\s|\/|")/g, 'text-slate-400');

code = code.replace(/border-slate-100(?=\s|\/|")/g, 'border-slate-800');
code = code.replace(/border-slate-200(?=\s|\/|")/g, 'border-slate-700');
code = code.replace(/border-slate-300(?=\s|\/|")/g, 'border-slate-600');

code = code.replace(/divide-slate-100(?=\s|\/|")/g, 'divide-slate-800');
code = code.replace(/divide-slate-200(?=\s|\/|")/g, 'divide-slate-700');

// Handle hover specific mapped
code = code.replace(/hover:bg-slate-50(?=\s|\/|")/g, 'hover:bg-slate-800/50');
code = code.replace(/hover:bg-slate-100(?=\s|\/|")/g, 'hover:bg-slate-800');
code = code.replace(/hover:text-slate-700(?=\s|\/|")/g, 'hover:text-slate-300');
code = code.replace(/hover:text-slate-800(?=\s|\/|")/g, 'hover:text-slate-200');
code = code.replace(/hover:text-slate-900(?=\s|\/|")/g, 'hover:text-slate-100');

// Cleanup double spaces inside className strings
code = code.replace(/className=\"(.*?)\"/g, (match, p1) => {
  return 'className=\"' + p1.replace(/\s+/g, ' ').trim() + '\"';
});

fs.writeFileSync('src/pages/ManageComplaints.tsx', code);
