import TestLogCard from "@/components/TestLogCard";
import TestLogCardType from "@/types/Component";

const Page: React.FC = () => {
  const TestLogCardList: TestLogCardType[] = [1, 2, 3, 4, 5].map(
    (i) =>
      ({
        title: `Test Log Card ${i}`,
        description: `This is test log card ${i}.`,
        content: `This is the content of test log card ${i}.`,
        footer: `This is the footer of test log card ${i}.`,
      } as TestLogCardType)
  );

  return (
    <div>
      <TestLogCard
        title='Test Log Card'
        description='This is a test log card.'
        content='This is the content of the test log card.'
        footer='This is the footer of the test log card.'
      />
      <TestLogCardContainer>{TestLogCardList}</TestLogCardContainer>
    </div>
  );
};

export default Page;

function TestLogCardContainer({ children }: { children: TestLogCardType[] }) {
  return (
    <div className='flex flex-col gap-4 overflow-auto h-96'>
      {children.map((props) => (
        <TestLogCard key={props.title} {...props} />
      ))}
    </div>
  );
}
