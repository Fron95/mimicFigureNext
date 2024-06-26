import styles from "./page.module.css";

// typography
import TypographyH1 from "@/components/selftalk/TypographyH1";
import TypographyH2 from "@/components/selftalk/TypographyH2";
import TypographyP from "@/components/selftalk/TypographyP";

// 피규어카드
import FigureCard from "@/components/figureCard";
import CommingSoonFigureCard from "@/components/commingSoonFigureCard";

// metadata
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "스타트업을위한도구들 | 플레이어들의 낭비를 줄이는 것에 집중합니다.",
  description:
    "Explore life lessons from history's greats with Ask Titans' AI chat. Uncover life, business, and leadership insights learned in life with GPT3 chat",
};

interface DataItem {
  name: string;
  available: boolean;
  image: string;
  description: string;
  href: string;
  // 여기에 data 객체의 다른 속성들을 추가할 수 있습니다.
}

const datas: DataItem[] = [
  {
    name: "거장과의 대화",
    available: false,
    image:
      "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcSX3ZOe1nBi0kfUtkLB7NcH2Qm64eR8eoZ-0TUppPNN4PfjcGAyW-eemOs2JKdRYH6R",
    description:
      "(준비중)AI거장클론챗봇과 대화를 통한 인사이트 획득",
    href: "/asktitans",
  },
  {
    name: "자문자답",
    available: true,
    image: "/images/sample_conversation.jpg",
    description:
      "자문자답을 통한 생각정리 (생각이 너무 많아 몸이 굳고 행동이 더뎌지신 분에게 추천)",
    href: "/selfquestioning",
  },
  {
    name: "지원사업",
    available: true,
    image:
      "images/aid.jpg",
    description:
      "창업지원사업 정보모음",
    href: "/aidlist",
  },
  {
    name: "큰 회사 재무제표",
    available: true,
    image:
      "images/stockmarket.jpg",
    description:
      "전자공시하는 기업들의 재무상황은 어떤지 확인",
    href: "/aidlist",
  },
];

export default function Home() {
  return (
    <div>
      <div className={styles.title_container}>
        <h1
          className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
          style={{ margin: "20px 0" }}
        >
          스타트업을 위한 도구들
        </h1>
        <TypographyP>
          유용한 정보, 도구, 커뮤니티로 플레이어들의 낭비를 줄이는 것에
          집중합니다.
        </TypographyP>
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
