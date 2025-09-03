"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const ACCENT = "#D4AF37";

export default function HackPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden text-zinc-200">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hack.png)" }}
        />
        <div className="absolute inset-0 bg-black/70" />
        {/* grade sutil “hacker” */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
      </div>
      <CornerAssistant />
    </main>
  );
}

function Typewriter({
  lines,
  speed = 28,
  onDone,
  forceDoneSignal,
}: {
  lines: string[];
  speed?: number;
  onDone?: () => void;
  forceDoneSignal?: boolean;
}) {
  const full = useMemo(() => lines.join("\n"), [lines]);
  const [idx, setIdx] = useState(0);

  // reset ao trocar de "lines"
  useEffect(() => {
    setIdx(0);
  }, [full]);

  // efeito de digitação
  useEffect(() => {
    if (forceDoneSignal) {
      setIdx(full.length);
      return;
    }
    if (idx >= full.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setIdx((v) => v + 1), speed);
    return () => clearTimeout(t);
  }, [idx, full, speed, forceDoneSignal, onDone]);

  const shown = full.slice(0, idx);
  const arr = shown.split("\n");

  return (
    <div className="space-y-2">
      {arr.map((t, i) => (
        <p
          key={i}
          className="font-[var(--font-hq)] text-[18px] leading-[1.25] tracking-[0.2px] md:text-[20px]"
        >
          {t}
          {i === arr.length - 1 && idx < full.length && (
            <span className="ml-1 inline-block h-4 w-2 translate-y-[2px] animate-pulse bg-zinc-700/70 align-middle rounded-sm" />
          )}
        </p>
      ))}
    </div>
  );
}

function CornerAssistant() {
  // os três “balões”
  const SCRIPT: string[][] = [
    ["⚠️ Conexão detectada…", "Iniciando invasão à Caixa de Memórias…"],
    ["Decodificando lembranças… 42%", "Ajustando chaves quânticas…"],
    ["Pronto para abrir um atalho secreto?", "Toque para confirmar…"],
  ];

  const [step, setStep] = useState(0); // 0..2
  const [typingDone, setTypingDone] = useState(false);
  const [forceDone, setForceDone] = useState(false);

  const isLast = step >= SCRIPT.length - 1;

  const handleBubbleClick = () => {
    // se ainda digitando, completa instantâneo
    if (!typingDone) {
      setForceDone(true);
      return;
    }
    // já terminou: avança para o próximo (se houver)
    if (!isLast) {
      setStep((s) => s + 1);
      setTypingDone(false);
      setForceDone(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-3 right-4 z-40 max-w-[96vw]">
      <div className="relative pointer-events-auto w-[260px] md:w-[340px] lg:w-[400px]">
        {/* Balão acima, sobrepondo o robô */}
        <div className="absolute -top-12 md:-top-16 right-1 z-10 mr-20">
          <SpeechBubbleRight onClick={handleBubbleClick}>
            <Typewriter
              lines={SCRIPT[step]}
              speed={26}
              forceDoneSignal={forceDone}
              onDone={() => setTypingDone(true)}
            />
            {/* dica clicável */}
            <div className="mt-2 text-[12px] font-medium text-[#0f0f10]/60">
              {typingDone ? "Clique para continuar" : "Digitando… toque para pular"}
            </div>
          </SpeechBubbleRight>
        </div>

        {/* ROBÔ */}
        <motion.div
          initial={{ y: 22, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="relative"
        >
          <Image
            src="/models/robot.png"
            alt="Robô invasor"
            width={600}
            height={600}
            priority
            className="h-auto w-full select-none drop-shadow-[0_0_24px_rgba(212,175,55,0.35)]"
          />
          <div
            className="pointer-events-none absolute -inset-5 -z-10 rounded-full blur-2xl"
            style={{
              background: `radial-gradient(60% 60% at 50% 50%, ${ACCENT}2a, transparent 70%)`,
            }}
          />
        </motion.div>

        {/* Botão “Linha do tempo” depois do 3º balão */}
        {isLast && typingDone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <Link
              href="/timeline"
              className="inline-flex items-center rounded-xl border border-amber-400/60 bg-amber-600/30 px-6 py-3 text-lg font-semibold text-amber-200 hover:bg-amber-500/40 hover:text-amber-100 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
            >
              Ver linha do tempo →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function SpeechBubbleRight({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      className="relative w-fit max-w-[min(92vw,560px)] cursor-pointer select-none"
      onClick={onClick}
    >
      <div className="rounded-[24px] border-[3px] border-[#0f0f10] bg-[#F5F1E9] px-6 py-5 text-[#0f0f10] shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
        <div className="text-[16px] leading-[1.25] font-semibold tracking-[0.2px]">
          {children}
        </div>
      </div>
      <div
        className="absolute right-4 -bottom-[8px] h-5 w-5 rotate-45 bg-[#F5F1E9] border-b-[3px] border-r-[3px] border-[#0f0f10] rounded-[5px]"
        aria-hidden
      />
    </div>
  );
}
