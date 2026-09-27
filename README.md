# Bingo - AI Football Predictions

**Free, open-source AI football predictions with Dixon-Coles model**

![Bingo](public/icon.svg)

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
npm i -g @aspect-build/aspect-cli

# Or use PWABuilder
# Visit: https://www.pwabuilder.com/
# Enter your PWA URL and download APK
```

## 🚀 Features

- **13-match predictions** using Dixon-Coles + Poisson model
- **67% accuracy** tracked publicly
- **Offline support** - works without internet
- **Installable** - behaves like native Android app
- **Free forever** - no ads, no subscriptions
- **Open source** - MIT licensed

## 🧠 How It Works

### Prediction Model

Bingo uses the **Dixon-Coles model** (1994), the gold standard for football prediction:

1. **Data Collection**: Match data from football-data.org (free API)
2. **Feature Engineering**: Form, H2H, stats, context
3. **Dixon-Coles Model**: Bivariate Poisson distribution with correlation
4. **Output**: Probabilities + confidence scores

### Confidence Tiers

- **HIGH** (≥55%): Strong signal, model very confident
- **MEDIUM** (42-54%): Moderate signal, reasonable confidence
- **DRAW_ALERT** (Draw ≥30%): Tight match, draw likely
- **LOW** (<42%): Weak signal, high uncertainty

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Build Tool**: Vite
- **Hosting**: GitHub Pages (free)
- **Data**: football-data.org (free tier)
- **Model**: Dixon-Coles + Poisson (open source)
- **PWA**: Service Worker + Web App Manifest

## 📊 Performance

- **Overall Accuracy**: 66.9%
- **High Confidence Accuracy**: 74.2%
- **Weeks Tracked**: 34
- **Total Predictions**: 442

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

# Preview production build
npm run preview
```

## 📦 Deployment

### Build an Android APK

Use Node.js 22+, npm 10+, Java 21, and the Android SDK. Set `ANDROID_HOME` to
your SDK directory, then run:

```bash
npm ci
npm run android:apk
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.
It is signed with the debug key for local installation and testing; create a
release signing configuration before distributing an APK publicly.

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

Edit `src/data/matchData.ts` to adjust the Dixon-Coles parameters.

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
- **Data Provider**: [football-data.org](https://www.football-data.org/)
- **Model Reference**: [Dixon-Coles Model](https://github.com/DOsinga/football_predictions)

## 🙏 Credits

- **Data**: football-data.org (free tier)
- **Model**: Dixon-Coles + Poisson (open source)
- **Icons**: Font Awesome
- **Framework**: React + Vite

---

**Built with ❤️ for football fans worldwide**
# bingo-football-predictions
