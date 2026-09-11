import { Link } from 'react-router-dom'
import { useLang, translations } from '../App'

export default function Home() {
  const { lang } = useLang()
  const t = translations[lang]
  return (
    <div style={{padding:'80px 0 0'}}>
      <h1 style={{fontSize:72,margin:0,fontWeight:900,letterSpacing:-4,lineHeight:1}}>RIDE</h1>
      <div style={{display:'flex',gap:12,marginTop:36}}>
        <Link to="/request-ride" style={{background:'#111',color:'#fff',padding:'14px 22px',borderRadius:12,textDecoration:'none',fontWeight:600}}>{t.ride}</Link>
        <Link to="/request-parcel" style={{background:'#fff',color:'#111',padding:'14px 22px',borderRadius:12,border:'1px solid #e5e7eb',textDecoration:'none',fontWeight:600}}>{t.parcel}</Link>
      </div>
    </div>
  )
}
