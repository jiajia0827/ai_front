import { Card, CardContent } from "./ui/card";
import { FolderKanban } from "lucide-react";

export function ProductBacklog() {
  return (
    <Card className="w-64 bg-gradient-to-br from-blue-500 to-indigo-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
            <FolderKanban className="h-5 w-5 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-bold text-white">产品待办列表</h3>
            <p className="text-xs text-blue-100">Product Backlog</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
