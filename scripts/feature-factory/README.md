# feature-factory — the nightly clip factory (mirror)

The LIVE copy runs on the Contabo VPS: `/root/feature-demos/factory.py`, started by
`feature-factory.timer` at 01:00 CEST (log: `/root/feature-demos/factory.log`).
This directory is a mirror committed for review and history; after editing here,
`scp` the file to the VPS and run `python3 factory.py --plan` there to see the
night's picks without waking the agent.

Rules it implements: `CLAUDE.md` (project root) and `docs/feature-demos-pipeline.md`.
