import { Card, CardContent } from "./ui/card";
import { Users } from "lucide-react";

export function BoardOfDirectors() {
  return (
    <Card className="w-80 bg-purple-50 border-2 border-purple-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-purple-700 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-purple-900">Board of Directors</h3>
        </div>
      </CardContent>
    </Card>
  );
}
