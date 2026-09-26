# vitalii.no on the VPS

Since 2026-09-26 the site runs on the Contabo VPS instead of Netlify.

- **Build:** `.github/workflows/deploy-vps.yml` builds the Next.js standalone server on every
  push to `main` (except `scripts/**`) and uploads `site-standalone` (5 days).
- **Deploy:** `vitalii-site-deploy.timer` runs `/opt/vitalii-site/deploy.sh` every 2 min. It downloads the
  newest successful artifact with the PAT in `/home/stuar/.git-credentials`, unpacks it into
  `/opt/vitalii-site/releases/<sha>`, flips `current`, restarts `vitalii-site.service` and health-checks
  `127.0.0.1:3100`. A failing release is rolled back and marked `<sha>.bad`.
- **Serve:** `vitalii-site.service` (node `server.js`, user `stuar`, port 3100) behind the cloudflared tunnel
  `b5c0ecc5` (`/etc/cloudflared/config.yml`: `vitalii.no`, `www.vitalii.no` → `http://localhost:3100`).
  Cloudflare Cache Rule «Cache public pages 15 min» still sits in front.

Install / update the units:

```bash
install -m 755 deploy/vps/deploy.sh /opt/vitalii-site/deploy.sh
cp deploy/vps/vitalii-site*.service deploy/vps/vitalii-site-deploy.timer /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now vitalii-site vitalii-site-deploy.timer
```

Logs: `journalctl -u vitalii-site -u vitalii-site-deploy --since today`.
Force a redeploy: `rm /opt/vitalii-site/releases/<sha>.bad; systemctl start vitalii-site-deploy`.
