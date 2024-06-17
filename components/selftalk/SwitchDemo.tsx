import React, { useRef, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SwitchDemoProps {
  onToggle: () => void;
}

export default function SwitchDemo({ onToggle }: SwitchDemoProps) {
  const switchRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && switchRef.current) {
        event.preventDefault(); // 기본 TAB 동작 방지
        switchRef.current.click(); // 스위치 클릭 이벤트 트리거
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2">
      
      <div>
      <Label htmlFor="Player-Switch"> <strong>주체전환</strong> </Label>
      <Switch id="Player-Switch" ref={switchRef} onCheckedChange={onToggle} />
      </div>
      {/* <Label htmlFor="Player-Switch"> Press Tab → Switch Ego</Label> */}
      
    </div>
  );
}
