# GitHub Push – Ionos_H2

## Repository
- GitHub: https://github.com/fhirmer/Ionos_H2
- SSH-Remote: `git@github-h2:fhirmer/Ionos_H2.git`

## Normaler Push (Dateien hochladen)

```bash
cd "/Users/flowflosn/Library/CloudStorage/GoogleDrive-h2insektenschutz@gmail.com/Meine Ablage/H2website/Uploaddatei"

git add .
git commit -m "Änderungen beschreiben"
git push
```

Das reicht — SSH läuft automatisch im Hintergrund.

## Automatisch pushen mit Claude Code

Einfach Claude Code öffnen und sagen:
> „Push die Website nach GitHub"

Claude führt dann `git add`, `git commit` und `git push` automatisch durch.

---

## Technische Details (nur zur Info)

| Was | Wo |
|-----|----|
| SSH-Key | `~/.ssh/github_h2` |
| SSH-Config | `~/.ssh/config` → Host `github-h2` |
| Port | 443 (weil Port 22 geblockt ist) |
| Deploy Key | GitHub → Ionos_H2 → Settings → Deploy keys |

Der SSH-Key ist nur für dieses Repo (`Ionos_H2`) gültig — andere Repos (z.B. Praxano) sind komplett unberührt.
