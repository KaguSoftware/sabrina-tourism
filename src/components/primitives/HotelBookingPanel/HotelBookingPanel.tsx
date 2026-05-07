"use client";
import { useState } from "react";
import { DateRangePicker } from "@/components/primitives/DateRangePicker/DateRangePicker";
import type { RoomType } from "@/lib/regions/hotels";

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseYMD(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatShort(s: string) {
  return parseYMD(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

interface HotelBookingPanelProps {
  hotelName: string;
  region: string;
  roomTypes: RoomType[];
  selectedRoomIndex: number;
  onRoomSelect: (i: number) => void;
  waPhone?: string;
}

export function HotelBookingPanel({ hotelName, region, roomTypes, selectedRoomIndex, onRoomSelect, waPhone }: HotelBookingPanelProps) {
  const today = toYMD(new Date());
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [guestError, setGuestError] = useState("");

  const selectedRoom = roomTypes[selectedRoomIndex];
  const needsMultipleRooms = selectedRoom && guests > selectedRoom.capacity;
  const suggestedRooms = selectedRoom ? Math.ceil(guests / selectedRoom.capacity) : 1;

  function handleGuestChange(val: string) {
    const num = parseInt(val, 10);
    setGuests(isNaN(num) ? 1 : num);
    if (!isNaN(num) && num > 0 && selectedRoom && num > selectedRoom.capacity) {
      setRooms(Math.ceil(num / selectedRoom.capacity));
    }
    if (isNaN(num) || num < 1) {
      setGuestError("Please enter at least 1 guest.");
    } else if (num > 100) {
      setGuestError("For very large groups, please contact us directly.");
    } else {
      setGuestError("");
    }
  }

  const nights = checkIn && checkOut
    ? Math.round((parseYMD(checkOut).getTime() - parseYMD(checkIn).getTime()) / 86_400_000)
    : 0;

  const hasError = !!guestError;
  const canEnquire = checkIn && checkOut && !hasError && guests >= 1;

  const waMessage = [
    `Hi, I'd like to enquire about ${hotelName} in ${region}.`,
    selectedRoom ? `Room type: ${selectedRoom.name} (up to ${selectedRoom.capacity} guests per room).` : "",
    `Guests: ${guests}.`,
    needsMultipleRooms ? `Rooms needed: ${rooms}× ${selectedRoom!.name}.` : "",
    checkIn && checkOut
      ? `Dates: ${formatShort(checkIn)} → ${formatShort(checkOut)} (${nights} night${nights !== 1 ? "s" : ""}).`
      : "",
  ].filter(Boolean).join(" ");

  const waHref = `https://wa.me/${waPhone ?? ""}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="border border-rule">
      {/* Room type selector */}
      <div className="border-b border-rule p-5">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Room type</p>
        <div className="flex flex-col gap-2">
          {roomTypes.map((room, i) => {
            const overCapacity = guests > room.capacity;
            const isSelected = i === selectedRoomIndex;
            return (
              <button
                key={room.name}
                type="button"
                onClick={() => { onRoomSelect(i); if (overCapacity) handleGuestChange(String(guests)); }}
                className={[
                  "w-full text-left px-3 py-3 border transition-all duration-150",
                  isSelected
                    ? "border-ochre bg-ochre/5"
                    : overCapacity
                    ? "border-rule opacity-50 cursor-pointer hover:opacity-80"
                    : "border-rule hover:border-ochre/40",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`font-display text-[13px] leading-snug ${isSelected ? "text-ochre" : "text-ink"}`}>
                      {room.name}
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted mt-0.5">
                      {room.beds} · {room.size}
                    </p>
                  </div>
                  <span className={`shrink-0 font-mono text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 mt-0.5 ${
                    isSelected ? "bg-ochre text-navy" : "bg-cream-deep text-muted"
                  }`}>
                    {room.capacity} guest{room.capacity > 1 ? "s" : ""}
                  </span>
                </div>
                {isSelected && room.highlights.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {room.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted">
                        <span className="w-1 h-1 bg-ochre shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guest count + rooms */}
      <div className="border-b border-rule p-5 space-y-4">
        <div>
          <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
            Number of guests
          </label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => handleGuestChange(e.target.value)}
            className={[
              "w-full bg-cream-deep border px-3 py-2.5 text-[15px] text-ink focus:outline-none transition-colors duration-150",
              hasError ? "border-terracotta focus:border-terracotta" : "border-rule focus:border-ochre",
            ].join(" ")}
          />
          {hasError && (
            <p className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-terracotta leading-snug">
              {guestError}
            </p>
          )}
          {!hasError && selectedRoom && !needsMultipleRooms && (
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-muted">
              Room fits up to {selectedRoom.capacity} guest{selectedRoom.capacity > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {needsMultipleRooms && !hasError && (
          <div className="border border-ochre/30 bg-ochre/5 p-3">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-ochre mb-2">
              Multiple rooms needed
            </p>
            <p className="font-sans text-[12px] text-ink-soft mb-3 leading-snug">
              {selectedRoom.name} fits {selectedRoom.capacity} guests. Adjust how many rooms you need:
            </p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setRooms((r) => Math.max(suggestedRooms, r - 1))}
                className="w-8 h-8 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-lg leading-none">−</button>
              <span className="font-mono text-[15px] text-ink min-w-[2ch] text-center">{rooms}</span>
              <button type="button" onClick={() => setRooms((r) => r + 1)}
                className="w-8 h-8 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-lg leading-none">+</button>
              <span className="font-mono text-[11px] text-muted">× {selectedRoom.name}</span>
            </div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted mt-2">
              Fits up to {rooms * selectedRoom.capacity} guests total
            </p>
          </div>
        )}
      </div>

      {/* Date picker */}
      <div className="p-5">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Dates</p>
        <DateRangePicker
          start={checkIn}
          end={checkOut}
          onChange={(s, e) => { setCheckIn(s); setCheckOut(e); }}
          min={today}
          placeholder="Select check-in → check-out"
        />

        {/* Message preview */}
        {waMessage && (
          <div className="mt-4 mb-1 border-l-2 border-ochre bg-cream-deep p-3">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted mb-1.5">Message preview</p>
            <p className="font-sans text-[12px] text-ink-soft leading-snug">{waMessage}</p>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4">
          <a
            href={canEnquire ? waHref : undefined}
            onClick={canEnquire ? undefined : (e) => e.preventDefault()}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!canEnquire}
            style={{ backgroundColor: "#0b1a2e", color: canEnquire ? "#c99a3f" : "#7a7a6a" }}
            className={["inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[12px] tracking-[0.14em] uppercase font-semibold transition-all duration-300",
              canEnquire ? "hover:scale-[1.02] shadow-[0_4px_20px_-6px_rgba(11,26,46,0.4)] cursor-pointer" : "cursor-not-allowed opacity-60",
            ].join(" ")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-whatsapp.svg" alt="" aria-hidden="true" width="14" height="14"
              style={{ filter: canEnquire ? "brightness(0) saturate(100%) invert(68%) sepia(50%) saturate(500%) hue-rotate(5deg) brightness(95%)" : "brightness(0) invert(50%)" }}
            />
            {canEnquire ? "Send enquiry via WhatsApp" : "Complete the form above"}
          </a>
        </div>
      </div>
    </div>
  );
}
