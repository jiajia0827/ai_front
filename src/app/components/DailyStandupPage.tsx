import React, { useState, useMemo } from 'react';
import { addMonths, subMonths, startOfDay, isSameDay } from 'date-fns';
import { Header } from './Header';
import { CalendarView } from './CalendarView';
import { TimelineView } from './TimelineView';
import { AnalyticsPanel } from './AnalyticsPanel';
import { generateMonthData } from '../data/standData';

export default function DailyStandupPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  
  const monthData = useMemo(() => generateMonthData(currentDate), [currentDate]);
  
  const selectedDayData = useMemo(() => 
    monthData.find(d => isSameDay(d.date, selectedDate)), 
    [monthData, selectedDate]
  );

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-4 md:p-8 overflow-y-auto flex flex-col box-border">
      <Header 
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 h-[700px]">
           <div className="h-full min-h-0">
              <CalendarView 
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                data={monthData}
              />
           </div>

           <div className="h-full min-h-0 hidden lg:block">
              <TimelineView 
                date={selectedDate}
                data={selectedDayData}
              />
           </div>
        </div>

        <div className="h-[400px]">
           <AnalyticsPanel />
        </div>
      </div>
    </div>
  );
}