import Textarea from "@/components/textarea";
import styles from "@/styles/home.module.css";
import FigureCard from "@/components/figureCard";
import CommingSoonFigureCard from "@/components/commingSoonFigureCard";

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
      <div style={{ textAlign: "center" }}>
        <h1
          className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
          style={{ margin: "20px 0" }}
        >
          DeepTalk with Legends
        </h1>
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
