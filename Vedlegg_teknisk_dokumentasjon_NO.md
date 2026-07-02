# VEDLEGG — TEKNISK DOKUMENTASJON (HOTLINKING)

**Til saksnr.:** 1389177 (NTB-2026-03-0117), 1389180 (NTB-2026-03-0111), 1389185 (NTB-2026-03-0118)
**Avsender:** Vitalii Berbeha, Hagegata 8, NO-2850 Lena
**Dato:** 19.06.2026

---

## 1. Konklusjon

De tre aktuelle bildene ble aldri kopiert eller lagret på serveren til vitalii.no. De ble utelukkende vist via hotlinking (inline-lenking) direkte til utgivernes egne CDN-servere. Bildefilene ligger på utgivernes infrastruktur, ikke på vitalii.no.

---

## 2. Kilde for de tre bildene

| Saksnr. | Kreditors ref. | Bilde hentet fra | Eier av server |
|---|---|---|---|
| 1389180 | NTB-2026-03-0111 | image-www.kode24.no | kode24 (CDN) |
| 1389177 | NTB-2026-03-0117 | akamai.vgc.no | Schibsted / VG |
| 1389185 | NTB-2026-03-0118 | akamai.vgc.no | Schibsted / VG |

Bildene var allerede lovlig publisert hos VG og kode24, som har lisens fra NTB. Lenking til verk som allerede er lovlig gjort tilgjengelig med rettighetshavers samtykke, utgjør ikke en ny tilgjengeliggjøring for allmennheten, jf. EU-domstolen i Svensson (C-466/12) og BestWater (C-348/13). NTBs egen juridiske rådgiver, advokat Jon Wessel-Aas, har offentlig bekreftet at lenking til lovlig publiserte bilder er tillatt.

---

## 3. Tre uavhengige nivåer av bevis

### Nivå 1 — Database

Av 5417 publiserte nyheter: **0** bilder lagret på vitalii.no, **0** på eget lagringssystem (Supabase Storage). Verifisert med eksakt telling.

```
image_url LIKE *vitalii.no*           -> 0
image_url LIKE *supabase.co/storage*  -> 0
image_url LIKE *akamai.vgc.no*        -> ekstern URL
image_url LIKE *kode24*               -> ekstern URL
```

### Nivå 2 — Kildekode

Frontend setter den eksterne URL-en rett inn i `src`-attributtet uten å laste ned filen. Ingen lokal lagring.

```tsx
<img src={selectedNews.image_url} ... />   // ekstern URL «som den er»
```

### Nivå 3 — Live produksjon

I HTML-en på de publiserte artiklene peker `<img src>` og `og:image` direkte til utgiverens CDN:

```html
<meta property="og:image"
  content="https://akamai.vgc.no/v2/images/80b1832a-..."/>
<img src="https://akamai.vgc.no/v2/images/80b1832a-..."
     class="object-cover"/>
```

```html
<meta property="og:image"
  content="https://image-www.kode24.no/256729.jpg?imageId=256729&..."/>
<img src="https://image-www.kode24.no/256729.jpg?imageId=256729&..."
     class="object-cover"/>
```

HTTP-sjekk (19.06.2026): byte-ene leveres av utgiverens server (CloudFront / nginx Schibsted), ikke av vitalii.no.

---

## 4. Rettslig betydning

Siden det ikke foreligger noen kopi og ingen ny tilgjengeliggjøring for allmennheten, foreligger det ingen opphavsrettskrenkelse. Da finnes det heller ikke rettslig grunnlag for vederlag etter åndsverkloven § 81. Kravet er følgelig omtvistet og kan ikke drives inn ved ordinær inkasso.

---

*Dette vedlegget bygger på teknisk gjennomgang av kildekode, produksjonsdatabase og live HTML, utført 19.06.2026. Fullstendig teknisk rapport kan fremlegges på forespørsel.*
