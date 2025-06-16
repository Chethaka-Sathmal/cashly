import { Card, CardContent } from "./ui/card";
import { fetchUserName } from "@/db/query";

export default async function Greeting() {
  const result = await fetchUserName();
  if (!result || !result.data) return;

  const userName: string = result.data.f_name;

  return (
    <Card>
      <CardContent>
        Hello <span>{userName}</span>
      </CardContent>
    </Card>
  );
}
