"use client";
const index = 1;
const bufferWindow = 2;
const lower = index - 3 < 1 ? 1 : index - 3;
const iter = bufferWindow;

const format = {
  figure: "",
  question: "",
  buffer: {},
};

for (let i = 1; i < bufferWindow + 1; i++) {
  format.buffer[i] = "";
}

console.log("formatasdsdaasdasd", format);
const testformat = {
  figure: "",
  question: "",
  buffer: {},
};

const insideFormat = {
  figure: "succeed",
  question: "",
  buffer: {
    1: "",
    2: "",
    3: "",
  },
};

export default function Home() {
  const fron = format;
  const fortest = testformat;
  fortest.buffer = { ...insideFormat };

  console.log("fortest", fortest);
  console.log("result?", fortest.buffer.figure);

  console.log("fron", fron);

  const data = sessionStorage.getItem("stevejobs");
  console.log("type", typeof 2);
  return (
    <div>
      <h1>{data}</h1>
      {Array.from({ length: window }, (_, i) => (
        <h1 key={i + lower}>{`🕧_${i + 1 + lower}`}</h1>
      ))}
    </div>
  );
}
