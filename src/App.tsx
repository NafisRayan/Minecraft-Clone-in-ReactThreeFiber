import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars, Environment, Html } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Player } from './components/minecraft/Player';
import { Cubes } from './components/minecraft/Cubes';
import { Ground } from './components/minecraft/Ground';
import { TextureSelector } from './components/minecraft/TextureSelector';
import { Crosshair } from './components/minecraft/Crosshair';
import { useStore } from './components/minecraft/hooks/useStore';
import { Button } from './components/ui/button';
import { RefreshCw, Save, MousePointer2, Play } from 'lucide-react';
import { Suspense, useState, useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

const StartMenu = ({ onStart, visible }: { onStart: () => void, visible: boolean }) => {
    if (!visible) return null;
    
    return (
        <Html fullscreen style={{ pointerEvents: 'auto' }} zIndexRange={[100, 0]}>
            <div className="w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-sm">
                 <div className="text-center text-white space-y-6 p-8 bg-zinc-900/50 rounded-2xl border border-white/10 shadow-2xl max-w-md backdrop-blur-xl">
                     <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Minecraft Clone</h1>
                     
                     <Button 
                        size="lg" 
                        className="w-full text-lg font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 transition-all hover:scale-105"
                        onClick={(e) => {
                            e.stopPropagation();
                            onStart();
                        }}
                     >
                        <Play className="w-5 h-5 mr-2 fill-current" /> Click to Start
                     </Button>

                     <div className="grid grid-cols-2 gap-3 text-left text-xs text-zinc-400 bg-black/20 p-4 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-white">WASD</kbd> Move</div>
                        <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-white">SPACE</kbd> Jump</div>
                        <div className="flex items-center gap-2"><MousePointer2 className="w-3 h-3" /> Place Block</div>
                        <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-white">ALT</kbd> + Click Break</div>
                        <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-white">1-5</kbd> Select</div>
                        <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-white">ESC</kbd> Menu</div>
                     </div>
                 </div>
            </div>
        </Html>
    );
};

const Scene = ({ isLocked, setIsLocked }: { isLocked: boolean, setIsLocked: (v: boolean) => void }) => {
    const controlsRef = useRef<any>(null);
    
    return (
        <>
            <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.7} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.3} />
            <directionalLight 
              castShadow 
              position={[100, 20, 100]} 
              intensity={1.5} 
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
            />
            
            <Suspense fallback={null}>
              <Environment preset="park" />
              <Physics gravity={[0, -9.81, 0]}>
                <Player />
                <Cubes />
                <Ground />
              </Physics>
            </Suspense>
            
            <PointerLockControls 
                ref={controlsRef}
                onLock={() => setIsLocked(true)} 
                onUnlock={() => setIsLocked(false)} 
            />
            
            <StartMenu 
                visible={!isLocked} 
                onStart={() => {
                    controlsRef.current?.lock();
                }} 
            />
        </>
    );
};

function App() {
  const saveWorld = useStore((state) => state.saveWorld);
  const resetWorld = useStore((state) => state.resetWorld);
  const [isLocked, setIsLocked] = useState(false);

  return (
    <>
      <div className="w-full h-screen relative bg-zinc-950 select-none overflow-hidden">
        <ErrorBoundary fallback={<div className="flex items-center justify-center h-full text-white bg-zinc-900">Failed to load 3D environment. Please refresh.</div>}>
          <Canvas shadows camera={{ fov: 45 }}>
             <Scene isLocked={isLocked} setIsLocked={setIsLocked} />
          </Canvas>
        </ErrorBoundary>
        
        {isLocked && <Crosshair />}
        
        <div className={`absolute top-6 right-6 flex flex-col gap-2 z-50 pointer-events-auto transition-opacity duration-300 ${isLocked ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}>
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              saveWorld();
            }}
          >
            <Save className="w-4 h-4 mr-2" /> Save World
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-red-500/50 hover:border-red-500/50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              resetWorld();
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        <div className={`absolute top-6 left-6 z-40 pointer-events-none transition-opacity duration-300 ${isLocked ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white space-y-2 shadow-xl">
              <div className="space-y-1 text-xs text-zinc-300">
                  <div className="font-bold text-emerald-400 mb-1">Controls</div>
                  <div className="flex items-center gap-2"><span className="opacity-50">WASD</span> Move</div>
                  <div className="flex items-center gap-2"><span className="opacity-50">Click</span> Build</div>
                  <div className="flex items-center gap-2"><span className="opacity-50">Alt+Click</span> Break</div>
              </div>
          </div>
        </div>

        <div className={`transition-transform duration-300 ${isLocked ? 'translate-y-0' : 'translate-y-24'}`}>
             <TextureSelector />
        </div>
      </div>
    </>
  );
}

export default App;
