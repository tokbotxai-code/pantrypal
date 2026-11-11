import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Brand } from '../components/Brand';

export default function Privacy() {
  return <main className="app-shell page-enter">
    <header className="topbar"><Brand /><nav className="topnav"><Link href="/" className="account-link" data-testid="link-pantry">My pantry</Link></nav></header>
    <div className="content-wrap"><section className="inventory-panel shop-panel" data-testid="page-privacy">
      <h1 className="shop-title">Privacy</h1>
      <p>PantryPal keeps your pantry and shopping list <strong>on this device only</strong>, in your browser’s storage. There are no accounts, and we do not receive, sell or share what you enter.</p>
      <p>The app loads its fonts from Google Fonts, so your browser contacts Google to fetch them. We add no advertising or analytics tools.</p>
      <p>Because nothing is stored on our side, clearing your browser data removes your pantry. Use <strong>Back up</strong> on the pantry page to save a file, and <strong>Restore</strong> to bring it back.</p>
      <p>Dates in PantryPal are labels you entered. They are not food-safety advice.</p>
      <p>Questions: <a href="mailto:contact@novopix.uk">contact@novopix.uk</a>. PantryPal is built by NovoPix. Last updated 11 November 2026.</p>
      <Link href="/" className="back-link"><ArrowLeft size={15} /> Back to my pantry</Link>
    </section></div>
  </main>;
}
