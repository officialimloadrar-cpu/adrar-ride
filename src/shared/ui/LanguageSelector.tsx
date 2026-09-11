import { useLanguageStore } from '@/shared/config/i18n'
export function LanguageSelector() {
  const { setLang } = useLanguageStore()
  return (
    <div className="flex gap-2">
      <button onClick={() => setLang('ar')} className="px-4 py-2 rounded-xl border">العربية</button>
      <button onClick={() => setLang('fr')} className="px-4 py-2 rounded-xl border">Français</button>
      <button onClick={() => setLang('en')} className="px-4 py-2 rounded-xl border">English</button>
    </div>
  )
}
