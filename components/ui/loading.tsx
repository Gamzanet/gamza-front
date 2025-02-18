// components/ui/Loading.tsx
import { MoonLoader } from "react-spinners";

export default function Loading({
  size = 50,
  color = "#ff00ed",
  containerClassName = "",
}) {
  return (
    <div
      className={`flex justify-center items-center ${containerClassName}`}
      style={{ height: "100%" }} // 부모 컨텍스트 높이에 맞추기
    >
      <MoonLoader size={size} color={color} />
    </div>
  );
}

// if (loading) {
//   return (
//     <div className="flex justify-center items-center w-[60vw] h-full p-4">
//       <MoonLoader size={30} color={"#ff00ed"} loading={loading} />
//     </div>
//   );
// }
