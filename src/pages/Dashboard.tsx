import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ShoppingCart, Download, Upload, Plus, Search, SlidersHorizontal, MapPin, Pencil, Trash2, PackageOpen, CalendarDays, ChevronDown, Leaf, House, ShoppingBasket } from 'lucide-react';
import { Brand } from '../components/Brand';
import { PantryForm } from '../components/PantryForm';
import { addToShopping, compareItems, daysUntil, displayDate, exportBackup, importBackup, readPantry, savePantry, type PantryItem } from '../data/pantry';
import { toast } from '@/hooks/use-toast';

type StatusFilter = 'all' | 'approaching' | 'passed';
function dateCue(item: PantryItem) {
  const days = daysUntil(item.date);
  if (days === null) return { label: 'No date', tone: 'none' };
  if (days < 0) return { label: 'Date passed', tone: 'passed' };
  if (days <= 7) return { label: days === 0 ? 'Date today' : `Date in ${days} day${days === 1 ? '' : 's'}`, tone: 'soon' };
  return { label: 'Later', tone: 'later' };
}

export default function Dashboard() {
  const [items, setItems] = useState<PantryItem[]>(readPantry);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [location, setLocation] = useState('All locations');
  const [dateType, setDateType] = useState('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [editing, setEditing] = useState<PantryItem | null | undefined>(undefined);
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(() => items.filter((item) => {
    const cue = dateCue(item).tone;
    return item.name.toLowerCase().includes(query.toLowerCase())
      && (category === 'All categories' || item.category === category)
      && (location === 'All locations' || item.location === location)
      && (dateType === 'all' || item.dateType === dateType)
      && (status === 'all' || (status === 'passed' ? cue === 'passed' : cue === 'soon'));
  }).sort(compareItems), [items, query, category, location, dateType, status]);
  const useFirst = useMemo(() => items.filter((i) => { const d = daysUntil(i.date); return d !== null && d <= 3 && i.quantity > 0; }).sort(compareItems), [items]);
  const soonCount = items.filter((i) => { const d = daysUntil(i.date); return d !== null && d >= 0 && d <= 7; }).length;
  const passedCount = items.filter((i) => { const d = daysUntil(i.date); return d !== null && d < 0; }).length;
  const updateItems = (next: PantryItem[]) => { setItems(next); savePantry(next); };
  const handleSave = (next: PantryItem) => {
    updateItems(items.some((i) => i.id === next.id) ? items.map((i) => i.id === next.id ? next : i) : [next, ...items]);
    setEditing(undefined);
  };
  const remove = (item: PantryItem) => {
    if (window.confirm(`Remove ${item.name} from your pantry?`)) updateItems(items.filter((i) => i.id !== item.id));
  };
  const toShopping = (item: PantryItem) => toast({ title: addToShopping(item.name) ? `${item.name} added to your shopping list` : `${item.name} is already on your shopping list` });
  const backup = () => {
    const url = URL.createObjectURL(new Blob([exportBackup()], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `pantrypal-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const restore = (file: File | undefined) => {
    if (!file) return;
    file.text().then((text) => {
      if (!window.confirm('Restoring replaces what is saved on this device with the backup. Continue?')) return;
      const result = importBackup(text);
      if (!result) { toast({ title: 'That file is not a PantryPal backup', variant: 'destructive' }); return; }
      setItems(readPantry()); toast({ title: `Restored ${result.items} pantry ${result.items === 1 ? 'item' : 'items'} and ${result.shopping} shopping ${result.shopping === 1 ? 'item' : 'items'}` });
    });
  };
  const resetFilters = () => { setQuery(''); setCategory('All categories'); setLocation('All locations'); setDateType('all'); setStatus('all'); };
  return <main className="app-shell page-enter">
    <header className="topbar"><Brand /><nav className="topnav"><span className="nav-current">My pantry</span><Link href="/shopping" className="account-link" data-testid="link-shopping">Shopping list</Link></nav></header>
    <section className="welcome-band">
      <div className="welcome-copy"><p className="eyebrow">YOUR HOME PANTRY</p><h1>A little more <em>in hand.</em></h1><p className="welcome-subtitle">Keep a clear view of what you have, right where you need it.</p></div>
      <div className="welcome-note"><span className="note-leaf"><Leaf size={20} /></span><span>Small check-ins.<br /><strong>Less second-guessing.</strong></span></div>
    </section>
    <div className="content-wrap">
      <div className="demo-notice"><span className="demo-dot" /><span><strong>Saved on this device</strong> · No account needed. Data stays in this browser.</span><Link href="/shopping" data-testid="link-create-account">Shopping list <span aria-hidden="true">→</span></Link></div>
      {useFirst.length > 0 && <section className="use-first" aria-label="Use first" data-testid="section-use-first"><h2>Use first</h2><p>Soonest recorded dates (3 days or less, including passed). Dates are labels you entered, not safety advice.</p><ul>{useFirst.map((i) => <li key={i.id}><strong>{i.name}</strong><span>{i.location} · {displayDate(i.date)} · {dateCue(i).label}</span></li>)}</ul></section>}
      <section className="overview-row" aria-label="Pantry overview">
        <div className="overview-title"><div><p className="eyebrow">AT A GLANCE</p><h2>Your inventory</h2></div><span className="item-total" data-testid="text-item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span></div>
        <div className="summary-chips">
          <button type="button" onClick={() => setStatus(status === 'approaching' ? 'all' : 'approaching')} className={`summary-chip ${status === 'approaching' ? 'selected' : ''}`} data-testid="filter-approaching">
            <span className="status-dot soon-dot" /><span><b>{soonCount}</b> approaching</span><span className="chip-arrow">↗</span>
          </button>
          <button type="button" onClick={() => setStatus(status === 'passed' ? 'all' : 'passed')} className={`summary-chip ${status === 'passed' ? 'selected' : ''}`} data-testid="filter-date-passed">
            <span className="status-dot passed-dot" /><span><b>{passedCount}</b> date passed</span><span className="chip-arrow">↗</span>
          </button>
        </div>
      </section>
      <section className="inventory-panel" aria-label="Pantry inventory">
        <div className="toolbar">
          <label className="searchbox"><Search size={18} /><span className="sr-only">Search pantry</span><input type="search" placeholder="Find an item..." value={query} onChange={(e) => setQuery(e.target.value)} data-testid="input-search" /></label>
          <button type="button" onClick={() => setMobileFilters(!mobileFilters)} className={`button button-filter ${mobileFilters ? 'filter-active' : ''}`} aria-expanded={mobileFilters} data-testid="button-toggle-filters"><SlidersHorizontal size={16} /> Filters <ChevronDown size={14} className={mobileFilters ? 'rotate' : ''} /></button>
          <button type="button" onClick={() => setEditing(null)} className="button button-primary add-button" data-testid="button-add-item"><Plus size={17} /> Add item</button>
        </div>
        <div className={`filter-row ${mobileFilters ? 'filters-open' : ''}`}>
          <label className="select-filter"><span className="sr-only">Filter by category</span><select value={category} onChange={(e) => setCategory(e.target.value)} data-testid="filter-category"><option>All categories</option>{['Dairy','Meat','Fish','Vegetables','Fruits','Bakery','Frozen','Drinks','Canned food','Snacks','Other'].map((v) => <option key={v}>{v}</option>)}</select></label>
          <label className="select-filter"><span className="sr-only">Filter by location</span><select value={location} onChange={(e) => setLocation(e.target.value)} data-testid="filter-location"><option>All locations</option>{['Fridge','Freezer','Pantry','Cupboard','Other'].map((v) => <option key={v}>{v}</option>)}</select></label>
          <label className="select-filter"><span className="sr-only">Filter by date label</span><select value={dateType} onChange={(e) => setDateType(e.target.value)} data-testid="filter-date-type"><option value="all">All date labels</option><option value="use-by">Use-by</option><option value="best-before">Best-before</option></select></label>
          <label className="select-filter"><span className="sr-only">Filter by date status</span><select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} data-testid="filter-date-status"><option value="all">Any date status</option><option value="approaching">Approaching · 7 days</option><option value="passed">Date passed</option></select></label>
          {(query || category !== 'All categories' || location !== 'All locations' || dateType !== 'all' || status !== 'all') && <button type="button" className="clear-filter" onClick={resetFilters} data-testid="button-clear-filters">Clear all</button>}
        </div>
        <div className="table-head"><span>ITEM</span><span>LOCATION</span><span>DATE LABEL</span><span>DATE</span><span className="sr-only">Actions</span></div>
        {filtered.length > 0 ? <div className="item-list">{filtered.map((item) => {
          const cue = dateCue(item);
          return <article key={item.id} className="inventory-row" data-testid={`row-item-${item.id}`}>
            <div className="item-main"><span className="item-glyph"><PackageOpen size={18} /></span><div className="item-copy"><strong>{item.name}</strong><span>{item.quantity} {item.unit} <i>·</i> {item.category}</span></div></div>
            <div className="item-location"><MapPin size={14} />{item.location}</div>
            <div className="date-type"><span className={`label-pill ${item.dateType}`}>{item.dateType === 'use-by' ? 'Use-by' : 'Best-before'}</span></div>
            <div className="item-date"><span>{displayDate(item.date)}</span><span className={`date-cue ${cue.tone}`}><span className="status-dot" />{cue.label}</span></div>
            <div className="row-actions"><button type="button" className="icon-button" aria-label={`Add ${item.name} to shopping list`} title="Add to shopping list" onClick={() => toShopping(item)} data-testid={`button-shop-${item.id}`}><ShoppingCart size={16} /></button><button type="button" className="icon-button" aria-label={`Edit ${item.name}`} onClick={() => setEditing(item)} data-testid={`button-edit-${item.id}`}><Pencil size={16} /></button><button type="button" className="icon-button delete-button" aria-label={`Delete ${item.name}`} onClick={() => remove(item)} data-testid={`button-delete-${item.id}`}><Trash2 size={16} /></button></div>
          </article>;
        })}</div> : <div className="empty-state" data-testid="empty-inventory">
          <div className="empty-icon"><PackageOpen size={24} /></div><h3>{items.length ? 'Nothing matches just now' : 'Your pantry is ready when you are'}</h3>
          <p>{items.length ? 'Try another search or clear a filter to see more.' : 'Add an item to start a simple, useful inventory.'}</p>
          {items.length ? <button type="button" className="button button-quiet" onClick={resetFilters} data-testid="button-empty-clear">Clear filters</button> : <button type="button" className="button button-primary" onClick={() => setEditing(null)} data-testid="button-empty-add"><Plus size={16} /> Add your first item</button>}
        </div>}
        <div className="table-footer"><span><CalendarDays size={14} /> Dates are reminders, not food-safety guidance.</span><span className="backup-actions">Stored in this browser <button type="button" className="clear-filter" onClick={backup} data-testid="button-backup"><Download size={13} /> Back up</button> <label className="clear-filter" data-testid="button-restore"><Upload size={13} /> Restore<input type="file" accept="application/json,.json" hidden onChange={(e) => { restore(e.target.files?.[0]); e.target.value = ''; }} /></label></span></div>
      </section>
      <footer className="page-footer"><span>PantryPal <span className="footer-separator">/</span> by NovoPix</span><span>Dates alone can’t determine food safety. Use your own judgment and local guidance. <Link href="/privacy" data-testid="link-privacy">Privacy</Link> <span className="footer-separator">/</span> <a href="mailto:contact@novopix.uk?subject=PantryPal%20feedback" data-testid="link-feedback">Send feedback</a></span></footer>
    </div>
    <nav className="mobile-nav" aria-label="Main navigation">
      <Link href="/" className="mobile-nav-item is-current" aria-current="page" data-testid="nav-pantry">
        <House size={19} strokeWidth={2} /><span>Pantry</span>
      </Link>
      <button type="button" className="mobile-nav-item mobile-nav-add" onClick={() => setEditing(null)} data-testid="nav-add-item">
        <span className="mobile-nav-add-icon"><Plus size={19} strokeWidth={2.2} /></span><span>Add item</span>
      </button>
      <Link href="/shopping" className="mobile-nav-item" data-testid="nav-shopping">
        <ShoppingBasket size={19} strokeWidth={2} /><span>Shopping</span>
      </Link>
    </nav>
    {editing !== undefined && <PantryForm item={editing} onClose={() => setEditing(undefined)} onSave={handleSave} />}
  </main>;
}
