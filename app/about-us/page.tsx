import type { Metadata } from "next";
import style from "@/styles/aboutus.module.css";
export const metadata: Metadata = {
  title: "Ask Titans | About Us",
  description : "About Us page of Ask Titans. Explore life lessons from history's greats with Ask Titans' AI chat.",
};

export default function Home() {
  return (
    <div className={style.centered_container}>
      <h1
        className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${style.title}`}
      >
        About US
        <br />
      </h1>
      <img
        src="https://vmspace.com/ActiveFile/spacem.org/board_img/210449036261ca614b0a63a.png"
        alt="picture of Saul Leiter"
        className={style.img}
      ></img>
      <span>
        Pictured by <strong>Saul Leiter</strong>
      </span>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        어려운 순간에 "스티브 잡스"라면 어떻게 생각했을까? 라고 생각해 본 적이
        있습니다.
        <br />
        그가 아니더라도 삶과 세상을 좀 더 여유롭게 다룰 수 있는 사람들은, 나의
        <br />
        "상황에서 어떻게 생각했을까?" 라고 생각해 보는 것만으로도 많이 도움이
        되었습니다.
        <br />
        여기 구현된 모델들이 실제 그들은 아니지만, 여러분에게 다방면으로 도움이
        되길...
        <br />
        <br />
        <br />
        I have thought about what "Steve Jobs" would have thought in difficult
        moments. <br />
        Even if it's not him, considering how people who seem to handle life
        more gracefully <br />
        than I do would think in my situation has been very helpful.
        <br />
        <br />
        Although the models implemented here are not actually them,
        <br />I hope they can be of help to you in various ways...
        <br />
        <br />
        <br />
        
      </p>
      <p className="text-sm text-muted-foreground">
          Email : lv.up.finance@gmail.com
        </p>
    </div>
  );
}
