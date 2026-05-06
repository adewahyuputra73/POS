import { useEffect, useRef, useCallback, useState } from "react";
import { notificationService } from "@/features/notifications";

const POLL_INTERVAL_MS = 30_000; // 30 detik
const SEEN_KEY = "kodeka_seen_notif_ids";
const PERM_ASKED_KEY = "kodeka_notif_perm_asked";

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids: Set<string>) {
  try {
    // Simpan maks 300 ID terakhir agar localStorage tidak membesar
    const arr = [...ids].slice(-300);
    localStorage.setItem(SEEN_KEY, JSON.stringify(arr));
  } catch { /* silent */ }
}

export function useDesktopNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [unreadCount, setUnreadCount] = useState(0);
  const [permAsked, setPermAsked] = useState(false);
  const isFirstPoll = useRef(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sinkronisasi permission & permAsked dari browser/localStorage saat mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    setPermAsked(!!localStorage.getItem(PERM_ASKED_KEY));
  }, []);

  /** Minta izin notifikasi desktop dari user */
  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    localStorage.setItem(PERM_ASKED_KEY, "1");
    setPermAsked(true);
  }, []);

  const pollAndNotify = useCallback(async () => {
    try {
      const res = await notificationService.list({ unread: true, limit: 20 });
      setUnreadCount(res.unread_count ?? 0);

      const notifications = res.notifications ?? [];

      // Poll pertama: tandai semua yang ada sekarang sebagai "sudah dilihat"
      // agar tidak spam notifikasi lama saat halaman pertama dibuka
      if (isFirstPoll.current) {
        isFirstPoll.current = false;
        const seenIds = getSeenIds();
        notifications.forEach((n) => seenIds.add(n.id));
        saveSeenIds(seenIds);
        return;
      }

      // Hanya tampilkan notifikasi desktop jika permission granted
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      const seenIds = getSeenIds();
      const newNotifs = notifications.filter((n) => !n.is_read && !seenIds.has(n.id));

      newNotifs.forEach((n) => {
        // Tambahkan ke seenIds dulu agar tidak muncul 2x di poll berikutnya
        seenIds.add(n.id);

        const notif = new Notification(n.title, {
          body: n.body || undefined,
          icon: "/favicon.ico",
          // tag mencegah duplikat notifikasi dengan ID yang sama
          tag: `kodeka-pos-${n.id}`,
        });

        // Klik notifikasi → fokus tab POS + buka detail order jika ada order_id
        notif.onclick = () => {
          window.focus();
          notif.close();
          const orderId = n.data?.order_id;
          const type = (n.type ?? "").toLowerCase();
          const isOrderNotif =
            orderId ||
            type.includes("order") ||
            type.includes("payment") ||
            type.includes("transaksi");
          if (isOrderNotif) {
            const path = orderId
              ? `/transactions?orderId=${orderId}`
              : "/transactions";
            window.location.href = path;
          }
        };
      });

      saveSeenIds(seenIds);
    } catch { /* silent — jangan interrupt UI jika polling gagal */ }
  }, []);

  // Mulai polling saat hook mount
  useEffect(() => {
    pollAndNotify();
    intervalRef.current = setInterval(pollAndNotify, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pollAndNotify]);

  return {
    /** Status izin notifikasi: "default" | "granted" | "denied" */
    permission,
    /** Jumlah notifikasi belum dibaca (diperbarui tiap 30 detik) */
    unreadCount,
    /** Fungsi untuk meminta izin notifikasi dari browser */
    requestPermission,
    /** Apakah user sudah pernah ditanya izin (untuk menampilkan prompt) */
    permAsked,
    /** Apakah browser mendukung Web Notifications API */
    isSupported: typeof window !== "undefined" && "Notification" in window,
  };
}
