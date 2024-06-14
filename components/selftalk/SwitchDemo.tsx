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
      <Label htmlFor="Player-Switch"> Tab →<br />위치변경 </Label>
      {/* <Label htmlFor="Player-Switch"> Press Tab → Switch Ego</Label> */}
      <Switch id="Player-Switch" ref={switchRef} onCheckedChange={onToggle} />
    </div>
  );
}
