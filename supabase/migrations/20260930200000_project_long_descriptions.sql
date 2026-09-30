-- Full project descriptions shown in the project detail view (desktop modal + mobile).
-- description_* stays the short text used in lists and cards.
ALTER TABLE feature_projects
  ADD COLUMN IF NOT EXISTS long_description_en text,
  ADD COLUMN IF NOT EXISTS long_description_no text,
  ADD COLUMN IF NOT EXISTS long_description_ua text;

UPDATE feature_projects SET long_description_en = $ld$I have five sons, and screens were a daily argument. Boytasks turns that argument into a rule the house enforces by itself: first the tasks, then the TV and YouTube.

Every morning each child gets tasks for his own grade — maths, Norwegian, English and science — built on the Norwegian school curriculum (LK20), so they follow what the class is doing that week. The two youngest, who can't read yet, get their own pre-reader lessons with real letter sounds and handwritten letters. When a child finishes, the TV unlocks for a set time; bonus quizzes add YouTube time.

The living-room TV doubles as a family kiosk: calendar with training times, a live camera tile, a wall of review cards with spaced repetition, and a drawing board that any phone with a graphics tablet can paint on. Parents see every answer live and can adjust limits from their phones.

Live and used every day by our family. Runs on Cloudflare Workers, a self-hosted Supabase on my VPS, and a small agent on the home PC that controls the TV.$ld$, long_description_no = $ld$Jeg har fem sønner, og skjermtid var en daglig krangel. Boytasks gjør krangelen om til en regel som huset håndhever selv: først oppgavene, så TV og YouTube.

Hver morgen får hvert barn oppgaver for sitt eget trinn — matte, norsk, engelsk og naturfag — bygget på læreplanen LK20, slik at de følger det klassen jobber med den uka. De to yngste, som ikke kan lese ennå, får egne leksjoner med ekte bokstavlyder og håndskrevne bokstaver. Når et barn er ferdig, låses TV-en opp for en fast tid; bonusquiz gir ekstra YouTube-tid.

TV-en i stua er også en familieskjerm: kalender med treningstider, et live kamerabilde, en vegg med repetisjonskort og en tegnetavle som hvilken som helst telefon med tegnebrett kan tegne på. Foreldrene ser hvert svar live og kan justere grensene fra telefonen.

I drift og brukt hver dag av familien vår. Kjører på Cloudflare Workers, en egen Supabase på min VPS og en liten agent på hjemme-PC-en som styrer TV-en.$ld$, long_description_ua = $ld$У мене п'ятеро синів, і екрани були щоденною суперечкою. Boytasks перетворює цю суперечку на правило, яке дім виконує сам: спочатку завдання, потім телевізор і YouTube.

Щоранку кожна дитина отримує завдання для свого класу — математика, норвезька, англійська, природознавство — побудовані на норвезькій шкільній програмі LK20, тож вони йдуть за тим, що клас проходить цього тижня. Двоє наймолодших, які ще не читають, мають власні уроки зі справжніми звуками літер і рукописними буквами. Коли дитина закінчує, телевізор відкривається на визначений час; бонусні вікторини додають час на YouTube.

Телевізор у вітальні — ще й сімейний екран: календар із тренуваннями, живе зображення з камери, стіна карток для повторення і дошка для малювання, на якій можна малювати з будь-якого телефона з графічним планшетом. Батьки бачать кожну відповідь наживо й змінюють ліміти з телефона.

Працює і щодня використовується нашою родиною. Cloudflare Workers, власна Supabase на моєму VPS і невеликий агент на домашньому ПК, який керує телевізором.$ld$ WHERE id = 'boytasks';

UPDATE feature_projects SET long_description_en = $ld$Five children, several sports, two parents with separate Spond accounts — training times were scattered across apps and chats. This bot puts all of it in one calendar.

It reads training sessions and matches from Spond on both parents' accounts, mirrors our Google calendars on the server (no browser login needed) and accepts new events that I simply dictate or type to a Telegram bot. It works out which child an event belongs to, keeps the meeting time separate from the start time, and keeps cancelled events visible as struck through instead of silently deleting them.

The result shows up on our phones and on the TV kiosk at home, next to the kids' tasks. When something breaks, the bot says exactly what failed instead of a generic error.

In daily use. Built with Supabase, Telegram Bot API, the Spond API and Google Calendar.$ld$, long_description_no = $ld$Fem barn, flere idretter, to foreldre med hver sin Spond-konto — treningstidene lå spredt i apper og chatter. Denne boten samler alt i én kalender.

Den henter treninger og kamper fra Spond på begge foreldrenes kontoer, speiler Google-kalenderne våre på serveren (uten innlogging i nettleser) og tar imot nye hendelser som jeg bare dikterer eller skriver til en Telegram-bot. Den finner ut hvilket barn hendelsen gjelder, skiller oppmøtetid fra starttid og viser avlyste hendelser som gjennomstreket i stedet for å slette dem i stillhet.

Resultatet vises på telefonene våre og på TV-skjermen hjemme, ved siden av barnas oppgaver. Når noe feiler, sier boten nøyaktig hva som gikk galt.

I daglig bruk. Bygget med Supabase, Telegram Bot API, Spond API og Google Calendar.$ld$, long_description_ua = $ld$П'ятеро дітей, кілька видів спорту, двоє батьків з окремими акаунтами Spond — час тренувань був розкиданий по застосунках і чатах. Цей бот зводить усе в один календар.

Він читає тренування й матчі зі Spond з акаунтів обох батьків, дзеркалить наші Google-календарі на сервері (без входу через браузер) і приймає нові події, які я просто надиктовую або пишу Telegram-боту. Він визначає, до якої дитини належить подія, відрізняє час збору від часу початку, а скасовані події показує перекресленими, а не видаляє мовчки.

Результат видно на наших телефонах і на телевізорі вдома, поруч із завданнями дітей. Коли щось ламається, бот каже, що саме пішло не так.

Щодня в роботі. Supabase, Telegram Bot API, Spond API і Google Calendar.$ld$ WHERE id = 'calendar_bot';

UPDATE feature_projects SET long_description_en = $ld$A short video that shows a product working says more than a page of text. Recording such videos by hand takes hours, so I built a pipeline that makes them from the real product.

I describe the tour — which pages to open, where to click, what to say. A headless browser (Playwright) opens the live site and records every step, a neural voice reads the narration, and ffmpeg joins picture and sound in sync. Rendering runs on my server and is started from Telegram, so no PC has to be on.

Finished videos appear on demo-video.vitalii.no, a small site where you can watch the demos without going to YouTube, and are also queued for upload to YouTube.

Live. Built with Playwright, edge-tts, ffmpeg, a Cloudflare Worker and R2 storage.$ld$, long_description_no = $ld$En kort video som viser et produkt i bruk sier mer enn en side med tekst. Å spille inn slike videoer for hånd tar timer, så jeg laget en løsning som lager dem fra det ekte produktet.

Jeg beskriver omvisningen — hvilke sider som skal åpnes, hvor det skal klikkes, hva som skal sies. En nettleser uten skjerm (Playwright) åpner den ekte nettsiden og tar opp hvert steg, en nevral stemme leser teksten, og ffmpeg setter bilde og lyd sammen i takt. Renderingen går på serveren min og startes fra Telegram, så ingen PC trenger å stå på.

Ferdige videoer vises på demo-video.vitalii.no, en liten side der du kan se demoene uten å gå til YouTube, og legges samtidig i kø for opplasting til YouTube.

I drift. Bygget med Playwright, edge-tts, ffmpeg, en Cloudflare Worker og R2-lagring.$ld$, long_description_ua = $ld$Коротке відео, де продукт працює, каже більше, ніж сторінка тексту. Записувати такі відео вручну — години роботи, тому я зробив конвеєр, який робить їх із справжнього продукту.

Я описую тур: які сторінки відкрити, куди натиснути, що сказати. Браузер без екрана (Playwright) відкриває живий сайт і записує кожен крок, нейронний голос читає текст, а ffmpeg синхронно з'єднує картинку і звук. Рендер іде на моєму сервері й запускається з Telegram, тож жоден ПК не мусить бути ввімкненим.

Готові відео з'являються на demo-video.vitalii.no — невеликому сайті, де демо можна подивитися без YouTube, — і водночас стають у чергу на завантаження в YouTube.

Працює. Playwright, edge-tts, ffmpeg, Cloudflare Worker і сховище R2.$ld$ WHERE id = 'demo_video';

UPDATE feature_projects SET long_description_en = $ld$Elvarika started from my own problem as an immigrant in Norway: I had real texts — letters from NAV, work instructions, articles — and no quick way to learn the words in them.

You paste or upload any text, and Elvarika turns it into a lesson. It finds the words worth learning, gives each one its dictionary form, part of speech, translation in context, level (A1–C2) and example sentences, and then voices them. The result is an audio playlist you can listen to while driving or walking, plus exercises with spaced repetition so words come back right before you would forget them. It works with Norwegian, English, German, French, Spanish, Italian, Polish and Ukrainian.

For companies that hire foreign workers there is an organisation mode: an HR dashboard, ready-made courses for onboarding, roles and access control, and payments through Stripe.

Live at elvarika.com, also as an Android app. Frontend on Cloudflare Pages, self-hosted Supabase on my VPS, text analysis with Claude, voices from Google Chirp 3 HD and edge-tts.$ld$, long_description_no = $ld$Elvarika startet med mitt eget problem som innvandrer i Norge: jeg hadde ekte tekster — brev fra NAV, arbeidsinstrukser, artikler — og ingen rask måte å lære ordene i dem på.

Du limer inn eller laster opp en tekst, og Elvarika gjør den om til en leksjon. Den finner ordene som er verdt å lære, gir hvert ord grunnform, ordklasse, oversettelse i sammenheng, nivå (A1–C2) og eksempelsetninger, og leser dem høyt. Resultatet er en lydspilleliste du kan høre på i bilen eller på tur, pluss øvelser med repetisjon med mellomrom, slik at ordene kommer tilbake rett før du ville glemt dem. Den fungerer med norsk, engelsk, tysk, fransk, spansk, italiensk, polsk og ukrainsk.

For bedrifter som ansetter utenlandske arbeidere finnes en organisasjonsmodus: HR-oversikt, ferdige kurs for opplæring av nyansatte, roller og tilgangsstyring, og betaling via Stripe.

I drift på elvarika.com, også som Android-app. Frontend på Cloudflare Pages, egen Supabase på min VPS, tekstanalyse med Claude, stemmer fra Google Chirp 3 HD og edge-tts.$ld$, long_description_ua = $ld$Ельваріка виросла з моєї власної проблеми іммігранта в Норвегії: у мене були справжні тексти — листи з NAV, інструкції на роботі, статті — і жодного швидкого способу вивчити слова з них.

Ви вставляєте або завантажуєте будь-який текст, і Ельваріка робить із нього урок. Вона знаходить слова, які варто вивчити, дає кожному словникову форму, частину мови, переклад у контексті, рівень (A1–C2) і приклади речень, а потім озвучує їх. Виходить аудіоплейлист, який можна слухати в машині чи на прогулянці, плюс вправи з інтервальним повторенням, щоб слово поверталося саме тоді, коли ви його от-от забудете. Працює з норвезькою, англійською, німецькою, французькою, іспанською, італійською, польською та українською.

Для компаній, які наймають іноземних працівників, є режим організації: панель для HR, готові курси для адаптації нових людей, ролі й доступи, оплата через Stripe.

Працює на elvarika.com, також як Android-застосунок. Фронтенд на Cloudflare Pages, власна Supabase на моєму VPS, аналіз тексту — Claude, голоси — Google Chirp 3 HD і edge-tts.$ld$ WHERE id = 'elvarika';

UPDATE feature_projects SET long_description_en = $ld$We have an inexpensive EyePlus camera at home. It streams video on the local network, but it cannot save recordings to the cloud by itself — and the manufacturer's app is the only way to look at it.

I built a small cloud archive around it. A computer at home picks up the camera stream and forwards it through a secure tunnel to a small cloud server. The server cuts the stream into 30-minute recordings, keeps about three days of them, and shows the live picture and the archive on a web page behind a login. The same stream also feeds the live camera tile on the family TV kiosk (Boytasks).

In use at home. Runs on an Oracle Cloud micro server with ffmpeg and an SSH tunnel; the home side moved from an old phone to the home PC in September 2026.$ld$, long_description_no = $ld$Vi har et rimelig EyePlus-kamera hjemme. Det sender video på det lokale nettet, men kan ikke lagre opptak i skyen selv — og produsentens app er eneste måte å se på det.

Jeg bygde et lite skyarkiv rundt det. En datamaskin hjemme tar imot kamerastrømmen og sender den videre gjennom en sikker tunnel til en liten skyserver. Serveren deler strømmen i opptak på 30 minutter, beholder omtrent tre dager, og viser live-bildet og arkivet på en nettside bak innlogging. Den samme strømmen brukes også i kamerafeltet på familiens TV-skjerm (Boytasks).

I bruk hjemme. Kjører på en Oracle Cloud-mikroserver med ffmpeg og en SSH-tunnel; hjemmesiden ble flyttet fra en gammel telefon til hjemme-PC-en i september 2026.$ld$, long_description_ua = $ld$Удома в нас недорога камера EyePlus. Вона транслює відео в локальній мережі, але сама не вміє зберігати записи в хмару, а подивитися на неї можна лише через застосунок виробника.

Я зробив навколо неї невеликий хмарний архів. Комп'ютер удома забирає потік із камери й передає його через захищений тунель на маленький хмарний сервер. Сервер ріже потік на записи по 30 хвилин, зберігає приблизно три дні й показує живе зображення та архів на вебсторінці за паролем. Той самий потік живить і плитку камери на сімейному телевізорі (Boytasks).

Працює вдома. Мікросервер Oracle Cloud, ffmpeg і SSH-тунель; домашню частину у вересні 2026 перенесено зі старого телефона на домашній ПК.$ld$ WHERE id = 'eyeplus';

UPDATE feature_projects SET long_description_en = $ld$A job interview in a language you don't fully master yet is stressful: you are still translating the question in your head when you are supposed to answer. Ghost Interviewer is a quiet helper for that moment.

It listens to the interviewer through your computer, shows a translation of what is being said almost immediately, and while the question is still being asked, it suggests a clear, short answer based on your CV and the job description. You read it in your own language and answer in your own words.

I built it for my own interviews in Norwegian. The AI part runs through my own Claude subscription via a small proxy, so there is no metered API bill per interview.

Working prototype for personal use. Built with React, the Web Audio API, a Cloudflare Worker proxy and Claude.$ld$, long_description_no = $ld$Et jobbintervju på et språk du ikke mestrer helt ennå er stressende: du oversetter fortsatt spørsmålet i hodet når du skal svare. Ghost Interviewer er en stille hjelper for akkurat det øyeblikket.

Den lytter til intervjueren gjennom datamaskinen, viser en oversettelse av det som blir sagt nesten med én gang, og mens spørsmålet fortsatt stilles, foreslår den et klart og kort svar basert på CV-en din og stillingsannonsen. Du leser det på ditt eget språk og svarer med egne ord.

Jeg laget den for mine egne intervjuer på norsk. AI-delen går gjennom mitt eget Claude-abonnement via en liten proxy, så det blir ingen måleravgift per intervju.

Fungerende prototype til eget bruk. Bygget med React, Web Audio API, en Cloudflare Worker-proxy og Claude.$ld$, long_description_ua = $ld$Співбесіда мовою, якою ви ще не володієте повністю, — це стрес: ви ще перекладаєте питання в голові, а вже треба відповідати. Ghost Interviewer — тихий помічник саме для цього моменту.

Він слухає інтерв'юера через комп'ютер, майже одразу показує переклад сказаного і, поки питання ще звучить, пропонує чітку коротку відповідь на основі вашого резюме й опису вакансії. Ви читаєте її своєю мовою і відповідаєте своїми словами.

Я зробив його для власних співбесід норвезькою. ШІ працює через мою власну підписку Claude і невеликий проксі, тож за кожну співбесіду не нараховується оплата за API.

Робочий прототип для власного користування. React, Web Audio API, проксі на Cloudflare Worker і Claude.$ld$ WHERE id = 'ghost_interviewer';

UPDATE feature_projects SET long_description_en = $ld$Routers have parental controls, but they are hidden in menus, work only at home and know devices only by cryptic names. Guard gives our family one simple page for the whole home network.

It sees every device on the Wi-Fi, the Android TV stick and the PlayStation. On a phone, a parent can give each device a name, set time limits and block it with one tap — at home or from anywhere. For the PlayStation it also shows which child is logged in and which game is running.

A small agent at home logs into the router and applies the rules there, so blocking works even if a child restarts the device. A second machine stands by, so enforcement does not stop when one computer goes offline. Alerts come to Telegram.

In daily use at guard.vitalii.no. Built with a Cloudflare Worker, a D1 database, a Python home agent and a phone web app (PWA).$ld$, long_description_no = $ld$Rutere har foreldrekontroll, men den er gjemt i menyer, virker bare hjemme og kjenner enhetene bare ved kryptiske navn. Guard gir familien vår én enkel side for hele hjemmenettet.

Den ser hver enhet på Wi-Fi, Android TV-pinnen og PlayStation. På telefonen kan en forelder gi hver enhet et navn, sette tidsgrenser og blokkere den med ett trykk — hjemme eller hvor som helst. For PlayStation viser den også hvilket barn som er logget inn og hvilket spill som kjører.

En liten agent hjemme logger inn på ruteren og legger reglene der, så blokkeringen virker selv om et barn starter enheten på nytt. En ekstra maskin står i reserve, så håndhevingen ikke stopper når én datamaskin går offline. Varsler kommer i Telegram.

I daglig bruk på guard.vitalii.no. Bygget med en Cloudflare Worker, en D1-database, en Python-agent hjemme og en webapp for telefon (PWA).$ld$, long_description_ua = $ld$У роутерів є батьківський контроль, але він захований у меню, працює лише вдома і знає пристрої тільки за незрозумілими назвами. Guard дає нашій родині одну просту сторінку для всієї домашньої мережі.

Він бачить кожен пристрій у Wi-Fi, приставку Android TV і PlayStation. На телефоні батьки можуть дати кожному пристрою ім'я, поставити ліміт часу й заблокувати його одним дотиком — удома чи будь-де. Для PlayStation він показує, хто з дітей увійшов і в яку гру грає.

Невеликий агент удома сам заходить у роутер і ставить правила там, тож блокування працює, навіть якщо дитина перезапустить пристрій. Друга машина стоїть у резерві, тож контроль не зупиняється, коли один комп'ютер вимикається. Сповіщення приходять у Telegram.

Щодня в роботі на guard.vitalii.no. Cloudflare Worker, база D1, домашній агент на Python і вебзастосунок для телефона (PWA).$ld$ WHERE id = 'guard';

UPDATE feature_projects SET long_description_en = $ld$I drive a lot through small Norwegian places, and every village has a story — who lived there, why a farm has its name, what happened by that church. Guide tells me those stories while I drive.

An Android app follows my position by GPS and, as I approach a place, plays a short story about it: first a one-sentence flash, then the full story if there is time. When I stop or the road goes quiet, it tells more or starts a longer story about the whole area. Stories are read in Norwegian and Ukrainian side by side, and Norwegian names inside Ukrainian sentences are spoken by a Norwegian voice. Street names become small lessons in where the words come from.

Behind it, a runner on my server collects local history from Wikipedia, Wikidata, OpenStreetMap, the National Library and old local books, Claude writes the stories, and neural voices record them. The app works in dead zones and updates itself.

Used on my own drives. Built with a Cloudflare Worker and D1, a VPS runner, Claude, Google Chirp and edge-tts, and a native Android app.$ld$, long_description_no = $ld$Jeg kjører mye gjennom små norske steder, og hver bygd har en historie — hvem som bodde der, hvorfor en gård heter som den gjør, hva som skjedde ved kirken. Guide forteller meg disse historiene mens jeg kjører.

En Android-app følger posisjonen min med GPS og spiller en kort historie når jeg nærmer meg et sted: først en setning som smakebit, så hele historien hvis det er tid. Når jeg stopper eller veien blir stille, forteller den mer eller starter en lengre historie om hele området. Historiene leses på norsk og ukrainsk side om side, og norske navn i ukrainske setninger uttales av en norsk stemme. Gatenavn blir små leksjoner i hvor ordene kommer fra.

Bak dette samler en tjeneste på serveren min lokalhistorie fra Wikipedia, Wikidata, OpenStreetMap, Nasjonalbiblioteket og gamle bygdebøker, Claude skriver historiene, og nevrale stemmer leser dem inn. Appen virker i områder uten dekning og oppdaterer seg selv.

Brukt på mine egne turer. Bygget med en Cloudflare Worker og D1, en VPS-tjeneste, Claude, Google Chirp og edge-tts, og en egen Android-app.$ld$, long_description_ua = $ld$Я багато їжджу через маленькі норвезькі містечка, і в кожного села є своя історія: хто там жив, чому хутір так називається, що сталося біля тієї церкви. Guide розповідає мені ці історії, поки я за кермом.

Android-застосунок стежить за моїм місцем через GPS і, коли я наближаюся до якогось місця, вмикає коротку історію про нього: спершу одне речення, потім повну розповідь, якщо є час. Коли я зупиняюся або на дорозі стає тихо, він розповідає більше або починає довшу історію про всю місцевість. Історії звучать норвезькою й українською поруч, а норвезькі назви в українських реченнях вимовляє норвезький голос. Назви вулиць стають маленькими уроками про походження слів.

За цим стоїть сервіс на моєму сервері: він збирає місцеву історію з Вікіпедії, Wikidata, OpenStreetMap, Національної бібліотеки та старих краєзнавчих книг, Claude пише історії, а нейронні голоси їх озвучують. Застосунок працює без зв'язку й оновлюється сам.

Використовую у власних поїздках. Cloudflare Worker і D1, сервіс на VPS, Claude, Google Chirp і edge-tts, власний Android-застосунок.$ld$ WHERE id = 'guide';

UPDATE feature_projects SET long_description_en = $ld$Looking for work in Norway means checking NAV, FINN and LinkedIn every day, reading dozens of ads and writing a new application letter in Norwegian for each. JobBot does the routine part for me, and I keep the decisions.

Once a day it collects new vacancies from NAV, FINN and LinkedIn, removes duplicates of the same job posted on several sites, and scores how well each one fits my profile — honestly, including language requirements, years of experience and education. The good matches come to my Telegram with a short summary and buttons.

When I press "apply", an AI agent with a real browser finds the employer's own application form, creates an account on the job portal if needed (reading confirmation emails itself), fills in the form, writes the cover letter in Norwegian and submits — and then tells me what it sent. It remembers how each job portal works, so the next application on the same platform is faster. It never touches a job I have not approved.

In daily use at job.vitalii.no. It started as workflows in n8n and now runs on my own server with a self-hosted Supabase, Python workers and Claude as the agent.$ld$, long_description_no = $ld$Å søke jobb i Norge betyr å sjekke NAV, FINN og LinkedIn hver dag, lese dusinvis av annonser og skrive en ny søknad på norsk for hver av dem. JobBot gjør rutinearbeidet for meg, og jeg tar beslutningene.

En gang om dagen henter den nye stillinger fra NAV, FINN og LinkedIn, fjerner duplikater av samme jobb på flere sider, og vurderer hvor godt hver stilling passer profilen min — ærlig, med språkkrav, års erfaring og utdanning. De beste treffene kommer i Telegram med et kort sammendrag og knapper.

Når jeg trykker «søk», finner en AI-agent med ekte nettleser arbeidsgiverens eget søknadsskjema, oppretter konto på jobbportalen ved behov (og leser bekreftelses-e-postene selv), fyller ut skjemaet, skriver søknadsbrevet på norsk og sender — og forteller meg etterpå hva den sendte. Den husker hvordan hver jobbportal fungerer, så neste søknad på samme plattform går raskere. Den rører aldri en stilling jeg ikke har godkjent.

I daglig bruk på job.vitalii.no. Startet som arbeidsflyter i n8n og kjører nå på min egen server med egen Supabase, Python-arbeidere og Claude som agent.$ld$, long_description_ua = $ld$Шукати роботу в Норвегії — це щодня перевіряти NAV, FINN і LinkedIn, читати десятки оголошень і писати новий супровідний лист норвезькою для кожного. JobBot робить рутину за мене, а рішення лишаються за мною.

Раз на день він збирає нові вакансії з NAV, FINN і LinkedIn, прибирає дублікати однієї вакансії на кількох сайтах і чесно оцінює, наскільки кожна підходить до мого профілю: з вимогами до мови, років досвіду й освіти. Найкращі збіги приходять у Telegram з коротким підсумком і кнопками.

Коли я натискаю «подати», ШІ-агент зі справжнім браузером знаходить власну форму заявки роботодавця, за потреби реєструє акаунт на порталі (сам читає листи з підтвердженням), заповнює форму, пише супровідний лист норвезькою, надсилає і потім звітує мені, що саме відправив. Він пам'ятає, як влаштований кожен портал, тож наступна заявка на тій самій платформі йде швидше. Вакансії, яку я не схвалив, він не чіпає.

Щодня в роботі на job.vitalii.no. Починався як workflow в n8n, тепер працює на моєму власному сервері: власна Supabase, воркери на Python і Claude як агент.$ld$ WHERE id = 'jobbot';

UPDATE feature_projects SET long_description_en = $ld$The smaller sister of Elvarika, made for one thing: learning Norwegian by ear, while driving, cooking or walking.

I type a word, a topic, or upload a PDF or a photo, and it builds a listening lesson. For a topic, Claude writes everyday scenes at my level (A1–C1) following a plan, so the lesson covers the topic instead of repeating itself. For a list of words, each word gets its own set of independent sentences. The player mixes Norwegian with Ukrainian in the style of Ilya Frank's method — a phrase in Norwegian, then its meaning, then Norwegian again — and every 10–20 minutes stops for a short grammar exercise built from the words I just heard, following the "God i norsk" syllabus.

There is also a mode where I copy a prompt, paste an answer from another AI, and the app just voices it. A lock button keeps the player from being stopped by accident in a pocket.

Live at mini.vitalii.no. A web app (PWA) on a Cloudflare Worker and D1, with a runner on my VPS that writes and voices the lessons using Claude, Google Chirp 3 HD and Microsoft neural voices.$ld$, long_description_no = $ld$Lillesøsteren til Elvarika, laget for én ting: å lære norsk med ørene, i bilen, på kjøkkenet eller på tur.

Jeg skriver et ord, et tema, eller laster opp en PDF eller et bilde, og den lager en lyttetime. For et tema skriver Claude hverdagsscener på mitt nivå (A1–C1) etter en plan, slik at timen dekker temaet i stedet for å gjenta seg. For en ordliste får hvert ord sitt eget sett med uavhengige setninger. Spilleren blander norsk og ukrainsk etter Ilja Frank-metoden — en frase på norsk, så betydningen, så norsk igjen — og hvert 10.–20. minutt stopper den for en kort grammatikkøvelse med ordene jeg nettopp hørte, etter pensumet i «God i norsk».

Det finnes også en modus der jeg kopierer en prompt, limer inn svaret fra en annen AI, og appen bare leser det høyt. En låseknapp hindrer at spilleren stoppes ved et uhell i lomma.

I drift på mini.vitalii.no. En webapp (PWA) på en Cloudflare Worker og D1, med en tjeneste på VPS-en min som skriver og leser inn timene med Claude, Google Chirp 3 HD og Microsofts nevrale stemmer.$ld$, long_description_ua = $ld$Молодша сестра Ельваріки, зроблена для одного: вчити норвезьку на слух — у машині, на кухні чи на прогулянці.

Я пишу слово, тему або завантажую PDF чи фото, і застосунок будує урок для прослуховування. Для теми Claude пише побутові сцени мого рівня (A1–C1) за планом, тож урок покриває тему, а не ходить по колу. Для списку слів кожне слово отримує власний набір незалежних речень. Плеєр змішує норвезьку з українською за методом Іллі Франка — фраза норвезькою, потім її значення, потім знову норвезькою — і кожні 10–20 хвилин зупиняється на коротку граматичну вправу зі щойно почутих слів, за програмою «God i norsk».

Є й режим, де я копіюю промпт, вставляю відповідь іншого ШІ, і застосунок просто її озвучує. Кнопка-замок не дає випадково зупинити плеєр у кишені.

Працює на mini.vitalii.no. Вебзастосунок (PWA) на Cloudflare Worker і D1, а сервіс на моєму VPS пише й озвучує уроки за допомогою Claude, Google Chirp 3 HD і нейронних голосів Microsoft.$ld$ WHERE id = 'minielvarika';

UPDATE feature_projects SET long_description_en = $ld$This site is itself one of my projects — and it mostly runs itself.

News: it reads about 30 tech sources (RSS feeds and Telegram channels), filters out ads and empty posts with AI, and sends the rest to me in Telegram. With a few taps I approve an article; it is rewritten in English, Norwegian and Ukrainian, gets an image, and is published here and shared to LinkedIn, Facebook and Instagram. Every morning a short narrated video digest of the news is rendered and posted automatically.

Features: every night it reads the commits in my GitHub projects, finds new things I have built and writes a short case study about each one — the problem, the solution, the result — in three languages. That is where the features under each project come from. A night-time "factory" then records a narrated demo clip for some of them, showing the real product on screen, and the publisher posts two a day to social media and YouTube.

Built with Next.js, a self-hosted Supabase on my VPS, Cloudflare (tunnel, R2 storage), GitHub Actions and Remotion for video. Since September 2026 the site itself is served from my own VPS.$ld$, long_description_no = $ld$Denne nettsiden er selv et av prosjektene mine — og den driver seg stort sett selv.

Nyheter: den leser rundt 30 tekniske kilder (RSS og Telegram-kanaler), filtrerer bort reklame og tomme innlegg med AI, og sender resten til meg i Telegram. Med noen trykk godkjenner jeg en artikkel; den skrives om på engelsk, norsk og ukrainsk, får et bilde, og publiseres her og deles på LinkedIn, Facebook og Instagram. Hver morgen lages og publiseres en kort nyhetsvideo med stemme automatisk.

Funksjoner: hver natt leser den commitene i GitHub-prosjektene mine, finner nye ting jeg har bygget og skriver en kort case-studie om hver — problemet, løsningen, resultatet — på tre språk. Det er derfra funksjonene under hvert prosjekt kommer. En nattlig «fabrikk» spiller deretter inn en demovideo med stemme for noen av dem, med det ekte produktet på skjermen, og publiseringen legger ut to om dagen i sosiale medier og på YouTube.

Bygget med Next.js, egen Supabase på min VPS, Cloudflare (tunnel, R2-lagring), GitHub Actions og Remotion for video. Siden september 2026 kjører selve nettsiden på min egen VPS.$ld$, long_description_ua = $ld$Цей сайт — теж один із моїх проєктів, і він здебільшого працює сам.

Новини: він читає близько 30 технічних джерел (RSS і Telegram-канали), за допомогою ШІ відсіює рекламу й порожні пости, а решту надсилає мені в Telegram. Кількома натисками я схвалюю статтю; її переписують англійською, норвезькою та українською, додають зображення, публікують тут і поширюють у LinkedIn, Facebook та Instagram. Щоранку автоматично рендериться й публікується короткий відеодайджест новин з озвученням.

Фічі: щоночі сайт читає коміти в моїх проєктах на GitHub, знаходить нове, що я зробив, і пише про кожне короткий кейс — проблема, рішення, результат — трьома мовами. Саме звідти беруться фічі під кожним проєктом. Потім нічний «завод» записує для частини з них озвучений демо-ролик зі справжнім продуктом на екрані, а публікатор викладає по два на день у соцмережі та YouTube.

Next.js, власна Supabase на моєму VPS, Cloudflare (тунель, сховище R2), GitHub Actions і Remotion для відео. З вересня 2026 сам сайт працює на моєму власному VPS.$ld$ WHERE id = 'portfolio';

UPDATE feature_projects SET long_description_en = $ld$Many experts — coaches, psychologists, lawyers — have plenty to say but no time or skills to edit video. Voice to Video lets them publish by simply talking.

You send a voice message to a Telegram bot. The system transcribes it, turns it into a video script without inventing new facts, records a voiceover in the author's style, picks or generates matching images, adds captions and renders a finished video of up to about 10 minutes. The author gets a preview in Telegram and approves it before anything is published to YouTube.

The pipeline works end to end, and the landing page with plans is live at voiceto.vitalii.no. Development has been paused since spring 2026 while I focus on other projects.

Built with a Telegram bot, Supabase, GitHub Actions, Remotion for rendering and several AI models for transcription, script, voice and visuals.$ld$, long_description_no = $ld$Mange eksperter — coacher, psykologer, advokater — har mye å si, men verken tid eller ferdigheter til å redigere video. Voice to Video lar dem publisere ved å bare snakke.

Du sender en talemelding til en Telegram-bot. Systemet transkriberer den, gjør den om til et videomanus uten å finne på nye fakta, lager en stemme i forfatterens stil, velger eller genererer passende bilder, legger til tekst og lager en ferdig video på opptil rundt 10 minutter. Forfatteren får en forhåndsvisning i Telegram og godkjenner før noe publiseres på YouTube.

Løsningen fungerer fra start til slutt, og landingssiden med abonnementer er oppe på voiceto.vitalii.no. Utviklingen har stått på pause siden våren 2026 mens jeg jobber med andre prosjekter.

Bygget med en Telegram-bot, Supabase, GitHub Actions, Remotion for rendering og flere AI-modeller for transkripsjon, manus, stemme og bilder.$ld$, long_description_ua = $ld$Багато експертів — коучі, психологи, юристи — мають що сказати, але не мають ні часу, ні навичок монтувати відео. Voice to Video дає змогу публікувати, просто говорячи.

Ви надсилаєте голосове повідомлення Telegram-боту. Система розшифровує його, перетворює на сценарій відео без вигаданих фактів, озвучує в стилі автора, підбирає або генерує відповідні зображення, додає субтитри й рендерить готове відео тривалістю до приблизно 10 хвилин. Автор отримує попередній перегляд у Telegram і схвалює його, перш ніж щось з'явиться на YouTube.

Конвеєр працює від початку до кінця, а сторінка з тарифами доступна на voiceto.vitalii.no. З весни 2026 розробка на паузі, поки я зосереджений на інших проєктах.

Telegram-бот, Supabase, GitHub Actions, Remotion для рендеру і кілька ШІ-моделей для розшифрування, сценарію, голосу й візуалу.$ld$ WHERE id = 'voice_to_video';

UPDATE feature_projects SET long_description_en = $ld$Our family YouTube channel has about 200 videos from 2015–2025, many with no proper title, description or thumbnail. Fixing them one by one in YouTube Studio would take weeks.

These Python scripts do it in batches. They generate a thumbnail for each video with AI, prepare a title, description and tags from what the video is about, can add a short branded intro to the start of a video, and upload the changes as drafts on a schedule. Everything goes through the official YouTube API and stays within its daily quota, so the channel is updated a little every day without risk of being blocked.

A working set of tools I run when the channel needs it. Built with Python, the YouTube Data API, ffmpeg and AI image generation.$ld$, long_description_no = $ld$Familiens YouTube-kanal har rundt 200 videoer fra 2015–2025, mange uten ordentlig tittel, beskrivelse eller miniatyrbilde. Å rette dem én og én i YouTube Studio ville tatt uker.

Disse Python-skriptene gjør det i bolker. De lager et miniatyrbilde til hver video med AI, forbereder tittel, beskrivelse og tagger ut fra hva videoen handler om, kan legge til en kort intro i starten av en video, og laster opp endringene som utkast etter en plan. Alt går gjennom det offisielle YouTube API-et og holder seg innenfor den daglige kvoten, så kanalen oppdateres litt hver dag uten risiko for å bli blokkert.

Et fungerende sett verktøy jeg kjører når kanalen trenger det. Bygget med Python, YouTube Data API, ffmpeg og AI-bildegenerering.$ld$, long_description_ua = $ld$Наш сімейний YouTube-канал має близько 200 відео за 2015–2025 роки, і в багатьох немає нормальної назви, опису чи обкладинки. Виправляти їх по одному в YouTube Studio — тижні роботи.

Ці Python-скрипти роблять це пакетами. Вони генерують обкладинку для кожного відео за допомогою ШІ, готують назву, опис і теги за змістом відео, можуть додати коротке інтро на початок і завантажують зміни як чернетки за розкладом. Усе йде через офіційний YouTube API і в межах денної квоти, тож канал оновлюється потроху щодня без ризику блокування.

Робочий набір інструментів, який я запускаю, коли каналу це потрібно. Python, YouTube Data API, ffmpeg і генерація зображень ШІ.$ld$ WHERE id = 'youtube_manager';
