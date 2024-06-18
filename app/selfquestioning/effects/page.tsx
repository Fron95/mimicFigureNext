import TypographyH1 from "@/components/selftalk/TypographyH1";
import TypographyH2 from "@/components/selftalk/TypographyH2";
import TypographyP from "@/components/selftalk/TypographyP";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.body}>
      <Link href="/selfquestioning" passHref>
        <Button variant="destructive">돌아가기</Button>
      </Link>
      <TypographyH1>자문자답, 안개 속 길잡이</TypographyH1>
      <TypographyP>
        학습/업무적으로 또는 인격적으로 성장하는 느낌이 없을 때, <br />
        <strong>우리에게 필요한 것은 질문입니다. </strong> <br />
        <br />
        자기소개서를 작성하면서 자신의 인생이 잘 이해된 경험이 있으신가요?
        <br />
        이론서 회독보다 문제풀이가 더 효과적이었던 경험이 있으실겁니다.
        <br />
        <strong>질문의 힘은 강력합니다.</strong>
        <br />
        <br />
        다음의 상황에 계신 분들에게 효과적인 <strong>생각의 프레임워크</strong>
        로서 자문자답을 제안합니다.
      </TypographyP>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>1. 과도한 생각으로 몸이 굳은 사람 → 꼬리물고질문하기 </li>
        <li>2. 단단한 자아성찰이 필요한 사람 → 자기암시 </li>
        <li>
          3. 학습과 업무에 효율이 떨어지는 사람 → 셀프피드백
          <br /> <br />
        </li>
      </ul>

      <TypographyH2>자문자답 사용처</TypographyH2>
      <ol className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <strong>꼬리물고질문하기</strong> : 가장 골똘히 생각하고 있는
          생각/사안/현안, 그것의 뿌리를 찾으세요
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            "당신의 시간은 한정되어 있으니, 다른 사람의 삶을 사느라 낭비하지
            마세요. 다른 사람들의 생각의 결과로 사는 것이 곧 교리에 갇히는
            것입니다. 다른 사람들의 의견의 소음이 당신의 내면의 목소리를
            잠식하지 않게 하세요. 가장 중요한 것은, 당신의 마음과 직관을 따를
            용기를 가지는 것입니다. 그들은 이미 당신이 진정으로 되고 싶은 것이
            무엇인지 알고 있습니다. 나머지는 모두 부차적인 것입니다."
            -스티브잡스
          </blockquote>
        </li>
        <li>
          <strong>자기암시</strong> : 자신의 자아를 단단하게 수립하세요
          <iframe
            src="https://www.youtube.com/embed/0qQ9fnyywFc"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          (해당 유튜브 채널과 저는 아무런 관계없습니다.)
        </li>
        <li>
          <strong>셀프피드백</strong> : 다음과 같은 질문들로 자신을 객관화 할 수
          있습니다.
          <ol className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>일의 우선순위가 어떻게 되는가.</li>
            <li>무엇을 알고, 무엇을 모르는가.</li>
            <li>이것이 최선인가.</li>
            <li>달성하고자 하는 목표가 무엇인가.</li>
          </ol>
        </li>
      </ol>
      
      <TypographyH2>절차</TypographyH2>
      <ol className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <strong>제목설정</strong> : 주제를 제목으로 설정하세요
        </li>
        <li>
          <strong>목표설정</strong> : 대화 끝에 어떤 것을 얻고 싶은지, 어떤
          상태가 되고 싶은지 목표를 설명란에 기재하세요{" "}
        </li>
        <li>
          <strong>자기대화</strong> : 스스로 대화해보세요. (탭을 눌러서 발화자를
          전환할 수 있습니다.)
        </li>
        <li>
          <strong>목표달성</strong> : 사전에 설정한 목표를 달성하세요. 과도하게
          대화가 길어지지 않도록 목표시간을 설정하는 것도 도움이 됩니다.{" "}
        </li>
        <li>
          <strong>내보내기</strong> : 세상에서 가장 가치로운 대화입니다.
          다운로드해서 동일한 지점에서 길을 잃을 때 대화를 꺼내보세요
        </li>
      </ol>
    </div>
  );
}
