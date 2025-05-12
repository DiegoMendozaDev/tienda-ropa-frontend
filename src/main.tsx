import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')!).render(
  <>
  <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CookiesProvider>
  </>

)
