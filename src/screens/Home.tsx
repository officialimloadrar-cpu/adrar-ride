import { Link } from 'react-router-dom'
import { useLang, translations } from '../App'

export default function Home() {
  const { lang } = useLang()
  const t = translations[lang]
  return (
    <div style={{padding:'32px 0'}}>
      <h1 style={{fontSize:48,margin:0,letterSpacing:-2,fontWeight:900}}>RIDE</h1>
      <p style={{color:'#6b7280',fontSize:18,maxWidth:480,marginTop:12}}>{t.sub}</p>
      <div style={{display:'flex',gap:12,marginTop:20}}>
        <Link to="/request-ride" style={{background:'#111',color:'#fff',padding:'12px 18px',borderRadius:12,textDecoration:'none',fontWeight:600}}>{t.ride}</Link>
        <Link to="/request-parcel" style={{background:'#fff',color:'#111',padding:'12px 18px',borderRadius:12,border:'1px solid #e5e7eb',textDecoration:'none',fontWeight:600}}>{t.parcel}</Link>
      </div>
    </div>
  )
}
