import TypographyH1 from "@/components/selftalk/TypographyH1";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTableDemo } from "@/components/selftalk/Chattable";

export default function left() {
  return (
    <div>
      <TypographyH1>SELF-TALK</TypographyH1>

      {/* 다운로드, 새로운 대화 */}
      <div className="">ff</div>

      <ScrollArea>
        <DataTableDemo />
      </ScrollArea>
    </div>
  );
}
