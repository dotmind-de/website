# Hosting dotmind.de

**Decided (October 2026): Render** (render.com), deployed from the private GitHub repository `dotmind-de/website`.

## Now: coming-soon page as a Render Static Site

1. Render → **New → Static Site** (not Web Service).
2. **Connect GitHub** → install the Render GitHub App on the **dotmind-de** organization → **Only select repositories** → `website`.
3. Settings:

| Field | Value |
| --- | --- |
| Name | `dotmind-coming-soon` |
| Branch | `main` |
| Root directory | *(empty)* |
| Build command | `echo "static"` |
| Publish directory | `coming-soon` |

4. After the first deploy, open `https://dotmind-coming-soon.onrender.com` and check the page, `/impressum/` and `/datenschutz/`.
5. **Custom domains:** Settings → Custom Domains → add `dotmind.de` and `www.dotmind.de`. Render shows the exact DNS records to create at your registrar (an A or ALIAS record for the apex, a CNAME for `www`). Render issues the HTTPS certificates automatically once DNS resolves.
6. **Headers (optional):** Settings → Headers → path `/*`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

Every push to `main` redeploys the page automatically.

## Later: the Next.js site as a Render Web Service

| Field | Value |
| --- | --- |
| Region | **Frankfurt (EU Central)** |
| Runtime | Node (Next.js 16 needs Node ≥ 20.9; set `NODE_VERSION=22` in the environment) |
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Plan | A paid instance. Free web services sleep when idle and take a long time to wake up, which costs inquiries. |
| Environment | `NEXT_PUBLIC_SITE_URL=https://dotmind.de` (optional; production defaults to it), mail provider keys for the forms |

Then move the custom domains from the static site to the web service and delete the static site.

## Privacy and wording

- Sign Render's data processing agreement (DPA) and fill the placeholders in `coming-soon/datenschutz/index.html` (Render's address, transfer basis, log retention).
- Render is a US company. The web service runs in Frankfurt, but avoid claims like „deutscher Hoster". Accurate wording for the site: „Gehostet in einem Rechenzentrum in Frankfurt (EU)" once the web service runs there. Update the FAQ and footer copy in CONTENT-SYSTEM.md accordingly.
- Email stays separate (e.g. mailbox.org); website DNS changes don't touch MX records.

---

## Alternative (not chosen): self-hosted on Hetzner Cloud

Recommendation: one small **Hetzner Cloud** server in Germany with **Caddy** as the web server. It serves the coming-soon page now and the Next.js site later (FRONTEND-PLAN §9.7 assumes a single EU Node server), with automatic HTTPS. Data stays in Germany, which keeps the „Gehostet in der EU" promise true.

| | Choice |
| --- | --- |
| Provider | Hetzner Online GmbH, Gunzenhausen (data centres Nürnberg / Falkenstein) |
| Server | Cloud server **CX22** (2 vCPU, 4 GB RAM), Ubuntu 24.04, location Nürnberg or Falkenstein. Roughly 4–6 €/month; check the current price. Enable backups (+20 %). |
| Web server | Caddy (automatic Let's Encrypt certificates) |
| Email | Not on this server. Use a separate EU mail provider (e.g. mailbox.org) or your registrar's mailboxes. Changing the website's A records doesn't touch your MX records. |

### 1. Server

1. Create a Hetzner Cloud account and project, add your SSH key.
2. Create the server (CX22, Ubuntu 24.04, Nürnberg or Falkenstein, backups on).
3. In the Hetzner console, sign the data processing agreement (Auftragsverarbeitungsvertrag) under account → data protection.

### 2. DNS (at your domain registrar)

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | server IPv4 |
| AAAA | `@` | server IPv6 |
| A | `www` | server IPv4 |
| AAAA | `www` | server IPv6 |

### 3. Caddy and the coming-soon page

On the server:

```bash
apt update && apt upgrade -y
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl ufw
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable
mkdir -p /var/www/dotmind
```

From your Mac, in the project folder:

```bash
scp -r coming-soon/* root@SERVER_IP:/var/www/dotmind/
```

`/etc/caddy/Caddyfile` on the server:

```caddy
www.dotmind.de {
	redir https://dotmind.de{uri} permanent
}

dotmind.de {
	root * /var/www/dotmind
	encode zstd gzip
	file_server
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
		-Server
	}
	log {
		output file /var/log/caddy/dotmind.log {
			roll_keep_for 168h
		}
	}
}
```

Then `systemctl reload caddy`. HTTPS is issued automatically once DNS points to the server. Logs are kept for 7 days, which matches the privacy policy.

### 4. Before going live

- `coming-soon/impressum/index.html`: fill in or remove the USt-IdNr. line.
- `coming-soon/datenschutz/index.html`: replace the hosting placeholder with the real provider and check the log retention. Have both legal texts checked (lawyer or a reviewed generator); the drafts are not legal advice.
- Regenerate after edits: the pages are plain HTML, so edit them directly.

### 5. Later: the Next.js site

Build with `output: "standalone"`, run it as a systemd service (or with Coolify) on port 3000, and change the `dotmind.de` block to:

```caddy
dotmind.de {
	encode zstd gzip
	reverse_proxy localhost:3000
}
```
