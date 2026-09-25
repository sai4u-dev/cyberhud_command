import { io } from "socket.io-client";
import env from "../config/env.js";

/**
 * Realtime battle socket — mirrors backend/src/realtime/io.js.
 * - Connect lazily after login with the access token.
 * - Subscribe per battle room: subscribeBattle(battleId, handlers).
 * - No token → no connection (REST remains fully functional).
 */

let socket = null;

export const connectBattleSocket = (accessToken) => {
  if (socket?.connected) return socket;
  if (!accessToken) return null;

  const base = new URL(env.apiUrl);
  const socketUrl = `${base.protocol}//${base.host}`;

  socket = io(socketUrl, {
    path: "/api/socket.io",
    auth: { token: accessToken },
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
    timeout: 10000,
  });

  return socket;
};

export const subscribeBattle = (battleId, handlers = {}) => {
  if (!socket) return () => {};
  socket.emit("battle:subscribe", battleId);
  const events = [
    "battle:joined",
    "battle:left",
    "battle:ready",
    "battle:started",
    "battle:finished",
    "battle:cancelled",
  ];
  events.forEach((e) => {
    if (handlers[e]) socket.on(e, handlers[e]);
  });
  return () => {
    socket.emit("battle:unsubscribe", battleId);
    events.forEach((e) => {
      if (handlers[e]) socket.off(e, handlers[e]);
    });
  };
};

export const disconnectBattleSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const getBattleSocket = () => socket;
