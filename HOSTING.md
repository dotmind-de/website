# Hosting dotmind.de

The Next.js site runs on one small **netcup** VPS in Nürnberg. **Caddy** sits in front of it and handles HTTPS. Data stays in Germany, which keeps the „Gehostet in der EU" promise true.

| | Choice |
| --- | --- |
| Provider | netcup GmbH, Karlsruhe. Data processing agreement (AVV) concluded in the CCP under Master Data → Order processing |
| Server | **VPS pico G11.5s**: 1 vCore, 1 GB RAM, 30 GB SSD, location Nürnberg (guaranteed). €2.21/month, 12-month term |
| OS | Debian 13 (trixie) |
| Address | `62.83.77.218`, `2a03:4000:f:13a9:64a9:b2ff:fea2:df3e` (hostname `dotmind`) |
| Web server | Caddy 2 (automatic Let's Encrypt certificates) |
| App | Node.js 24 LTS, running the Next.js `standalone` build as the systemd service `dotmind` |
| Domain and email | checkdomain. The domain is attached to the „Mail M" package, which also carries the `reza@dotmind.de` mailbox |

## Access

SSH accepts keys only; password login is off. The shortcut lives in `~/.ssh/config` on the Mac:

```
Host dotmind
  HostName 62.83.77.218
  User root
  IdentityFile ~/.ssh/dotmind_netcup
```

`ssh dotmind` connects. The key's passphrase is in the macOS Keychain.

## Deploying

```bash
scripts/deploy.sh
```

The script builds on the Mac (the 1 GB server is too small for `next build`). It also swaps in sharp's Linux binaries and uploads the bundle to `/srv/dotmind/releases/<timestamp>`. Then it points `/srv/dotmind/current` at the new release, restarts the service and checks that `/en` answers. The last three releases are kept.

Roll back to an older release:

```bash
ssh dotmind 'ls /srv/dotmind/releases'
```
```bash
ssh dotmind 'ln -sfn /srv/dotmind/releases/<older> /srv/dotmind/current && systemctl restart dotmind'
```

## Server layout

| Path | What |
| --- | --- |
| `/srv/dotmind/current` | Live release (symlink), run by the system user `dotmind` |
| `/etc/dotmind/env` | Runtime settings and the SMTP password for the contact form (`root:dotmind`, mode 640). After editing: `systemctl restart dotmind` |
| `/etc/systemd/system/dotmind.service` | The app service: listens on `127.0.0.1:3000`, restarts automatically, memory capped at 600 MB |
| `/etc/caddy/Caddyfile` | `www` → apex redirect, reverse proxy, security headers |
| `/var/log/caddy/dotmind.log` | Access log, kept 7 days (matches the privacy policy) |

Caddy sends `X-Forwarded-Proto: http` to the app on purpose. TLS ends at Caddy, and with `https` the German-default rewrite in `src/proxy.ts` would target `https://localhost:3000` and fail with a 500.

Hardening: ufw allows only 22, 80, 443 (tcp) and 443 (udp). Unattended security upgrades run daily. There's 2 GB of swap, and journald is capped at 200 MB / 7 days.

Useful commands:

```bash
ssh dotmind 'systemctl status dotmind caddy --no-pager'
```
```bash
ssh dotmind 'journalctl -u dotmind -n 50 --no-pager'
```

## DNS (checkdomain)

In the checkdomain customer area: Domains → dotmind.de → checkdomain Nameserver.

- **Haupt-IP-Adresse:** IPv4 `62.83.77.218`, IPv6 `2a03:4000:f:13a9:64a9:b2ff:fea2:df3e`. This field controls the apex A record. If it still holds the old webspace IP, the domain resolves to both servers.
- **Profi-Einstellungen:** A and AAAA for `dotmind.de` and `www.dotmind.de` point to the same addresses. The SPF TXT record stays.
- **E-Mail Empfang:** keep „Über checkdomain". MX (`mx03`/`mx04.secure-mailgate.com`) is managed there and can't be edited as a Profi record.

## Moving to a bigger server

Set up the new server with the steps above (Caddy, Node 24, the `dotmind` user, `/etc/dotmind/env`, the service unit). Then point the `dotmind` SSH host at it and run `scripts/deploy.sh`. Finally change the Haupt-IP-Adresse and the Profi records at checkdomain. Nothing else lives on the server.
