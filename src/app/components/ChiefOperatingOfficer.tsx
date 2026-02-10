import { Card, CardContent } from "./ui/card";
import { Briefcase } from "lucide-react";

export function ChiefOperatingOfficer() {
  return (
    <Card className="w-80 bg-indigo-50 border-2 border-indigo-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-indigo-700 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-indigo-900">Chief Operating Officer</h3>
        </div>
      </CardContent>
    </Card>
  );
}
