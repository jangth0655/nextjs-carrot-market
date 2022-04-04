console.log("BS");

interface Hello {
  hello: string;
}

export default function Bs({ hello }: Hello) {
  return <h1>wow {hello}</h1>;
}
