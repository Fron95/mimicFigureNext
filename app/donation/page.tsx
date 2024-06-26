import style from "@/styles/aboutus.module.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ask Titans | Donation",
  description : "Donation page of Ask Titans. Explore life lessons from history's greats with Ask Titans' AI chat.",
};

export default function Home() {
  return (
    <div className={style.centered_container}>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Donation
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        <br />
        <br />
        정말 필요합니다 ! <br />
        하지만, 좋은 아이디어, 협업제안, 감사 인사 등에 더 관심이 있습니다.
        <br />
        <br />
        I really need it! <br />
        However, I'm more interested in good ideas, collaboration proposals, and
        expressions of gratitude.
        <br />
        <br />
        Email : jsj950611@naver.com
      </p>
    </div>
  );
}
