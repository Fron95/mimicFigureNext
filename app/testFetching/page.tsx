async function fetchingData() {
  const url =
    "https://lows-classic-intense-machinery.trycloudflare.com/quote?chat=hello";
  const response = await fetch(url);
  console.log("fetch complete", response);
  const data = await response.json();
  console.log(data);
  return data;
}

export default async function HomePage() {
  const data = await fetchingData();
  return <div>{data.quote}</div>;
}
