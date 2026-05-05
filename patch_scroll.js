const fs = require('fs');
let code = fs.readFileSync('src/components/Temp.tsx', 'utf-8');

// We need to add useRef
code = code.replace(/import \{ useState \} from 'react';/, "import { useState, useRef } from 'react';");

fs.writeFileSync('src/components/Temp.tsx', code);
