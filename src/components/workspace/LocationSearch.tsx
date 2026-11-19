import { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { searchLocations, type MapLocation } from '@/lib/map-locations';

export function LocationSearch({ onSelect }: { onSelect: (location: MapLocation) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const results = searchLocations(query);
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-ivory/70 hover:bg-ivory/10 hover:text-sand" title="البحث عن موقع" aria-label="البحث عن موقع"><Search className="h-4 w-4" /></Button></PopoverTrigger>
    <PopoverContent dir="rtl" align="end" sideOffset={12} className="glass location-search w-[min(420px,calc(100vw-32px))] bg-forest/95 p-3 text-ivory">
      <div className="flex items-center gap-2 border-b border-ivory/15 pb-3"><Search className="h-4 w-4 shrink-0 text-olive" /><input aria-label="البحث بالحي أو المخطط أو القطعة" placeholder="ابحث بالحي أو رقم المخطط أو رقم القطعة..." value={query} onChange={event => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/50" /><Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 hover:bg-ivory/10" aria-label="إغلاق البحث" onClick={() => setOpen(false)}><X className="h-3.5 w-3.5" /></Button></div>
      <p className="my-2 text-[10px] text-sand">مواقع للتجربة — الحدود والمشاريع السابقة توضيحية</p>
      <div className="max-h-72 space-y-1 overflow-y-auto" role="listbox" aria-label="نتائج البحث">
        {results.map(location => <Button key={location.id} variant="ghost" role="option" aria-selected={false} className="h-auto w-full justify-start gap-3 whitespace-normal px-2 py-3 text-right hover:bg-ivory/10 hover:text-ivory" onClick={() => { onSelect(location); setOpen(false); }}><MapPin className="h-4 w-4 shrink-0 text-olive" /><span className="min-w-0"><span className="block text-sm">قطعة {location.number} — حي {location.district}</span><span className="mt-1 block text-[11px] text-ivory/55">مخطط {location.planNumber} · {location.area} م²{!location.verified && ' · تجريبي'}</span></span></Button>)}
        {!results.length && <p role="status" className="py-6 text-center text-sm text-ivory/60">لا توجد نتائج مطابقة</p>}
      </div>
    </PopoverContent>
  </Popover>;
}