import { Card, CardContent } from "./ui/card";
import { CalendarDays } from "lucide-react";

export function ScrumMaster() {
  return (
    <Card className="w-64 bg-gradient-to-br from-purple-500 to-indigo-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-bold text-white">Sprint规划</h3>
            <p className="text-xs text-purple-100">Scrum Master</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
