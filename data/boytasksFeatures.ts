import { Feature } from './features';

export const boytasksFeatures: Feature[] = [
  {
    id: 'bt01',
    projectId: 'boytasks',
    category: 'ai_automation',
    title: {
      en: 'Face Recognition Brain — always-on presence detection that knows who is watching',
      no: 'Ansiktsgjenkjenningshjernen — alltid-på tilstedeværelsesdeteksjon som vet hvem som ser',
      ua: 'Мозок з розпізнавання обличь — безперервне визначення присутності, яке знає хто дивиться',
    },
    shortDescription: {
      en: 'A Python process on a VPS polls a live camera frame from Cloudflare R2 every 5 seconds, runs insightface buffalo_l recognition, and reports who is present to the YouTube gate — all without storing any video.',
      no: 'En Python-prosess på en VPS poller en live kameraramme fra Cloudflare R2 hvert 5. sekund, kjører insightface buffalo_l-gjenkjenning og rapporterer hvem som er til stede til YouTube-porten — uten å lagre noe video.',
      ua: 'Python-процес на VPS кожні 5 секунд опитує живий кадр з Cloudflare R2, запускає розпізнавання insightface buffalo_l та повідомляє YouTube-шлюзу хто присутній — без жодного збереження відео.',
    },
    problem: {
      en: 'The YouTube gate can block or unlock kids based on who is actually in front of the screen. But the system had no way to know who was there — manual PIN entry could be faked by an older sibling. The gate needed real-time presence data tied to a specific face, not just a shared PIN.',
      no: 'YouTube-porten kan blokkere eller låse opp barn basert på hvem som faktisk er foran skjermen. Men systemet hadde ingen måte å vite hvem som var der — manuell PIN-inndata kunne forfalskes av en eldre søsken. Porten trengte sanntids tilstedeværelsesdata knyttet til et bestemt ansikt, ikke bare en delt PIN.',
      ua: 'YouTube-шлюз може блокувати або розблоковувати дітей залежно від того, хто стоїть перед екраном. Але система не мала способу це знати — ручне введення PIN міг підробити старший брат. Шлюзу потрібні були дані про присутність у реальному часі, прив\'язані до конкретного обличчя.',
    },
    solution: {
      en: 'recognize_cloud.py runs on a persistent VPS with insightface buffalo_l (5-model ONNX bundle). A phone camera uploads JPEG frames to Cloudflare R2 every few seconds. The brain polls the R2 URL, decodes the frame, runs face detection + embedding match against stored npz embeddings, then POSTs the present-children list to the Cloudflare Workers gate. Models are stored in the persistent workspace so they survive container restarts. A start-brain.sh bootstrap script reinstalls Python and restarts the process after any reboot.',
      no: 'recognize_cloud.py kjører på en persistent VPS med insightface buffalo_l (5-modells ONNX-pakke). Et telefonkamera laster opp JPEG-rammer til Cloudflare R2 hvert par sekunder. Hjernen poller R2-URL-en, dekoder rammen, kjører ansiktsdeteksjon + innbyggingsmatching mot lagrede npz-innbygginger, og POSTer listen over tilstedeværende barn til Cloudflare Workers-porten. Modeller er lagret i det persistente arbeidsområdet slik at de overlever containeromstart. Et start-brain.sh bootstrap-skript reinstallerer Python og starter prosessen på nytt etter enhver omstart.',
      ua: 'recognize_cloud.py працює на персистентному VPS з insightface buffalo_l (5-модельний ONNX-пакет). Телефонна камера завантажує JPEG-кадри в Cloudflare R2 кожні кілька секунд. Мозок опитує R2-URL, декодує кадр, запускає детекцію облич + зіставлення ембедингів зі збереженими npz-ембедингами, потім POSTить список присутніх дітей до шлюзу на Cloudflare Workers. Моделі зберігаються в персистентному workspace щоб переживати перезапуски контейнера. Bootstrap-скрипт start-brain.sh переінсталює Python і перезапускає процес після будь-якого ребуту.',
    },
    result: {
      en: 'The gate now knows in real time which child is in the room. A child who skipped tasks but is detected in front of the TV gets the presence lock overlay. Presence data refreshes every 5 seconds — fast enough to catch a kid who sneaks back after a sibling logs out.',
      no: 'Porten vet nå i sanntid hvilket barn som er i rommet. Et barn som hoppet over oppgaver men oppdages foran TV-en, får tilstedeværelseslås-overlegget. Tilstedeværelsesdata oppdateres hvert 5. sekund — raskt nok til å fange et barn som sniker seg tilbake etter at en søsken logger ut.',
      ua: 'Шлюз тепер знає в реальному часі, яка дитина знаходиться в кімнаті. Дитина, яка пропустила завдання але виявлена перед телевізором, отримує оверлей блокування присутності. Дані оновлюються кожні 5 секунд — достатньо швидко, щоб помітити дитину яка повернулась після того як брат вийшов.',
    },
    techStack: ['Python', 'insightface', 'ONNX Runtime', 'Cloudflare R2', 'Cloudflare Workers', 'NumPy'],
    hashtags: ['#FaceRecognition', '#AI', '#Presence', '#CloudflareR2', '#insightface', '#Parental'],
    createdAt: '2026-07-03',
  },

  {
    id: 'bt02',
    projectId: 'boytasks',
    category: 'frontend_ux',
    title: {
      en: 'Live MJPEG Camera Background — the TV lock screen that watches back',
      no: 'Live MJPEG-kamerabakgrunn — TV-låseskjermen som ser tilbake',
      ua: 'Живий MJPEG-фон із камери — екран блокування ТВ, який стежить у відповідь',
    },
    shortDescription: {
      en: 'Instead of a static dark background, the TV PIN screen shows a continuous live feed from the room camera — children see themselves as they enter the PIN, making it obvious that the system is watching.',
      no: 'I stedet for en statisk mørk bakgrunn viser TV-PIN-skjermen en kontinuerlig livestream fra rommets kamera — barna ser seg selv mens de taster inn PIN, noe som gjør det tydelig at systemet ser.',
      ua: 'Замість статичного темного фону, екран вводу PIN на ТВ показує безперервний живий стрім із кімнатної камери — діти бачать себе в момент введення PIN, що наочно демонструє: система спостерігає.',
    },
    problem: {
      en: 'The identity gate (PIN screen) was a plain dark UI. It gave no feedback about the camera, and kids sometimes tried to trick it. A blank screen also felt cold. Showing the live feed at the exact moment of PIN entry creates implicit accountability — and is significantly harder to ignore than a blinking icon.',
      no: 'Identitetsporten (PIN-skjermen) var et enkelt mørkt UI. Det ga ingen tilbakemelding om kameraet, og barna prøvde noen ganger å lure det. En blank skjerm føltes også kald. Å vise livestrømmen akkurat i øyeblikket for PIN-inndata skaper implisitt ansvarlighet — og er betydelig vanskeligere å ignorere enn et blinkende ikon.',
      ua: 'Екран введення PIN був простим темним UI. Він не давав жодного зворотнього зв\'язку про камеру, і діти іноді намагалися обдурити систему. Порожній екран також виглядав холодно. Показ живого стріму в момент введення PIN створює неявну підзвітність — і це значно складніше ігнорувати ніж блимаючу іконку.',
    },
    solution: {
      en: 'An MJPEG endpoint (/pub/stream) was added to the Oracle camera server (camera-web.py) — no authentication, CORS open, served via nginx/SSL. The browser\'s native multipart/x-mixed-replace support renders continuous frames inside a plain <img> tag. In TvPage.tsx, the <img> is absolutely positioned as a full-screen background with object-fit: cover and a 70% dark overlay to keep the UI readable. The stream is only active while the lock screen is visible (tvUnlocked === false) — when the PIN is accepted the component unmounts, the browser closes the connection, and the server loop exits cleanly via BrokenPipeError.',
      no: 'Et MJPEG-endepunkt (/pub/stream) ble lagt til Oracle-kameraserveren (camera-web.py) — ingen autentisering, CORS åpen, servert via nginx/SSL. Nettleserens native multipart/x-mixed-replace-støtte gjengir kontinuerlige rammer inne i en enkel <img>-tag. I TvPage.tsx er <img> absolutt posisjonert som en fullskjerm-bakgrunn med object-fit: cover og et 70% mørkt overlegg for å holde UI-et lesbart. Strømmen er bare aktiv mens låseskjermen er synlig (tvUnlocked === false) — når PIN aksepteres, avmonterer komponenten, nettleseren lukker tilkoblingen og serverløkken avsluttes rent via BrokenPipeError.',
      ua: 'MJPEG-ендпоінт (/pub/stream) доданий до Oracle-камера-сервера (camera-web.py) — без авторизації, CORS відкритий, роздається через nginx/SSL. Нативна підтримка multipart/x-mixed-replace у браузері рендерить безперервні кадри в звичайному тезі <img>. У TvPage.tsx цей <img> абсолютно позиціонований як повноекранний фон з object-fit: cover та темним оверлеєм 70% для збереження читабельності UI. Стрім активний тільки поки показується екран блокування (tvUnlocked === false) — при прийнятті PIN компонент анмаунтиться, браузер закриває з\'єднання, а серверний цикл завершується через BrokenPipeError.',
    },
    result: {
      en: 'The lock screen is now a live mirror. Kids entering PIN see themselves in real time. No extra polling intervals — one persistent HTTP connection replaces a 3-second snapshot refresh cycle. Zero tokens, zero Cloudflare load: the stream flows directly from Oracle server to the TV device, bypassing Cloudflare Pages entirely.',
      no: 'Låseskjermen er nå et live speil. Barn som taster inn PIN ser seg selv i sanntid. Ingen ekstra pollingsintervaller — én persistent HTTP-tilkobling erstatter en 3-sekunders øyeblikksbildefornyingssyklus. Null tokens, null Cloudflare-belastning: strømmen flyter direkte fra Oracle-serveren til TV-enheten, og omgår Cloudflare Pages fullstendig.',
      ua: 'Екран блокування тепер — живе дзеркало. Діти, вводячи PIN, бачать себе в реальному часі. Жодних додаткових інтервалів опитування — одне постійне HTTP-з\'єднання замінює цикл оновлення знімків кожні 3 секунди. Нуль токенів, нуль навантаження на Cloudflare: стрім тече прямо з Oracle-сервера на ТВ-пристрій, повністю минаючи Cloudflare Pages.',
    },
    techStack: ['React', 'TypeScript', 'Python', 'MJPEG', 'nginx', 'Oracle Cloud'],
    hashtags: ['#MJPEG', '#LiveStream', '#UX', '#Parental', '#React', '#Camera'],
    createdAt: '2026-07-03',
  },
];
