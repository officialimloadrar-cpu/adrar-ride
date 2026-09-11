import { useDriverDebt } from "@/entities/driver/model/useDriverDebt";
type Props = { accumulated: number; expiresAt?: string | null };
export function WalletBlockedCard({ accumulated, expiresAt }: Props) {
  const { timer, limit, debt, isBlocked } = useDriverDebt(accumulated, expiresAt);
  if (!isBlocked) return null;
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
      <div className="font-bold text-red-700">المحفظة محظورة</div>
      <div className="text-sm">الدين: {debt} / {limit} دج</div>
      <div className="text-sm">متبقي: {timer}</div>
    </div>
  );
}
