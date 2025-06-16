import { Card, CardContent } from "../ui/card";

export default function Summery() {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total income</span>
            <span className="font-semibold">Rs. 0.00</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total expense</span>
            <span className="font-semibold">Rs. 0.00</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total balance</span>
            <span className="font-semibold">Rs. 0.00</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Savings rate</span>
            <span className="font-semibold">0%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
