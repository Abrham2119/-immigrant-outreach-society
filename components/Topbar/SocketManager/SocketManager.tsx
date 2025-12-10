import { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { Notification as NotificationType } from "@/domain/entities/notification";
import { SOCKET_URL } from "../constants/languages.constants";

interface SocketManagerProps {
  session: any;
  mounted: boolean;
  t: (key: string, fallback: string) => string;
  refetchUnreadCount: () => void;
  refetchUnseen: () => void;
  setRealtimeAlerts: (alerts: NotificationType[] | ((prev: NotificationType[]) => NotificationType[])) => void;
  setIsConnected: (connected: boolean) => void;
  setConnectionError: (error: string | null) => void;
}

export const SocketManager = ({
  session,
  mounted,
  t,
  refetchUnreadCount,
  refetchUnseen,
  setRealtimeAlerts,
  setIsConnected,
  setConnectionError
}: SocketManagerProps) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!mounted || !session) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("connect_error", () => {
      setConnectionError("Failed to connect to notification server");
      setIsConnected(false);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("reconnect", () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("emergency_alert", (data: any) => {
      const newAlert: NotificationType = {
        _id: `emergency-${Date.now()}`,
        employeeId: data.employeeId || 'system',
        title: 'Emergency Alert Triggered',
        message: data.message || 'Emergency situation reported. Please take immediate action.',
        type: 'emergency_alert',
        relatedClient: data.clientId,
        delivered: false,
        seen: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        client: data.client,
        employee: data.employee,
      };

      setRealtimeAlerts(prev => [newAlert, ...prev.slice(0, 9)]);

      if (typeof window !== 'undefined' && "Notification" in window && window.Notification.permission === "granted") {
        new window.Notification(t('emergencyAlert', 'Emergency Alert'), {
          body: data.message,
          icon: "/assets/canada.svg",
          tag: 'emergency',
        });
      } else if (typeof window !== 'undefined' && "Notification" in window && window.Notification.permission === "default") {
        window.Notification.requestPermission();
      }

      refetchUnreadCount();
      refetchUnseen();
    });

    if (typeof window !== "undefined" && "Notification" in window && window.Notification.permission === "default") {
      window.Notification.requestPermission();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [mounted, session, t, refetchUnreadCount, refetchUnseen, setRealtimeAlerts, setIsConnected, setConnectionError]);

  return null;
};