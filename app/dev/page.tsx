import { TestLogPreviewCard } from "@/components/Cards";
import TestLogPreviewCardType from "@/types/Component";

const Page: React.FC = () => {
  const TestLogCardList: TestLogPreviewCardType[] = [1, 2, 3, 4, 5].map(
    (i) => ({
      title: `Test Log Card ${i}`,
      description: `This is test log card ${i}.`,
      content: `This is the content of test log card ${i}.`,
      footer: `This is the footer of test log card ${i}.`,
    })
  );

  return (
    <div>
      <TestLogCardContainer>{TestLogCardList}</TestLogCardContainer>
    </div>
  );
};

function TestLogCardContainer({
  children,
}: {
  children: TestLogPreviewCardType[];
}) {
  return (
    <div className='flex flex-col gap-4 overflow-auto h-96 w-96'>
      {children.map((props) => (
        <TestLogPreviewCard key={props.title} {...props} />
      ))}
    </div>
  );
}
export default Page;
