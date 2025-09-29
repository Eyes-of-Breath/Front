// src/controller/SceneController.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as SlideYMod from "../animations/transitions/slideY";
import SCENES from "../scenes"; // 씬 레지스트리
import Home1 from "../components/Home1";
import "./scene.css"; // 레이어 기본 스타일
import { createRoot } from 'react-dom/client';

gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollTrigger);

// Resolve createSlideY regardless of export style (named or default)
const _createSlideY = (SlideYMod && (SlideYMod.createSlideY || SlideYMod.default)) || null;

// Singleton guard to prevent multiple SceneController instances
if (typeof window !== 'undefined') {
  window.__SC_OBSERVER_ENABLED__ = false; // hard-disable wheel interception
  window.__SC_CURTAIN_ENABLED__ = false;  // hard-disable controller-managed curtain
  window.__SC_ACTIVE = window.__SC_ACTIVE || false;
}

// Header color: keep body.header-red ON during Home2~Home5
function setHeaderRedForIndex(idx) {
  try {
    // Prefer SCENES metadata if available at runtime
    const meta = SCENES?.[idx];
    const id = meta?.id || '';
    const idMatch = /^home([2-5])$/i.test(id);
    const rangeMatch = idx >= 2 && idx <= 5; // fallback by position
    const shouldRed = idMatch || rangeMatch;
    document.body.classList.toggle('header-red', !!shouldRed);
  } catch (_) {
    // On any error, be conservative: turn off to avoid sticky state
    document.body.classList.remove('header-red');
  }
}

export default function SceneController() {
  const [index, setIndex] = useState(1);
  const [busy, setBusy] = useState(false);

  const hostRef = useRef(null);
  const layerARef = useRef(null);
  const layerBRef = useRef(null);
  const usingARef = useRef(true); // 현재 화면이 layerA인지 여부
  const observerRef = useRef(null);
  const scrollBufRef = useRef({ amt: 0, dir: 0, since: 0 });
  const lastFireRef = useRef(0);
  const intentRef = useRef({ dir: 0, count: 0, ts: 0 });


  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (window.__SC_ACTIVE) {
      console.warn('[SceneController] duplicate detected – rendering suppressed');
      return false;
    }
    window.__SC_ACTIVE = true;
    return true;
  });

  // Home 컴포넌트 감지 함수
  const isHomeComponentActive = () => {
    // Home 컴포넌트가 활성화되어 있는지 확인
    const homeElements = document.querySelectorAll('[data-custom-home="true"]');
    return homeElements.length > 0;
  };

  // 현재 host 내에서 pin된 ScrollTrigger가 활성인지 확인 (작은 스크롤은 섹션이 흡수)
  function pinnedActiveInHost() {
    try {
      const host = hostRef.current;
      if (!host) return false;
      const triggers = ScrollTrigger.getAll();
      return triggers.some(t => t.pin && t.isActive() && host.contains(t.trigger));
    } catch {
      return false;
    }
  }

  // 현재 씬이 자체 스크롤을 처리하는지 확인
  const shouldBlockSceneController = () => {
    const currentScene = SCENES[index];
    return (
      busy ||
      currentScene?.blockGlobalWheel ||
      isHomeComponentActive() ||
      pinnedActiveInHost()
    );
  };

  // Establish a clean baseline: active layer visible at y=0, inactive layer hidden at y=100
  function baselineLayers({ active, inactive }) {
    if (active) {
      gsap.set(active, {
        yPercent: 0,
        autoAlpha: 1,
        display: 'block',
        zIndex: 2,
      });
      active.setAttribute('aria-hidden', 'false');
    }
    if (inactive) {
      gsap.set(inactive, {
        yPercent: 100,
        autoAlpha: 0,
        display: 'none',
        zIndex: 1,
      });
      inactive.setAttribute('aria-hidden', 'true');
    }
    if (hostRef.current) gsap.set(hostRef.current, { pointerEvents: 'auto' });
  }


  // 첫 씬 마운트 (레이아웃 페이즈에 선마운트하여 깜빡임 방지)
  useLayoutEffect(() => {
    mountScene(layerARef.current, SCENES[1]);
    console.log('[SceneController] mounted first scene (layout)', SCENES[1]?.id);
    // Ensure Home1 is actually visible and the other layer is parked off-screen
    baselineLayers({
      active: layerARef.current,
      inactive: layerBRef.current,
    });
    // Initialize header color based on initial index
    setHeaderRedForIndex(1);
    // Curtain overlay is not used anymore.
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') window.__SC_ACTIVE = false;
      // Ensure global header class is cleared on unmount
      document.body.classList.remove('header-red');
      // Paper mask overlay cleanup not needed anymore.
    };
  }, []);

  // 휠/키 입력 → next/prev
  useEffect(() => {
    if (!window.__SC_OBSERVER_ENABLED__) {
      // Wheel interception disabled to allow ScrollTrigger sections to control scroll
      return;
    }
    const target = hostRef.current || document;

    // Observer 정리
    if (observerRef.current) {
      try { 
        observerRef.current.kill(); 
      } catch (_) {}
      observerRef.current = null;
    }

    const obs = Observer.create({
      target,
      type: "wheel,touch,pointer",
      preventDefault: false,
      passive: true,
      capture: false,
      lockAxis: true,
      wheelSpeed: 0.6,
      tolerance: 12,
      dragMinimum: 14,
      ignore: "input,textarea,button,select,[data-scroll-ignore],[data-custom-home]",
      onChangeY: (self) => {
        // 기본 차단 조건
        const blockReason = shouldBlockSceneController();
        if (blockReason) return;

        const raw = self.deltaY || 0;
        // 트랙패드/일부 브라우저의 큰 델타 스파이크를 억제 (hysteresis)
        const dy = Math.max(-120, Math.min(120, raw)); // clamp
        const add = Math.min(Math.abs(dy), 80);        // cap single-event contribution

        const now = performance.now();
        const dir = dy > 0 ? 1 : -1;

        // 쿨다운: 최근 전환 후 일정 시간은 무시
        const MIN_GAP = 900; // ms (700~1100 권장 튜닝)
        if (now - lastFireRef.current < MIN_GAP) return;

        // 버퍼 업데이트 (거리/시간)
        const buf = scrollBufRef.current;
        if (!buf.since || dir !== buf.dir || (now - buf.since) > 900) {
          buf.amt = 0; buf.since = now; buf.dir = dir;
        }
        buf.amt += add;
        const elapsed = now - buf.since;
        const vel = buf.amt / Math.max(1, elapsed); // px/ms

        // 임계값 (더 보수적으로 설정)
        const THRESHOLD_PX = 200;   // 180→200로 상향
        const THRESHOLD_MS = 750;   // 800→750로 약간 타이트
        const THRESHOLD_VEL = 0.7;  // 0.6→0.7 더 강한 의도 요구

        const strongIntent = (buf.amt > THRESHOLD_PX && elapsed < THRESHOLD_MS) || (vel > THRESHOLD_VEL);
        if (!strongIntent) return; // 찔끔 스크롤 무시

        // 연속 강의도 요구: 같은 방향 strongIntent가 2회 연속일 때만 발사
        const ic = intentRef.current;
        if (ic.dir !== dir || (now - ic.ts) > 600) {
          intentRef.current = { dir, count: 1, ts: now };
          return; // 첫 강의도: 한 번 더 강의도가 들어오면 진행
        } else {
          intentRef.current = { dir, count: ic.count + 1, ts: now };
          if (intentRef.current.count < 2) return;
        }

        // 최종 발사
        const next = dir > 0 ? 'next' : 'prev';
        gsap.delayedCall(0.02, () => {
          if (!shouldBlockSceneController()) {
            lastFireRef.current = performance.now();
            go(next);
            // 리셋
            buf.amt = 0; buf.since = performance.now();
            intentRef.current = { dir: 0, count: 0, ts: 0 };
          }
        });
      }
    });

    observerRef.current = obs;

    const onKey = (e) => {
      if (shouldBlockSceneController()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") go("next");
      if (e.key === "ArrowUp"   || e.key === "PageUp")   go("prev");
    };

    const onSceneRequest = (ev) => {
      const dir = ev.detail?.direction || "next";
      console.log('[SC] scene:request received', dir);
      go(dir);
    };

    // Home 컴포넌트의 scene:request 이벤트 우선 처리
    const onHomeSceneRequest = (ev) => {
      const dir = ev.detail?.direction || "next";
      console.log('[SC] home scene:request received', dir);
      // Home에서 온 요청은 즉시 처리
      go(dir);
    };

    window.addEventListener("scene:request", onSceneRequest);
    window.addEventListener("home:scene:request", onHomeSceneRequest); // Home 전용 이벤트
    if (window.__SC_OBSERVER_ENABLED__) window.addEventListener("keydown", onKey);

    return () => {
      try { 
        if (observerRef.current) {
          observerRef.current.kill(); 
        }
      } catch (_) {}
      observerRef.current = null;
      window.removeEventListener("scene:request", onSceneRequest);
      window.removeEventListener("home:scene:request", onHomeSceneRequest);
      if (window.__SC_OBSERVER_ENABLED__) window.removeEventListener("keydown", onKey);
    };
  }, [busy, index]);

  function go(direction) {
    console.log('[SC] go()', direction, { from: index, busy, blocked: shouldBlockSceneController() });
    if (shouldBlockSceneController()) return;

    const currentLayer = usingARef.current ? layerARef.current : layerBRef.current;
    const nextLayer    = usingARef.current ? layerBRef.current : layerARef.current;

    // Make sure layers are in a valid start state
    if (currentLayer) gsap.set(currentLayer, { yPercent: 0, display: 'block', autoAlpha: 1 });
    if (nextLayer)    gsap.set(nextLayer,    { display: 'block', autoAlpha: 1 });

    // A11y: don't hide layers before the animation; hide old one at the end
    if (currentLayer) currentLayer.removeAttribute('aria-hidden');
    if (nextLayer)    nextLayer.removeAttribute('aria-hidden');

    let nextIndex =
      direction === "next" ? Math.min(index + 1, SCENES.length - 1)
                           : Math.max(index - 1, 0);
    if (nextIndex === 0) nextIndex = 1;
    if (nextIndex === index) { 
      console.log('[SC] go() no-op (edge or blocked)', { index, direction }); 
      return; 
    }

    // edge가 아님이 확정되었을 때만 포인터 락
    if (hostRef.current) gsap.set(hostRef.current, { pointerEvents: 'none' });

    console.log('[SC] using transition creator:', typeof _createSlideY === 'function' ? 'createSlideY' : 'fallback');

    // 다음 씬 DOM 준비(컴포넌트 렌더 + data-scene + 배경)
    setBusy(true);

    mountScene(nextLayer, SCENES[nextIndex]);

    // 씬 고유 애니 + 공용 전환 합치기
    const tl = gsap.timeline({
      onComplete: () => {
        console.log('[SC] transition complete', { to: nextIndex });
        setIndex(nextIndex);
        // Update header color for new active scene
        setHeaderRedForIndex(nextIndex);
        usingARef.current = !usingARef.current;

        // A11y: old layer hidden, new layer visible
        if (currentLayer) currentLayer.setAttribute('aria-hidden', 'true');
        if (nextLayer)    nextLayer.setAttribute('aria-hidden', 'false');

        // 이전 레이어 정리(필요 시)
        cleanupLayer(currentLayer);

        // 어떤 전환 모듈이었든 최종 상태를 '깨끗하게' 강제
        baselineLayers({
          active: nextLayer,
          inactive: currentLayer,
        });

        // unlock interactions
        if (hostRef.current) gsap.set(hostRef.current, { pointerEvents: 'auto' });

        setBusy(false);
      },
      onInterrupt: () => {
        // 안전망: 인터럽트 시 포인터 락/상태 복구
        if (hostRef.current) gsap.set(hostRef.current, { pointerEvents: 'auto' });
        setBusy(false);
        const active = usingARef.current ? layerARef.current : layerBRef.current;
        const inactive = usingARef.current ? layerBRef.current : layerARef.current;
        baselineLayers({ active, inactive });
      }
    });

    const dirNum = direction === "next" ? 1 : -1;

    const currOut = SCENES[index]?.tlOut?.(currentLayer) || gsap.timeline();

    // Use slideY if available; otherwise, fallback to a simple crossfade/lift
    const trans = typeof _createSlideY === 'function'
      ? _createSlideY({ currentEl: currentLayer, nextEl: nextLayer, dir: dirNum, dur: 0.6 })
      : gsap.timeline()
          .set(nextLayer, { opacity: 0, display: 'block' })
          .to(currentLayer, { yPercent: -8 * dirNum, autoAlpha: 0, duration: 0.6, ease: 'power3.inOut' }, 0)
          .to(nextLayer,    { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.inOut' }, 0)
          .add(() => {
            // ensure current hidden and cleared after swap
            gsap.set(currentLayer, { clearProps: 'all', display: 'none' });
          });

    const nextIn  = SCENES[nextIndex]?.tlIn?.(nextLayer) || gsap.timeline();

    tl.add(currOut)
      .add(trans, "<0.0")
      .add(nextIn, ">-0.15")
      .play();
  }

  if (!enabled) return null;
  console.log('[SceneController] mount – enabled=', enabled, 'index=', index, 'blockGlobalWheel=', SCENES[index]?.blockGlobalWheel);
  return (
    <>
      {/* Fixed bottom background: Home1 always visible under the paper layer */}
      <div
        className="bg-fixed"
        aria-hidden
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      >
        <Home1 />
      </div>

      {/* Scene host and two swappable scene layers (no curtain) */}
      <div ref={hostRef} className="scene-host" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={layerARef} className="scene-layer" style={{ position: 'relative', zIndex: 2 }} />
        <div ref={layerBRef} className="scene-layer" style={{ position: 'relative', zIndex: 2 }} />
      </div>
    </>
  );
}

// 유틸: 레이어에 씬 렌더 + 메타 속성 부여
function mountScene(layerEl, sceneMeta) {
  if (!layerEl) return;
  if (!sceneMeta) { console.error('[SceneController] mountScene called with empty sceneMeta'); return; }
  const { id, Comp, bgVar } = sceneMeta;

  // 배경은 CSS 변수/클래스로 제어
  layerEl.setAttribute("data-scene", id);
  layerEl.style.background = bgVar || "transparent";

  if (!layerEl.__root) {
    layerEl.innerHTML = `<div class="scene-content"></div>`;
    const content = layerEl.querySelector('.scene-content');
    layerEl.__root = createRoot(content);
  }
  console.log('[SceneController] rendering scene', id, 'into layer');
  layerEl.__root.render(<Comp />);
}

function cleanupLayer(layerEl) {
  // 씬별로 ScrollTrigger나 타임라인 정리가 필요하면 여기에 훅 추가 가능
}