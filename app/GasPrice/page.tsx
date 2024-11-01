import { GasPriceProps } from "./GasPriceType";

export default function Page() {
  const sampleData: GasPriceProps = {
    title: "Gas Price",
    description: "Gas Price is the price of gas.",
    content: "Gas Price is the price of gas.",
    footer: "Gas Price is the price of gas.",
  };

  return (
    <>
      <GasPrice props={sampleData} />
    </>
  );
}

function GasPrice({ props }: { props: GasPriceProps }) {
  return (
    <div
      className='bg-gray-200'
      style={{
        background: "#F9F9F9",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        margin: "20px",
        borderRadius: "10px",
      }}
    >
      <p>{props.title}</p>
      <p>{props.description}</p>
      <p>{props.content}</p>
      <p>{props.footer}</p>
    </div>
  );
}
