import { Button, Spinner } from "@nextui-org/react";

export default function Home() {
  return (
    <div>
      <Button color="secondary">Hello</Button>
      <h1>This is the h1 tag</h1>
      <Spinner size="lg" color="secondary" />
      <h1>This is the h1 tag after the spinner</h1>
    </div>
  );
}
