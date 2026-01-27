import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Square, 
  Zap, 
  ChevronRight,
  Info,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { parseSisHtml } from './services/parserService';
import { generateIcs } from './services/icsService';
import type { TimetableData } from './types';

declare const chrome: any;

const App: React.FC = () => {
  const [parsedData, setParsedData] = useState<TimetableData | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [copied, setCopied] = useState(false);
  const [isExtension, setIsExtension] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsExtension(typeof chrome !== 'undefined' && !!chrome.tabs && !!chrome.scripting);
    if (parsedData) {
      setSelectedCourseIds(new Set(parsedData.courses.map(c => c.id)));
    }
  }, [parsedData]);

  const captureFromPage = async () => {
    if (!isExtension) {
      alert("Please install as an extension to use auto-capture.");
      return;
    }

    setIsCapturing(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) return;

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const iframe = document.getElementById('ptifrmtgtframe') as HTMLIFrameElement;
          if (iframe && iframe.contentDocument) {
            return iframe.contentDocument.body.innerHTML;
          }
          return document.body.innerHTML;
        }
      });

      const html = results[0].result;
      if (html) {
        const result = parseSisHtml(html);
        setParsedData(result);
      } else {
        alert("Timetable not found. Are you on the 'My Class Schedule' page?");
      }
    } catch (err) {
      console.error("Capture failed", err);
      alert("Could not access page content.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const result = parseSisHtml(content);
        setParsedData(result);
      } catch (err) {
        alert("Invalid SIS HTML file.");
      }
    };
    reader.readAsText(file);
  };

  const toggleCourseSelection = (id: string) => {
    const newSelection = new Set(selectedCourseIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedCourseIds(newSelection);
  };

  const getFilteredData = () => {
    if (!parsedData) return null;
    return {
      ...parsedData,
      courses: parsedData.courses.filter(c => selectedCourseIds.has(c.id))
    };
  };

  const copyJson = () => {
    const data = getFilteredData();
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadIcs = () => {
    const filtered = getFilteredData();
    if (!filtered || filtered.courses.length === 0) return;
    const icsContent = generateIcs(filtered);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hku_timetable_${new Date().getFullYear()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Professional Header */}
      <header className="header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="app-logo">
            <Calendar size={18} />
          </div>
          <div>
            <h1 style={{fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2}}>SIS Sync</h1>
            <p style={{fontSize: '0.625rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'}}>HKU Timetable Utility</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isExtension && (
            <button
              onClick={captureFromPage}
              disabled={isCapturing}
              className="btn btn-primary"
            >
              <Zap size={14} fill={isCapturing ? 'none' : 'currentColor'} className={isCapturing ? 'animate-pulse' : ''} />
              {isCapturing ? 'Parsing...' : 'Capture'}
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-ghost"
            style={{padding: '0.5rem'}}
            title="Upload HTML"
          >
            <FileText size={18} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".html,.htm" className="hidden" style={{display: 'none'}} />
        </div>
      </header>

      {/* Content Body */}
      <main className="flex-1 custom-scrollbar p-5">
        {!parsedData ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-up">
            <div style={{width: '64px', height: '64px', background: '#f5f7ff', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', marginBottom: '1.5rem'}}>
              <Info size={32} />
            </div>
            <h2 style={{fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem'}}>Welcome</h2>
            <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '2rem', maxWidth: '280px'}}>
              Ready to sync your schedule? Navigate to <strong>SIS Portal</strong> and click 
              <span style={{color: '#4f46e5', fontWeight: 800}}> Capture</span>.
            </p>
            
            <div className="w-full" style={{display: 'grid', gap: '0.75rem'}}>
              {[
                { step: 1, text: "Open SIS Portal", link: "https://studentportal.hku.hk/" },
                { step: 2, text: "Timetables - My Weekly Schedule - List View - Choose Sem" },
                { step: 3, text: "Click Capture" }
              ].map((item, idx) => (
                <div key={idx} style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <span style={{width: '20px', height: '20px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {item.step}
                  </span>
                  <span style={{fontSize: '0.75rem', fontWeight: 600, color: '#475569', flex: 1}}>{item.text}</span>
                  {item.link && <ExternalLink size={12} style={{color: '#cbd5e1'}} />}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-up">
            <div className="flex items-center justify-between mb-4">
              <div className="tabs-container">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={14} style={{display: 'inline', marginRight: '4px'}} />
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
                >
                  <Terminal size={14} style={{display: 'inline', marginRight: '4px'}} />
                  JSON
                </button>
              </div>
              
              <div className="flex gap-2 items-center">
                 {activeTab === 'json' && (
                    <button onClick={copyJson} className="btn btn-ghost" style={{padding: '4px'}}>
                      {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                    </button>
                 )}
                 <span className="badge badge-indigo">
                   {parsedData.term.split('|')[0].trim()}
                 </span>
              </div>
            </div>

            {activeTab === 'preview' ? (
              <div className="flex flex-col gap-3">
                {parsedData.courses.map((course) => {
                  const isSelected = selectedCourseIds.has(course.id);
                  return (
                    <div 
                      key={course.id} 
                      className={`card course-card ${isSelected ? 'selected' : 'dimmed'}`}
                      onClick={() => toggleCourseSelection(course.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div style={{color: isSelected ? '#4f46e5' : '#cbd5e1'}}>
                            {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 style={{fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em'}}>{course.courseCode}</h4>
                              <span className={`badge ${course.status.includes('Enrolled') ? 'badge-success' : 'badge-warning'}`}>
                                {course.status.includes('Enrolled') ? 'Enrolled' : 'Waitlist'}
                              </span>
                            </div>
                            <p style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px'}}>
                              {course.courseTitle}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={18} style={{color: '#cbd5e1', transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s'}} />
                      </div>
                      
                      {isSelected && (
                        <div style={{marginTop: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem'}}>
                          {course.meetings.map((m, midx) => (
                            <div key={midx} style={{marginBottom: '0.75rem', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', padding: '0.75rem', border: '1px solid #f1f5f9'}}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="badge badge-indigo">{m.section} • {m.component}</span>
                                <span style={{fontSize: '9px', fontWeight: 700, color: '#94a3b8'}}>#{m.classNbr}</span>
                              </div>
                              <div className="flex items-start gap-2 mb-1.5">
                                <Clock size={12} style={{color: '#94a3b8', marginTop: '2px'}} />
                                <div style={{fontSize: '0.75rem', color: '#475569', fontWeight: 600}}>
                                  {m.daysTimes}
                                  <div style={{fontSize: '9px', color: '#94a3b8', fontWeight: 500}}>{m.dates}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={12} style={{color: '#94a3b8'}} />
                                <span style={{fontSize: '0.75rem', color: '#475569', fontWeight: 600}}>{m.room || 'TBA'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="source-view">
                {JSON.stringify(getFilteredData(), null, 2)}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      {parsedData && (
        <footer className="p-5" style={{borderTop: '1px solid #f1f5f9'}}>
          <button
            onClick={downloadIcs}
            disabled={selectedCourseIds.size === 0}
            className="btn btn-primary w-full py-3"
            style={{fontSize: '0.875rem', borderRadius: '0.75rem'}}
          >
            <Download size={16} />
            Sync {selectedCourseIds.size} Courses to Calendar
          </button>
          <div style={{textAlign: 'center', marginTop: '0.75rem'}}>
            <span style={{fontSize: '9px', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
              {parsedData.studentName}
            </span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
// vim: set ts=2 sw=2 et:
