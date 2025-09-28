import { useRef, useCallback, useState } from 'react';

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  startTime: number;
  isSwiping: boolean;
}

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
}

interface TouchOptions {
  threshold?: number;
  velocity?: number;
  longPressTime?: number;
  preventScroll?: boolean;
}

export const useTouch = (
  handlers: SwipeHandlers = {},
  options: TouchOptions = {}
) => {
  const {
    threshold = 50,
    velocity = 0.3,
    longPressTime = 500,
    preventScroll = false
  } = options;

  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    startTime: 0,
    isSwiping: false
  });

  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      startTime: Date.now(),
      isSwiping: false
    };

    setIsPressed(true);

    // Start long press timer
    if (handlers.onLongPress) {
      longPressTimer.current = setTimeout(() => {
        handlers.onLongPress?.();
        setIsPressed(false);
      }, longPressTime);
    }

    if (preventScroll) {
      e.preventDefault();
    }
  }, [handlers.onLongPress, longPressTime, preventScroll]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    const currentX = touch.clientX;
    const currentY = touch.clientY;
    const deltaX = currentX - touchState.current.startX;
    const deltaY = currentY - touchState.current.startY;

    touchState.current.currentX = currentX;
    touchState.current.currentY = currentY;
    touchState.current.deltaX = deltaX;
    touchState.current.deltaY = deltaY;

    // Check if movement exceeds threshold to consider it a swipe
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > threshold) {
      touchState.current.isSwiping = true;

      // Clear long press timer if user starts swiping
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }

    if (preventScroll && touchState.current.isSwiping) {
      e.preventDefault();
    }
  }, [threshold, preventScroll]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const { deltaX, deltaY, startTime, isSwiping } = touchState.current;
    const endTime = Date.now();
    const duration = endTime - startTime;
    const velocityX = Math.abs(deltaX) / duration;
    const velocityY = Math.abs(deltaY) / duration;

    setIsPressed(false);

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!isSwiping) {
      // Handle tap
      if (duration < 200 && handlers.onTap) {
        handlers.onTap();
      }
      return;
    }

    // Check for swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold && velocityX > velocity) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold && velocityY > velocity) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    }

    if (preventScroll) {
      e.preventDefault();
    }
  }, [handlers, threshold, velocity, preventScroll]);

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    touchHandlers,
    isPressed,
    touchState: touchState.current
  };
};

// Hook for pull-to-refresh functionality
export const usePullToRefresh = (onRefresh: () => void, threshold = 80) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const { touchHandlers } = useTouch({
    onSwipeDown: () => {
      if (pullDistance > threshold) {
        onRefresh();
      }
      setIsPulling(false);
      setPullDistance(0);
    }
  }, {
    preventScroll: true
  });

  const handleTouchMove = useCallback((e: TouchEvent) => {
    touchHandlers.onTouchMove(e);

    const touch = e.touches[0];
    if (!touch) return;

    // Check if we're at the top of the page
    const isAtTop = window.scrollY === 0;

    if (isAtTop) {
      const deltaY = touch.clientY - (touch as any).startY;
      if (deltaY > 0) {
        setIsPulling(true);
        setPullDistance(Math.min(deltaY, threshold * 1.5));
        e.preventDefault();
      }
    }
  }, [touchHandlers, threshold]);

  return {
    ...touchHandlers,
    onTouchMove: handleTouchMove,
    isPulling,
    pullDistance,
    isReady: pullDistance > threshold
  };
};