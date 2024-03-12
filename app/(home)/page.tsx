import styles from "@/styles/home.module.css";
import FigureCard from "@/components/figureCard";
import CommingSoonFigureCard from "@/components/commingSoonFigureCard";
// 메타데이터
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ask Titans | Wisdom from the Greats through AI-Powered Chat",
  description: "Explore life lessons from history's greats with Ask Titans' AI chat. Uncover life, business, and leadership insights learned in life with GPT3 chat",
};

// DataItem 인터페이스 정의
interface DataItem {
  name: string;
  available: boolean;
  // 여기에 data 객체의 다른 속성들을 추가할 수 있습니다.
}

export default function Home() {
  const datas: DataItem[] = require("@/files/data.json");
  return (
    <div>
      <div className={styles.title_container}>
        <h1
          className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
          style={{ margin: "20px 0" }}
        >
          Ask Titans
        </h1>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Learn Life Lessons from the Legends
        </h2>
      </div>
      <div className={styles.container}>
        {Object.values(datas).map((data) =>
          data.available ? (
            <FigureCard key={data.name} data={data} />
          ) : (
            <CommingSoonFigureCard key={data.name} data={data} />
          )
        )}
      </div>
    </div>
  );
}
