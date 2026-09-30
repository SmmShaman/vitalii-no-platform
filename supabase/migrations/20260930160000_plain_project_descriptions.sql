-- Replace the flowery "Imagine a world…" project descriptions with plain,
-- factual ones in the same tone as the rest of the site (owner request 2026-09-30).

UPDATE feature_projects SET
  description_en = $$A family calendar for our children's sports and activities. It pulls training sessions from Spond on both parents' accounts, mirrors our Google calendars and accepts events dictated to a Telegram bot. Everything shows up in one place: on the phone and on the TV kiosk at home.$$,
  description_no = $$En familiekalender for barnas idrett og aktiviteter. Den henter treninger fra Spond på begge foreldrenes kontoer, speiler Google-kalenderne våre og tar imot hendelser som blir diktert til en Telegram-bot. Alt vises på ett sted: på telefonen og på TV-kiosken hjemme.$$,
  description_ua = $$Сімейний календар для спорту й занять дітей. Він бере тренування зі Spond з акаунтів обох батьків, дзеркалить наші Google-календарі й приймає події, надиктовані Telegram-боту. Усе видно в одному місці: на телефоні й на телевізорі-кіоску вдома.$$
WHERE id = 'calendar_bot';

UPDATE feature_projects SET
  description_en = $$Cloud recording for an inexpensive home camera that cannot upload video by itself. A device at home forwards the camera stream to a small cloud server, which keeps 30-minute recordings for about three days and shows the live view and the archive at camera.vitalii.no behind a login.$$,
  description_no = $$Skyopptak for et rimelig hjemmekamera som ikke kan laste opp video selv. En enhet hjemme sender videostrømmen videre til en liten skyserver, som lagrer 30-minutters opptak i omtrent tre dager og viser direktebilde og arkiv på camera.vitalii.no bak innlogging.$$,
  description_ua = $$Хмарний запис для недорогої домашньої камери, яка сама не вміє вивантажувати відео. Пристрій удома пересилає потік камери на невеликий хмарний сервер, а той зберігає 30-хвилинні записи приблизно три дні й показує живе зображення та архів на camera.vitalii.no за паролем.$$
WHERE id = 'eyeplus';

UPDATE feature_projects SET
  description_en = $$A helper for job interviews in a language you don't fully master yet. It listens to the interviewer, shows a translation right away on your own device, and a cloud AI model suggests a clear answer based on your CV and the job, while the question is still being asked.$$,
  description_no = $$En hjelper til jobbintervjuer på et språk du ennå ikke mestrer fullt ut. Den lytter til intervjueren, viser en oversettelse med en gang på din egen enhet, og en KI-modell i skyen foreslår et tydelig svar basert på CV-en din og stillingen, mens spørsmålet fortsatt blir stilt.$$,
  description_ua = $$Помічник на співбесідах мовою, якою ви ще не володієте вільно. Він слухає інтерв'юера, одразу показує переклад на вашому пристрої, а хмарна ШІ-модель пропонує чітку відповідь з урахуванням вашого резюме й вакансії, поки питання ще звучить.$$
WHERE id = 'ghost_interviewer';

UPDATE feature_projects SET
  description_en = $$My own job-search system. It collects vacancies from NAV, FINN and LinkedIn, scores how well each one fits my profile, writes an application letter in Norwegian and fills in the application form on the employer's site. It reports to me in Telegram. It started as n8n workflows and now runs on its own server.$$,
  description_no = $$Mitt eget system for jobbsøking. Det henter stillinger fra NAV, FINN og LinkedIn, vurderer hvor godt hver av dem passer profilen min, skriver en søknad på norsk og fyller ut søknadsskjemaet på arbeidsgiverens side. Det rapporterer til meg på Telegram. Det startet som n8n-arbeidsflyter og går nå på egen server.$$,
  description_ua = $$Моя власна система пошуку роботи. Вона збирає вакансії з NAV, FINN і LinkedIn, оцінює, наскільки кожна підходить до мого профілю, пише супровідний лист норвезькою і заповнює форму заявки на сайті роботодавця. Звітує мені в Telegram. Починалася як workflow в n8n, тепер працює на власному сервері.$$
WHERE id = 'jobbot';

UPDATE feature_projects SET
  description_en = $$Python scripts for our family YouTube channel with about 200 videos from 2015–2025. They generate thumbnails with AI, prepare titles, descriptions and tags, add a short intro to videos and publish drafts on a schedule, all through the YouTube API and within the daily quota.$$,
  description_no = $$Python-skript for familiens YouTube-kanal med rundt 200 videoer fra 2015–2025. De lager miniatyrbilder med KI, forbereder titler, beskrivelser og tagger, legger en kort intro på videoene og publiserer utkast etter plan, alt via YouTube-API-et og innenfor den daglige kvoten.$$,
  description_ua = $$Python-скрипти для нашого сімейного YouTube-каналу з приблизно 200 відео за 2015–2025 роки. Вони генерують обкладинки за допомогою ШІ, готують назви, описи й теги, додають до відео коротке інтро й публікують чернетки за розкладом, усе через YouTube API в межах денної квоти.$$
WHERE id = 'youtube_manager';
