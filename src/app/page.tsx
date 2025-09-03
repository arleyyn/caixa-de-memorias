"use client";

import { Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Gift, ArrowRight } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

const FRIEND_NAME = "Esther";
const ACCENT = "#D4AF37";
const MODEL_URL = "/models/caixa.glb";
const DRACO_PATH = "/draco/";

useGLTF.setDecoderPath(DRACO_PATH);
useGLTF.preload(MODEL_URL);

export default function Home() {
  return (
    <main className="relative grid h-dvh grid-rows-[auto_1fr_auto] overflow-hidden text-zinc-200">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/images/retro-city-bg.png"
          alt="Plano de fundo"
          className="h-full w-full object-cover object-right-bottom"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <nav className="row-start-1 row-end-2 z-30 mx-auto w-full max-w-6xl px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between">
          <div className="select-none font-medium tracking-[0.2em] text-zinc-300">
            <span className="mr-2 text-[10px] align-super">◦</span>CAIXA·DE·MEMÓRIAS<span className="ml-2 text-[10px] align-super">◦</span>
          </div>
        </div>
      </nav>

      <section className="row-start-2 row-end-3 mx-auto flex h-full w-full max-w-6xl items-center px-4 lg:px-6">
        <div className="grid h-full w-full min-h-0 grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="space-y-6">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Boa noite Estherzinha,
                <br />
                Nesse dia especial tenho um {" "}
                <span
                  className="[text-shadow:0_0_24px_rgba(212,175,55,0.5)]"
                  style={{ color: ACCENT }}
                >
                  presente {" "}
                </span>
                para você:
                .
              </h1>

            <p className="text-pretty text-base leading-relaxed text-zinc-200 md:text-lg">
              Nossa amizade já completa 5 anos, e nesse tempo vivemos juntos muitos momentos alegres, desafiadores, estressantes e até tristes. 
              Tive o privilégio de compartilhar cada um deles ao seu lado, e por isso preparei uma 
              <span className="font-semibold" style={{ color: ACCENT }}> Caixa de Memórias </span> 
              com alguns desses instantes especiais. Espero que goste.
            </p>


            <Link href="/hack" className="inline-block">
              <Button size="lg" className="group border border-zinc-700 bg-zinc-950 hover:bg-zinc-900">
                <Gift className="mr-2 h-4 w-4 transition-transform group-hover:-rotate-6" />
                Abrir a caixa
                <ArrowRight className="ml-2 h-4 w-4 translate-x-0 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="relative h-full min-h-0">
            <div className="mx-auto h-full max-h-[min(70vh,520px)] w-full max-w-[720px]">
              <Canvas
                camera={{ position: [1.8, 1.3, 2.2], fov: 50 }}
                dpr={[1, 2]}
                gl={{ alpha: true, preserveDrawingBuffer: true }}
              >
                <ambientLight intensity={0.2} />
                <directionalLight position={[3, 3, 3]} intensity={1.1} />
                <spotLight position={[-3, 2, 1]} angle={0.6} penumbra={0.5} intensity={0.8} color={ACCENT} />

                <Suspense fallback={null}>
                  <Model url={MODEL_URL} />
                  <Environment preset="city" />
                </Suspense>

                <OrbitControls enableDamping dampingFactor={0.08} minDistance={0.8} maxDistance={5} />
                <ContactShadows position={[0, -0.001, 0]} opacity={0.4} blur={2} far={5} />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      <footer className="row-start-3 row-end-4 border-t border-zinc-800/70 bg-black/40 px-4 py-3 text-center text-xs text-zinc-300">
        Feito com carinho para {FRIEND_NAME} · {new Date().getFullYear()} · Uma lembrança de seu aniversário
      </footer>
    </main>
  );
}

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url) as any;
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta: number) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={ref} position={[0, -0.4, 0]} rotation={[0, Math.PI / 8, 0]} scale={0.6}>
      <primitive object={gltf.scene} />
    </group>
  );
}
