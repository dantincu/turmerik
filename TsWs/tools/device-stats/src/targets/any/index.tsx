import React from 'react';
import { createRoot } from 'react-dom/client';

import "../../styles/index-any.scss"
import App from '../../app/App';

const container = document.getElementById('app-root')!;
const root = createRoot(container);
root.render(<App />);
