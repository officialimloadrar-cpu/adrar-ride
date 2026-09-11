import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'ar' | 'fr' | 'en'
export const translations = {
  ar: { sub: "منصة الرحلات والطرود. تسعيرة حسب المسافة. تعمل في أي مدينة.", ride: "طلب رحلة", parcel: "إرسال طرد" },
  fr: { sub: "Plateforme de courses et colis. Tarif basé sur la distance.", ride: "Demander un trajet", parcel: "Envoyer un colis" },
  en: { sub: "Universal Ride & Parcel Platform. Distance-based pricing.", ride: "Request Ride", parcel: "Send Parcel" },
} as const

type Ctx = { lang: Language; setLang: (l: Language) => void }
const LangCtx = createContext<Ctx | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('app-lang') as Language) || 'ar')
  useEffect(() => {
    localStorage.setItem('app-lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar'? 'rtl' : 'ltr'
  }, [lang])
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

export function useLang() {
  const c = useContext(LangCtx)
  if (!c) throw new Error('useLang must be inside LanguageProvider')
  return c
}

const NAV_LINKS = [
  { to: '/request-ride', label: 'Ride' },
  { to: '/request-parcel', label: 'Parcel' },
  { to: '/driver', label: 'Driver' },
  { to: '/admin', label: 'Admin' },
] as const

function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  const langs: Language[] = ['ar','fr','en']
  return (
    <div style={{display:'flex',gap:3,background:'#f3f4f6',padding:3,borderRadius:99,marginLeft:8}}>
      {langs.map(l => (
        <button key={l} onClick={()=>setLang(l)} style={{padding:'6px 10px',borderRadius:99,border:'none',background: lang===l? '#111':'transparent', color: lang===l? '#fff':'#111', cursor:'pointer', fontSize:13, fontWeight:600}}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}

function Header() {
  return (
    <header style={{position:'sticky',top:0,zIndex:10,background:'rgba(255,255,255,.85)',backdropFilter:'blur(12px)',borderBottom:'1px solid #e5e7eb'}}>
      <div style={{maxWidth:1120,margin:'0 auto',padding:'0 20px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link to="/" style={{fontWeight:800,fontSize:20,textDecoration:'none',color:'#111'}}>RIDE</Link>
        <nav style={{display:'flex',gap:8,alignItems:'center'}}>
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} style={({isActive})=>({padding:'8px 14px',borderRadius:10,background:isActive?'#111':'#fff',color:isActive?'#fff':'#111',border:'1px solid #e5e7eb',textDecoration:'none',fontSize:14})}>{link.label}</NavLink>
          ))}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}

import Home from './screens/Home'
import RequestRide from './screens/ClientRequestCorsa'
import RequestParcel from './screens/ClientRequestColis'
import Driver from './screens/DriverDualMode'
import Admin from './screens/AdminSettlements'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Header />
        <main style={{maxWidth:1120,margin:'0 auto',padding:'24px 20px 64px'}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request-ride" element={<RequestRide />} />
            <Route path="/request-parcel" element={<RequestParcel />} />
            <Route path="/driver" element={<Driver />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </BrowserRouter>
    </LanguageProvider>
  )
}
