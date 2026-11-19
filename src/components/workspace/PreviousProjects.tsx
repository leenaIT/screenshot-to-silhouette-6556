import { useState } from 'react';
import { ChevronDown, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { previousProjects, type MapLocation } from '@/lib/map-locations';

export function PreviousProjects({ onSelect }: { onSelect: (location: MapLocation) => void }) {
  const [open, setOpen] = useState(false);
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild><Button variant="ghost" size="sm" className="h-7 gap-1 px-1 text-[10px] text-sand hover:bg-ivory/10 hover:text-ivory" aria-label="مشاريعي السابقة">مشاريعي السابقة<ChevronDown className="h-3 w-3 transition-transform duration-300 data-[open=true]:rotate-180" data-open={open} /></Button></PopoverTrigger>
    <PopoverContent dir="rtl" align="start" className="glass w-[min(330px,calc(100vw-32px))] bg-forest/95 p-2 text-ivory">
      <p className="px-2 py-2 text-[10px] text-sand">مشاريع تجريبية — ليست مشاريع محفوظة</p>
      {previousProjects.map(project => <Button key={project.id} variant="ghost" className="h-auto w-full justify-start gap-2 whitespace-normal px-2 py-3 text-right hover:bg-ivory/10 hover:text-ivory" onClick={() => { onSelect(project); setOpen(false); }}><FolderKanban className="h-4 w-4 shrink-0 text-olive" /><span className="flex-1"><span className="block text-sm">قطعة {project.number} — حي {project.district}</span><span className="mt-1 block text-xs text-ivory/55">{project.area} م²</span></span><span className={`rounded-md px-2 py-1 text-[10px] ${project.status === 'مكتمل' ? 'bg-olive/20 text-olive' : project.status === 'قيد المراجعة' ? 'bg-warn/15 text-warn' : 'bg-ivory/10 text-ivory/60'}`}>{project.status}</span></Button>)}
    </PopoverContent>
  </Popover>;
}