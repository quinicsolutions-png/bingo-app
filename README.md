# Bingo - AI Football Predictions

**Free, open-source AI football predictions with Dixon-Coles model**

![Bingo](public/icon.svg)

[![Deploy GitHub Pages](https://github.com/quinicsolutions-png/bingo-app/actions/workflows/pages.yml/badge.svg)](https://github.com/quinicsolutions-png/bingo-app/actions/workflows/pages.yml)
[![Refresh match data](https://github.com/quinicsolutions-png/bingo-app/actions/workflows/refresh-matches.yml/badge.svg)](https://github.com/quinicsolutions-png/bingo-app/actions/workflows/refresh-matches.yml)

## 📱 Install as APK (Android)

Bingo is a Progressive Web App (PWA) that can be installed on Android devices like a native app.

### Installation Steps:

1. **Open in Chrome/Edge on Android:**
   - Visit the deployed URL (e.g., `https://yourname.github.io/bingo`)
   - Or scan the QR code if available

2. **Install the App:**
   - Tap the menu (⋮) in the top-right corner
   - Select "Install app" or "Add to Home screen"
   - Confirm installation

3. **Launch:**
   - Bingo icon appears on your home screen
   - Opens in full-screen mode (no browser UI)
   - Works offline after first load

### Alternative: Direct APK Build

If you need an actual APK file:

```bash
# Install Bubblewrap (Google's PWA-to-APK tool)
npm i -g @bubblewrap/cli

# Or use PWABuilder
# Visit: https://www.pwabuilder.com/
# Enter your PWA URL and download APK
```

## 🚀 Features

- **13-match predictions** using a Dixon-Coles + Poisson model with league-standings strengths
- **Accuracy tracked publicly** — every settled pick lands in the in-app History record
- **Offline support** - works without internet
- **Installable** - behaves like native Android app
- **Free forever** - no ads, no subscriptions
- **Open source** - MIT licensed

## 🧠 How It Works

### Prediction Model

Predictions come from a real **Dixon-Coles + Poisson** pipeline
(`src/data/predict.mjs`, shared by the app and the refresh Action):

1. **Data Collection**: fixtures and league standings are fetched from
   football-data.org by the scheduled refresh Action
   (`scripts/refresh-matches.mjs`)
2. **Strength Estimation**: each team gets attack/defence multipliers from
   goals scored and conceded per game — home and away separately — shrunk
   toward the league mean while samples are small
3. **Score Matrix**: expected goals feed a Poisson score grid with the
   Dixon-Coles low-score correction, summed into 1/X/2 probabilities
4. **Fallback**: when standings are unavailable (e.g. early cup rounds or
   the Tubet feed), the model uses a neutral league-average prior plus
   home advantage — it never invents team strength

### Confidence Tiers

- **HIGH** (≥55%): Strong signal, model very confident
- **MEDIUM** (42-54%): Moderate signal, reasonable confidence
- **DRAW_ALERT** (Draw ≥30%): Tight match, draw likely
- **LOW** (<42%): Weak signal, high uncertainty

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Build Tool**: Vite
- **Hosting**: GitHub Pages (free)
- **Current data provider**: football-data.org; Tubet API integration is available for comparison but is not active by default.
- **Model**: Dixon-Coles + Poisson (open source)
- **PWA**: Service Worker + Web App Manifest

## 📊 Performance

Accuracy is computed live from the settled weeks in `public/data/history.json`
and shown on the Dashboard and History screens — nothing is hand-reported.
The public record in this repository starts from November 2026; earlier
figures from pre-reset incarnations of the project are not carried over.

## 🎯 Screens

1. **Dashboard**: Overview with stats and top picks
2. **Predictions**: All match predictions with filters
3. **History**: Track record with weekly breakdown
4. **Settings**: App info and methodology

## 🔧 Development

```bash
# Use Node.js 22+ and npm 10+
nvm install
nvm use

# Install dependencies from the lockfile
npm ci

# Run dev server
npm run dev

# Build for production
npm run build

# Test the model and provider mapping safeguards
npm run data:test

# Preview production build
npm run preview
```

### Required secret

The refresh Action needs a football-data.org API token. Add it as the
**`FOOTBALL_DATA_TOKEN`** secret under **Settings → Secrets and variables →
Actions** (a free API key from [football-data.org](https://www.football-data.org/)
works). Without it the scheduled refresh fails without publishing anything,
and the workflow opens a "Match data refresh is failing" issue to alert you.

### Evaluating the Tubet API

The scheduled refresh continues to use football-data.org by default. Tubet documents
EPL fixtures at `/api/v1/league/:id/fixtures`, but its public README does not establish
a current hosted API URL or score-freshness guarantee. Do not switch production until
those have been verified and EPL-only coverage is accepted.

To compare feeds without writing or publishing data, add `TUBET_API_BASE_URL` and
`TUBET_LEAGUE_ID` as repository Actions variables and retain `FOOTBALL_DATA_TOKEN` as
an Actions secret. Run **Refresh match data** manually with provider `tubet` and mode
`compare`; the workflow reports fixture overlap and score availability and does not
modify the slate or history files.

Only after reviewing comparison results, set the Actions variable
`TUBET_CUTOVER_APPROVED` to `true`. A manual Tubet refresh is blocked unless this
explicit approval is present. Scheduled runs remain on football-data.org. Tubet
fixtures without scores are never used to settle predictions, and invalid or empty
feeds fail before publishing.

### Uploading fixtures and bookmaker odds

Open **Settings → Upload fixtures & odds** to import bookmaker exports from Betika,
SportPesa, SportyBet, or another source. CSV, TSV, Excel (`.xlsx`/`.xls`), and JSON
files are supported. The importer previews and validates rows before saving and lets
you map non-standard column names to home team, away team, kickoff, competition, and
1/X/2 odds. Odds must be decimal prices greater than 1; missing odds are allowed.

Uploaded entries are stored only in the current browser/device and appear with the
published slate in Predictions. They do not replace the live provider, synchronize
between devices, or change model predictions. Uploads are snapshots, not live odds.

## 📦 Deployment

### Build an Android APK

Use Node.js 22+, npm 10+, Java 21, and the Android SDK. Set `ANDROID_HOME` to
your SDK directory, then run:

```bash
npm ci
npm run android:apk
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.
It is signed with the debug key — fine for local testing only. To distribute
(public APK or Play Store), create a release keystore and signing config:

```bash
# One-time: generate a keystore (keep it and its passwords safe and private;
# losing it means you can never update the same Play Store listing)
keytool -genkey -v -keystore bingo-release.keystore -alias bingo \
  -keyalg RSA -keysize 2048 -validity 10000
```

Then copy `android/keystore.properties.example` to
`android/keystore.properties` (git-ignored), fill in the keystore path and
passwords, and run:

```bash
npm run android:apk:release
```

The signed release APK is written to
`android/app/build/outputs/apk/release/app-release.apk`. Without a
`keystore.properties` file the release build falls back to the debug key,
so local builds keep working.

### GitHub Pages (Recommended)

The `.github/workflows/pages.yml` workflow builds and deploys the site whenever
you push to `main` or `master` (or run it manually from the Actions tab).
In the repository's **Settings → Pages**, set the build and deployment source
to **GitHub Actions**. Then push your changes; the deployment URL appears in
the workflow run and Pages settings.

### Other Platforms

- **Netlify**: Drag & drop `dist/` folder
- **Vercel**: Connect GitHub repo
- **Cloudflare Pages**: Connect GitHub repo

## 📱 PWA Features

- **Offline Support**: Service Worker caches essential files
- **Installable**: Web App Manifest enables "Add to Home Screen"
- **Standalone Mode**: Opens without browser UI
- **Push Notifications**: Ready for future implementation
- **Background Sync**: Ready for future implementation

## 🎨 Customization

### Change Theme Color

Edit `index.html`:
```html
<meta name="theme-color" content="#059669" />
```

### Update Icon

Replace `public/icon.svg` with your own SVG icon (512x512 recommended).

### Modify Prediction Model

Edit `src/data/predict.mjs` (probability model) and the strength estimation in
`scripts/refresh-matches.mjs` (`computeLeagueStrengths`). Tests live in
`scripts/predict.test.mjs` — run `npm run data:test` after changes.

## 📄 License

MIT License - feel free to fork, modify, and deploy.

## ⚠️ Disclaimer

This app provides statistical analysis only. It is not a betting service, does not accept wagers, and does not guarantee outcomes. Predictions are probabilistic and may be wrong. Never risk money you cannot afford to lose.

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- Better prediction models
- More leagues/competitions
- Push notifications
- User preferences
- Historical data visualization

## 📞 Support

- **Issues**: GitHub Issues
- **Active data provider**: [football-data.org](https://www.football-data.org/); [Tubet API](https://github.com/ongair/tubet_api) is staged for comparison only.
- **Model Reference**: [Dixon-Coles Model](https://github.com/DOsinga/football_predictions)

## 🙏 Credits

- **Data**: football-data.org (current); Tubet API (EPL-only evaluation, not yet active)
- **Model**: Dixon-Coles + Poisson (open source)
- **Icons**: Lucide (inline SVG)
- **Framework**: React + Vite

---

**Built with ❤️ for football fans worldwide**
