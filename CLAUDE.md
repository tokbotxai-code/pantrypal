# PantryPal: project rules (NovoPix)

Small local-first pantry app. Owner: NovoPix, contact `contact@novopix.uk`. Language of the app: English (UK market).

## Hard rules
- **Never give food-safety verdicts.** Show only the dates the user entered, labelled as reminders. No "safe", "unsafe", "still good", "spoiled".
- No invented numbers, prices, user counts, release dates or screenshots, in the app or anywhere else.
- **No secrets in the repo or in chat**: API keys, tokens, passwords and database URLs belong in the host's environment settings only. The repo may be public.
- Do not add analytics, ads or third-party trackers. Fonts are hosted locally (`src/fonts`); the privacy page says so. If that changes, update `src/pages/Privacy.tsx`.
- Do not claim accounts, sync or payments exist until they do.

## Work rules
- Before every change: `npm run build` must pass (it type-checks). Test in a real browser at phone width (390 px) and desktop (1280 px); no horizontal scroll, no console errors.
- All data goes through `src/data/pantry.ts` (validated reads, backup/restore). Do not write to localStorage elsewhere.
- Bump `CACHE` in `public/sw.js` when you change cached files so installed copies update.
- Commit messages: plain and neutral; do not mention tools or models. Do not force-push.

## Next steps (in order)
1. Host it (Render static site via `render.yaml`) and put it behind a subdomain.
2. Use it for a week with a few real people; fix what they hit.
3. Only then consider accounts and household sync (needs a backend such as Supabase; keys go in environment settings).

## Working with the owner: do it yourself first (owner decision, 4 Nov)
- For any problem, offer several solutions. Option **1** is always what you can do **yourself**, without the owner (code, repo, scripts, a workaround in code, a different route than planned), and **do it right away**.
- Send the owner only what you cannot do (accounts, clicks in dashboards, keys, payments, uploading files).
- The owner is usually on a **phone**: short, one step at a time, no options that need a computer when another route exists. Do not ask when you can decide.
- Why: twice (PantryPal deploy, subpage routing) the problem was solved in code with no dashboard clicks.

## Jakość: sprawdzone przed oddaniem, zero „nie sprawdziłem” (decyzja właściciela 7.11)
- Właściciel buduje nową markę i ma zlecenia. Produkt niesprawny albo niedokończony kosztuje go klientów i zaufanie. **Nigdy nie oddawaj pracy, której nie przetestowałeś.** Zdanie „nie sprawdziłem, bo…” w raporcie jest porażką, nie wyjaśnieniem.
- **Przed oddaniem zawsze sam sprawdź w praktyce:** strony i aplikacje w prawdziwej przeglądarce (Playwright, telefon 390 px i komputer 1280 px, tryb ciemny, bez błędów w konsoli, bez przewijania w poziomie, kliknij każdy przycisk, zakładkę, formularz i link, także animacje i przejścia). Filmy: arkusz klatek i odsłuch długości. Posty: `getScheduledPosts` po zaplanowaniu. Skrypty: uruchom na prawdziwych danych. Zmianę w kodzie: build, typy i testy repo.
- Nie wystarczy „kod wygląda dobrze” ani test samej logiki. Obejrzyj wynik oczami użytkownika (zrzuty ekranu) i napraw każdą wadę przed oddaniem.
- Gdy czegoś naprawdę nie da się sprawdzić (np. wymaga konta lub urządzenia właściciela), znajdź własny sposób (symulacja, inny przeglądarkowy test, zapasowy kanał). Dopiero gdy to niemożliwe, napisz **jedno zdanie**, czego dokładnie nie sprawdzono i dlaczego tylko właściciel może to zrobić. Nie oddawaj tego jako gotowego.
- W raporcie podawaj, **co sprawdziłeś i z jakim wynikiem**, a nie listę rzeczy niesprawdzonych. Praca niedokończona jest dokończona przed oddaniem albo wprost nazwana „w toku” z terminem.

## Bez pytań o zgodę (decyzja właściciela 13.11, obowiązuje stale)
- **Nie pytaj właściciela o zgodę ani zatwierdzenie.** Sesje działają w trybie auto: wybierz sam najlepszą opcję, wykonaj, na końcu krótki raport (co zrobiono i co sprawdzono).
- Dotyczy planowania, zmieniania i usuwania postów w Metricool, pushów na GitHub, wdrożeń, zakładania sesji i zmian zaplanowanych zadań. Pytaj tylko, gdy czegoś nie da się zrobić bez konta, hasła, PIN-u, płatności albo kliknięcia właściciela w panelu (wtedy: jedno zdanie, jeden krok, telefon lub komputer).
- Zasady jakości, bezpieczeństwa i marek (PepSafe, Night, NovoPix osobno) obowiązują dalej. Bez sekretów w repo i czacie.
