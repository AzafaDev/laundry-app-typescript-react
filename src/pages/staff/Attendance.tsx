import { useEffect, useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useTodayAttendanceQuery } from "../../hooks/attendance/useTodayAttendanceQuery";
import { useCurrentShiftQuery } from "../../hooks/attendance/useCurrentShiftQuery";
import { useCheckInMutation } from "../../hooks/attendance/useCheckInMutation";
import { useCheckOutMutation } from "../../hooks/attendance/useCheckOutMutation";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Card } from "../../components/ui/Card";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function getGeolocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Browser kamu tidak mendukung geolokasi"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10_000 });
  });
}

export function Attendance() {
  const now = useClock();
  const [geoError, setGeoError] = useState<string | null>(null);
  const todayQuery = useTodayAttendanceQuery();
  const shiftQuery = useCurrentShiftQuery();
  const checkInMutation = useCheckInMutation();
  const checkOutMutation = useCheckOutMutation();

  const today = todayQuery.data?.data ?? null;
  const shift = shiftQuery.data?.data ?? null;
  const hasCheckedIn = !!today?.check_in_time;
  const hasCheckedOut = !!today?.check_out_time;

  const handleCheckIn = async () => {
    setGeoError(null);
    try {
      const position = await getGeolocation();
      checkInMutation.mutate(
        { latitude: position.coords.latitude, longitude: position.coords.longitude },
        { onSuccess: () => toast.success("Check-in berhasil") },
      );
    } catch {
      setGeoError("Gagal mengambil lokasi. Izinkan akses lokasi di browser lalu coba lagi.");
    }
  };

  const handleCheckOut = async () => {
    setGeoError(null);
    try {
      const position = await getGeolocation();
      checkOutMutation.mutate(
        { latitude: position.coords.latitude, longitude: position.coords.longitude },
        { onSuccess: () => toast.success("Check-out berhasil") },
      );
    } catch {
      // Location is optional for check-out (CheckOutRequest fields are
      // nullable) — fall back to submitting without coordinates instead
      // of blocking the action entirely.
      checkOutMutation.mutate({}, { onSuccess: () => toast.success("Check-out berhasil") });
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <div>
        <Eyebrow className="mb-2">Absensi</Eyebrow>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Catat kehadiran hari ini.</h1>
      </div>

      <Card className="flex flex-col items-center gap-1 py-8 text-center">
        <span className="font-mono text-4xl md:text-5xl font-bold tabular-nums text-on-surface">
          {now.toLocaleTimeString("id-ID")}
        </span>
        <span className="text-sm text-on-surface-variant">
          {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
          <Clock className="w-4 h-4 text-primary" />
          Shift hari ini
        </div>
        {shiftQuery.isLoading && <p className="text-sm text-on-surface-variant">Memuat...</p>}
        {!shiftQuery.isLoading && !shift && <p className="text-sm text-on-surface-variant">Kamu tidak punya jadwal shift hari ini.</p>}
        {shift && (
          <p className="text-sm text-on-surface-variant">
            {shift.name} &middot;{" "}
            {new Date(shift.start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} -{" "}
            {new Date(shift.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </Card>

      <Card className="space-y-4">
        <p className="text-sm font-bold text-on-surface">Status hari ini</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-on-surface-variant text-xs">Check-in</p>
            <p className="font-medium text-on-surface">
              {today?.check_in_time ? new Date(today.check_in_time).toLocaleTimeString("id-ID") : "-"}
            </p>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs">Check-out</p>
            <p className="font-medium text-on-surface">
              {today?.check_out_time ? new Date(today.check_out_time).toLocaleTimeString("id-ID") : "-"}
            </p>
          </div>
        </div>

        {geoError && <p className="text-xs text-error">{geoError}</p>}
        <ApiErrorMessage error={checkInMutation.error ?? checkOutMutation.error} />

        {!hasCheckedIn && (
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={checkInMutation.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {checkInMutation.isPending ? "Memproses..." : "Check-in"}
          </button>
        )}
        {hasCheckedIn && !hasCheckedOut && (
          <button
            type="button"
            onClick={handleCheckOut}
            disabled={checkOutMutation.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {checkOutMutation.isPending ? "Memproses..." : "Check-out"}
          </button>
        )}
        {hasCheckedIn && hasCheckedOut && (
          <p className="text-sm text-center text-on-surface-variant">Absensi hari ini sudah selesai.</p>
        )}
      </Card>
    </main>
  );
}
