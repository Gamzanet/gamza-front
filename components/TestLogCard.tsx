import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

export default function TestLogCard({
  title,
  description,
  content,
  footer,
}: {
  title: string;
  description: string;
  content: string;
  footer: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle> {title} </CardTitle>
        <CardDescription> {description} </CardDescription>
      </CardHeader>
      <CardContent>
        <p> {content} </p>
      </CardContent>
      <CardFooter>
        <p> {footer} </p>
      </CardFooter>
    </Card>
  );
}
