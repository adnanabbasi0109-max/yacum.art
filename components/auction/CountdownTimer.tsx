"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endTime: string;
}

function getTimeLeft(endTime: string) {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    ended: false,
  };
}

function getUrgencyColor(endTime: string) {
  const diff = new Date(endTime).getTime() - Date.now();
  const hours = diff / (1000 * 60 * 60);
  if (hours <= 0) return "text-text-secondary";
  if (hours <= 1) return "text-auction-red animate-pulse";
  if (hours <= 24) return "text-auction-red";
  if (hours <= 48) return "text-amber-400";
  return "text-gold";
}

export default function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [time, setTime] = useState(getTimeLeft(endTime));
  const color = getUrgencyColor(endTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (time.ended) {
    return (
      <div className="text-text-secondary font-[family-name:var(--font-mono)] text-lg tracking-wider">
        AUCTION ENDED
      </div>
    );
  }

  const units = [
    { label: "DD", value: time.days },
    { label: "HH", value: time.hours },
    { label: "MM", value: time.minutes },
    { label: "SS", value: time.seconds },
  ];

  return (
    <div className="flex gap-2">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="bg-bg-secondary border border-border-subtle px-3 py-2 min-w-[52px] text-center">
            <span className={`font-[family-name:var(--font-mono)] text-xl ${color}`}>
              {String(unit.value).padStart(2, "0")}
            </span>
            <p className="text-text-secondary text-[9px] mt-0.5 tracking-wider">
              {unit.label}
            </p>
          </div>
          {i < units.length - 1 && (
            <span className={`${color} text-lg font-light`}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}
