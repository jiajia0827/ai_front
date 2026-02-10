import React from 'react';
import { Quote } from 'lucide-react';
import EmpathyMap from './EmpathyMap';

interface PersonaProps {
  name?: string;
  age?: number;
  education?: string;
  status?: string;
  occupation?: string;
  location?: string;
  quote?: string;
  story?: string;
  goals?: string[];
  frustrations?: string[];
  personalityTags?: string[];
  imageUrl?: string;
  roleType?: 'PO' | 'SM' | 'DEV' | 'QA' | 'UI' | 'ST';
}

const UserPersona = (props: PersonaProps) => {
  const {
    name = "Persona Name",
    age = 17,
    education = "High School",
    status = "Single",
    occupation = "Student",
    location = "Oxford, UK",
    quote = "A very insightful quote.",
    story = "Alice is a fictional child living during the middle of the Victorian era. At home, she has a significantly older sister, a brother, a pet cat named Dinah, an elderly nurse, and a governess, who teaches her lessons starting at nine in the morning. Additionally, she had gone to a day school at some point in her backstory.",
    goals = ["Goal 1", "Goal 2", "Goal 3"],
    frustrations = ["Frustration 1", "Frustration 2", "Frustration 3"],
    personalityTags = ["Introvert", "Thinker", "Thinker", "Introvert", "Thinker"],
    imageUrl = "",
    roleType = "DEV"
  } = props;

  const labelStyle = "text-[#1a365d] font-bold text-xs uppercase tracking-wider";
  const valueStyle = "text-[#4a5568] text-sm";

  return (
    <div className="bg-[#f0f4f8] p-8 min-h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Left: User Persona Card */}
          <div className="w-[400px] flex-shrink-0">
            <div className="bg-white shadow-sm p-4 rounded-lg space-y-4">
              {/* Profile Card */}
              <div className="bg-[#f8fafc] p-4 rounded-sm flex flex-col items-center">
                <h2 className="text-[#1a365d] font-bold text-lg mb-3">{name}</h2>
                <div className="w-20 h-20 rounded-full bg-[#dbeafe] flex items-center justify-center text-center p-2 mb-4 border-2 border-transparent">
                  {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-[#718096] text-xs font-medium">Drop image</span>
                  )}
                </div>
                
                <div className="w-full space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className={labelStyle}>Age</span>
                    <span className={valueStyle}>{age}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={labelStyle}>Education</span>
                    <span className={valueStyle}>{education}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={labelStyle}>Status</span>
                    <span className={valueStyle}>{status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={labelStyle}>Occupation</span>
                    <span className={valueStyle}>{occupation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={labelStyle}>Location</span>
                    <span className={valueStyle}>{location}</span>
                  </div>
                </div>
              </div>

              {/* Personality Card */}
              <div className="bg-[#f8fafc] p-3 rounded-sm">
                <h3 className="text-[#1a365d] font-bold text-sm mb-2">Personality</h3>
                <div className="flex flex-wrap gap-1">
                  {personalityTags.map((tag, index) => (
                    <span key={index} className="bg-white px-2 py-0.5 rounded-full text-xs text-[#4a5568] shadow-sm border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote Section */}
              <div className="bg-[#f8fafc] p-3 rounded-sm relative flex items-center">
                <span className="text-[#2c5282] font-serif text-2xl absolute left-2 top-1 opacity-80">"</span>
                <p className="text-[#1a365d] text-sm font-medium px-6">{quote}</p>
                <span className="text-[#2c5282] font-serif text-2xl absolute right-2 bottom-1 opacity-80">"</span>
              </div>

              {/* Brief Story Section */}
              <div className="bg-[#f8fafc] p-3 rounded-sm">
                <h3 className="text-[#1a365d] font-bold text-sm mb-2">Brief story</h3>
                <p className="text-[#4a5568] text-xs leading-relaxed">{story}</p>
              </div>

              {/* Goals & Frustrations */}
              <div className="space-y-3">
                <div className="bg-[#f8fafc] p-3 rounded-sm">
                  <h3 className="text-[#1a365d] font-bold text-sm mb-2">Goals</h3>
                  <ul className="list-disc list-inside text-xs text-[#4a5568] space-y-0.5">
                    {goals.map((goal, i) => <li key={i}>{goal}</li>)}
                  </ul>
                </div>
                <div className="bg-[#f8fafc] p-3 rounded-sm">
                  <h3 className="text-[#1a365d] font-bold text-sm mb-2">Frustrations</h3>
                  <ul className="list-disc list-inside text-xs text-[#4a5568] space-y-0.5">
                    {frustrations.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Empathy Map */}
          <div className="flex-1">
            <EmpathyMap roleType={roleType} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPersona;
