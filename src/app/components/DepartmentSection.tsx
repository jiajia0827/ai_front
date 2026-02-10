import { DocumentNode } from "./DocumentNode";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface Document {
  name: string;
  type: string;
  tool: string;
}

interface DepartmentSectionProps {
  departmentName: string;
  role: string;
  color: string;
  bgColor: string;
  documents: Document[];
  contact: string;
}

export function DepartmentSection({ 
  departmentName, 
  role,
  color, 
  bgColor,
  documents,
  contact
}: DepartmentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="min-w-[240px] shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className={`${bgColor} cursor-pointer`} onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-bold text-gray-800">{departmentName}</CardTitle>
              <Badge variant="secondary" className="mt-2 text-xs">{role}</Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-4 space-y-3">
            {documents.map((document, index) => (
              <DocumentNode
                key={index}
                name={document.name}
                type={document.type}
                tool={document.tool}
                color={color}
              />
            ))}
            <Separator className="my-3" />
            <a 
              href={`mailto:${contact}`} 
              className="flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors py-2 rounded-lg hover:bg-gray-50"
            >
              <Mail className="h-3 w-3" />
              {contact}
            </a>
          </CardContent>
        )}
      </Card>
    </div>
  );
}