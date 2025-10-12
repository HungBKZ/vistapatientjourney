## EyeCare Quizzle – Landing (React + Tailwind + Framer Motion)

Modern landing page with Liquid Glass UI. Deployable on Vercel. CTA form can write to Google Sheets via Google Apps Script (no backend).

### 1) Run locally

```pwsh
npm install
npm run dev
```

### 2) Wire CTA form to Google Sheets (Apps Script)

This saves leads into a Google Sheet and you can export as Excel (.xlsx) anytime.

1. Create a Google Sheet → rename the first sheet to `Leads`.
2. Extensions → Apps Script → paste the code below:

```js
// Code.gs
function doPost(e) {
	try {
		var ss = SpreadsheetApp.getActiveSpreadsheet();
		var sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
		var data = JSON.parse(e.postData.contents);

		if (sheet.getLastRow() === 0) {
			sheet.appendRow(['timestamp', 'email', 'name', 'source', 'ua']);
		}
		sheet.appendRow([
			new Date(),
			data.email || '',
			data.name || '',
			data.source || 'beta',
			(e.parameter && e.parameter['user-agent']) || ''
		]);

		return ContentService
			.createTextOutput(JSON.stringify({ ok: true }))
			.setMimeType(ContentService.MimeType.JSON);
	} catch (err) {
		return ContentService
			.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
			.setMimeType(ContentService.MimeType.JSON);
	}
}
```

3. Deploy → New deployment → Web app.
	 - Execute as: Me
	 - Who has access: Anyone
	 - Copy the Web app URL (like `https://script.google.com/macros/s/.../exec`).

4. In project root, copy `.env.example` to `.env.local` and set:

```
VITE_APPS_SCRIPT_URL=YOUR_WEB_APP_URL
VITE_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_V3_SITE_KEY   # optional but recommended
```

5. The CTA form will send POST with `no-cors`. Treat opaque response as success.

Security tips:
- Add simple email regex check in Apps Script before append.
- Rotate the Web App URL if spam.
- Optionally add reCAPTCHA v3 on client.

#### (Optional) Verify reCAPTCHA v3 in Apps Script

Add verification before appending rows:

```js
function verifyRecaptcha(token) {
	if (!token) return false;
	var secret = 'YOUR_RECAPTCHA_V3_SECRET_KEY';
	var url = 'https://www.google.com/recaptcha/api/siteverify';
	var payload = {
		method: 'post',
		payload: { secret: secret, response: token }
	};
	var res = UrlFetchApp.fetch(url, payload);
	var json = JSON.parse(res.getContentText());
	return json.success && json.score >= 0.5; // tune threshold if needed
}

function doPost(e) {
	try {
		var data = JSON.parse(e.postData.contents);
		if (!verifyRecaptcha(data.token)) {
			return ContentService
				.createTextOutput(JSON.stringify({ ok: false, error: 'recaptcha_failed' }))
				.setMimeType(ContentService.MimeType.JSON);
		}
		// ... append to sheet as above
	} catch (err) {
		return ContentService
			.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
			.setMimeType(ContentService.MimeType.JSON);
	}
}
```

### 3) Deploy to Vercel

1. Push this repo to GitHub.
2. On Vercel → New Project → Import this repo.
3. Framework preset: Vite.
4. Add Environment Variable: `VITE_APPS_SCRIPT_URL` with the Apps Script Web App URL.
5. Deploy.

Optional: Preview locally with production build

```pwsh
npm run build
npm run preview
```

### Troubleshooting

- If Tailwind `@tailwind` shows as unknown in editor, it's just an editor lint; build is fine.
- If framer-motion animations stutter, reduce complex shadows on low-end devices.
