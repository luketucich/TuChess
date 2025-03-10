import { useState, useEffect } from "react";

interface PointerPosition {
  x: number;
  y: number;
}

interface PointerState {
  isDown: boolean;
  position: PointerPosition;
  startSquare?: string;
}

function usePointerTracking(movePiece: (square: string) => void) {
  const [pointerState, setPointerState] = useState<PointerState>({
    isDown: false,
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    // Handle pointer down
    const handlePointerDown = (e: PointerEvent) => {
      // Find the closest square to the pointer
      const square =
        (e.target as HTMLElement)
          .closest("[data-square]")
          ?.getAttribute("data-square") || "";

      setPointerState({
        isDown: true,
        position: { x: e.clientX, y: e.clientY },
        startSquare: square,
      });
    };

    // Handle pointer up
    const handlePointerUp = (e: PointerEvent) => {
      const elementAtPoint = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement;

      // Find the closest square to the pointer
      const square =
        elementAtPoint?.closest("[data-square]")?.getAttribute("data-square") ||
        "";

      setPointerState((prev) => ({
        ...prev,
        startSquare: "",
        isDown: false,
      }));

      movePiece(square);
    };

    // Handle pointer move
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerState.isDown) {
        setPointerState((prev) => ({
          ...prev,
          position: { x: e.clientX, y: e.clientY },
        }));
      }
    };

    // Add event listeners
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);

    // Clean up
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [pointerState.isDown, movePiece]);

  return pointerState;
}

export { usePointerTracking };
