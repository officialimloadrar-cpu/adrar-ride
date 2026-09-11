import { useTranslation } from 'react-i18next'
import { RideRequest } from '@/features/ride/ui/RideRequest'
import { ColisRequest } from '@/features/colis/ui/ColisRequest'
import { CargoRequest } from '@/features/cargo/ui/CargoRequest'
import { RentalRequest } from '@/features/rental/ui/RentalRequest'
import { MaklaRequest } from '@/features/makla/ui/MaklaRequest'

export default function ClientPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-zinc-50 p-4 space-y-4">
      <h1 className="text-2xl font-bold">{t('client')} - {t('all_services')}</h1>
      <RideRequest />
      <ColisRequest />
      <CargoRequest />
      <RentalRequest />
      <MaklaRequest />
    </div>
  )
}
