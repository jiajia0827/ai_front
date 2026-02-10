import { DocumentNode } from "./DocumentNode";
import { ChevronDown, ChevronUp, Mail, User } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";

interface Document {
  name: string;
  type: string;
  tool: string;
}

interface DocumentCategoryProps {
  categoryName: string;
  role: string;
  color: string;
  bgColor: string;
  documents: Document[];
  contact: string;
}

export function DocumentCategory({ 
  categoryName, 
  role,
  color, 
  bgColor,
  documents,
  contact
}: DocumentCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Header */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full px-6 py-4 ${bgColor} hover:opacity-90 transition-opacity flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-gray-800">{categoryName}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <span className="font-medium">负责角色:</span> {role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {documents.length} 个文档
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </div>
        </button>
        
        {/* Documents List */}
        {isExpanded && (
          <div className="p-4 bg-white space-y-2">
            {documents.map((document, index) => (
              <DocumentNode
                key={index}
                name={document.name}
                type={document.type}
                tool={document.tool}
                color={color}
              />
            ))}
            
            {/* Contact */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact}`} className="hover:text-blue-600 transition-colors">
                  {contact}
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
