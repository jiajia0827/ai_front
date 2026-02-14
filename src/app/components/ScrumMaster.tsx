import { Card, CardContent } from "./ui/card";
import { CalendarDays } from "lucide-react";

export function ScrumMaster() {
  return (
    <Card className="w-48 bg-gradient-to-br from-purple-500 to-indigo-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardContent className="p-3">
        <div className="flex items-center justify-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
            <CalendarDays className="h-4 w-4 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-white">Sprint规划</h3>
            <p className="text-xs text-purple-100">Scrum Master</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
