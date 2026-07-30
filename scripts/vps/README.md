# VPS units (Contabo, self-hosted Supabase `portfolio` stack)

The self-hosted stack has no `supabase functions deploy`. Edge Functions are just
files under `~/supabase-portfolio/volumes/functions/`, so a push touching
`supabase/functions/**` reaches production only when someone copies them over and
restarts the runtime. `portfolio-functions-deploy.sh` does that on a 5-minute timer.

Pull-based (VPS polls git) rather than a GitHub Action over SSH, so no VPS key has
to live in GitHub Secrets — the same box also runs the jobbot stack, both databases
and the nanoclaw agents.

## Install / update

```bash
sudo ln -sf /home/stuar/Projects/vitalii_claude-code-in-browser/scripts/vps/portfolio-functions-deploy.service /etc/systemd/system/
sudo ln -sf /home/stuar/Projects/vitalii_claude-code-in-browser/scripts/vps/portfolio-functions-deploy.timer   /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-functions-deploy.timer
```

The script itself is read from the clone, so `git pull` updates the deployer too;
only unit-file changes need `daemon-reload`.

## Operate

```bash
systemctl list-timers portfolio-functions-deploy.timer
sudo systemctl start portfolio-functions-deploy.service   # deploy now
tail -20 ~/portfolio-functions-deploy.log
```

## Landmines

- **Never `rsync --delete` into `volumes/functions/`.** `main/` is the generic
  edge-runtime router; it exists only on the VPS and the stack boot-errors without it.
- The script refuses to pull a dirty or diverged clone (an agent may be mid-edit) and
  logs `SKIP pull`. It still syncs whatever the clone currently holds.
- Restarts happen only on real content drift (rsync checksum), so an idle timer tick
  never interrupts a running function.
- `deploy-supabase.yml` still targets the dead managed project `uchmopqiylywnemvjttl`
  and is unrelated to this path.
