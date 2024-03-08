import Textarea from "@/components/textarea";
import styles from "@/styles/home.module.css";
import FigureCard from "@/components/figureCard";
import CommingSoonFigureCard from "@/components/commingSoonFigureCard";

export default function Home() {
  const datas = {
    stevejobs: {
      name: "Steve Jobs",
      image:
        "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcSX3ZOe1nBi0kfUtkLB7NcH2Qm64eR8eoZ-0TUppPNN4PfjcGAyW-eemOs2JKdRYH6R",
      description:
        "Steve Jobs was an American business magnate, industrial designer, investor, and media proprietor. He was the chairman, chief executive officer (CEO), and co-founder of Apple Inc.",
    },
  };

  const disavailabe_datas = {
    atomatom: {
      name: "Ilon Mask",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elon_Musk_Colorado_2022_%28cropped2%29.jpg/640px-Elon_Musk_Colorado_2022_%28cropped2%29.jpg",
      description:
        "Ilon Mask is an American business magnate, industrial designer, and engineer. He is the founder, CEO, CTO, and chief designer of SpaceX; early investor, CEO, and product architect of Tesla, Inc.; founder of The Boring Company; co-founder of Neuralink; and co-founder and initial co-chairman of OpenAI.",
    },
    fronfron: {
      name: "Mark Zuckerberg",
      image:
        "https://cdn.dailyvision.co.kr/news/photo/202212/92655_73098_2942.jpeg",
      description:
        "Mark Elliot Zuckerberg is an American media magnate, internet entrepreneur, and philanthropist. He is known for co-founding Meta Platforms, Inc. (formerly Facebook, Inc.) and serves as its chairman, chief executive officer, and controlling shareholder.",
    },
    a: {
      name: "Jung Ju Young",
      image:
        "https://i.namu.wiki/i/g7w0iTb5xmg-y8pi9RTdy_UcoYJ9T0dSv7PCxtJjiV3SEj07c7g9mIoCay6PKFKph4kHmwLT4Op5uiW1l6qudA.webp",
      description:
        "Jung Ju Young is the co-founder of Microsoft Corporation. He is an American business magnate, software developer, and philanthropist. He is best known as the co-founder of Microsoft Corporation.",
    },
    b: {
      name: "Bill Gates",
      image:
        "https://cdn.britannica.com/47/188747-050-1D34E743/Bill-Gates-2011.jpg",
      description:
        "Bill gates is the co-founder of Microsoft Corporation. He is an American business magnate, software developer, and philanthropist. He is best known as the co-founder of Microsoft Corporation.",
    },
    "Larry Page": {
      name: "Larry Page",
      image:
        "https://www.celebrityfunfacts.com/media/Larry-Page-Facts-Biography.jpg",
      description:
        "Larry Page is an American computer scientist and Internet entrepreneur. He is best known as one of the co-founders of Google along with Sergey Brin.",
    },
    "Sergey Brin": {
      name: "Sergey Brin",
      image:
        "https://hips.hearstapps.com/hmg-prod/images/gettyimages-456023687.jpg",
      description:
        "Sergey Brin is an American computer scientist and Internet entrepreneur. He is best known as one of the co-founders of Google along with Larry Page.",
    },
  };
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
        {Object.values(datas).map((data) => (
          <FigureCard key={data.name} data={data} />
        ))}
        {Object.values(disavailabe_datas).map((data) => (
          <CommingSoonFigureCard key={data.name} data={data} />
        ))}
      </div>
    </div>
  );
}
