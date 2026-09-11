import { useLanguageStore } from '@/shared/config/i18n'
import { useTranslation } from 'react-i18next'
export function LanguageGate() {
  const { setLang } = useLanguageStore()
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-zinc-50 p-6">
      <h1 className="text-3xl font-bold">IMR Adrar / Wassli</h1>
      <p className="text-zinc-600">Choose language / Choisissez la langue / اختر اللغة</p>
      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        <button onClick={() => setLang('ar')} className="h-14 rounded-2xl bg-black text-white text-lg">العربية</button>
        <button onClick={() => setLang('fr')} className="h-14 rounded-2xl border bg-white text-lg">Français</button>
        <button onClick={() => setLang('en')} className="h-14 rounded-2xl border bg-white text-lg">English</button>
      </div>
    </div>
  )
}
