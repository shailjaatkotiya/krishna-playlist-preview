# Kanha's Playlist — Janmashtami Krishna Songs

A React site with all 40 songs from your spreadsheet, a large original
peacock-feather SVG background (vibrant teal/emerald body, gold-bronze
ocellus "eye," rendered close-up — no stock photography used, since that
requires a license this project doesn't have), and a full player bar with
play / pause / next / previous / shuffle.

## How playback actually works (please read)

There is no legal way to embed the audio of copyrighted commercial songs
(Bollywood tracks, film soundtracks, TV serial songs) directly in a website —
that would require licensed audio files, which nobody but the rights holder
can provide. So this player has **two playback engines**:

1. **Native MP3 player** (`<audio>` element, real play/pause/seek/volume) —
   used automatically for any song whose `mp3` field in
   `src/data/songs.json` points to a file under `public/audio/`. This is
   for MP3s **you own or have the rights to use** — drop them in
   `public/audio/` and set the field; see `public/audio/README.md`.
2. **YouTube fallback** — for any song left with `"mp3": ""` (the default
   for all 40 songs as shipped), pressing Play loads a hidden YouTube
   player that searches for and plays the best match. This is the same
   experience as before: pause, resume, skip, shuffle, and auto-advance
   all work — the audio is just sourced live from YouTube.

The player switches engines automatically per-track, and the little
"MP3" / "YouTube" tag next to the track counter tells you which one is
active for the current song.

This is exactly the same approach personal "bring your own files" music
players use. YouTube-engine tracks need an internet connection; MP3-engine
tracks play offline once loaded. The header also links straight to the
curated YouTube playlist for anyone who'd rather browse there directly.


## Run it locally

```bash
npm install
npm run dev       # dev server, usually http://localhost:5173
```

## Build for deployment

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally to test it
```

`dist/` is a static site — drag it into Netlify/Vercel/GitHub Pages, or any
static host, and it works as-is.

## Project structure

```
src/
  data/songs.json        ← all 40 songs (from your spreadsheet)
  components/
    NightScene.jsx        ← peacock-feather SVG background
    PlayerBar.jsx          ← bottom playback controls
    SongList.jsx           ← scrollable, categorized song list
  App.jsx                  ← state, YouTube player wiring, layout
  App.css                  ← all visual styling
```

## Adding your own MP3s

1. Drop the file into `public/audio/`, e.g. `public/audio/01-yashomati.mp3`
2. In `src/data/songs.json`, set that song's `"mp3"` field to `/audio/01-yashomati.mp3`
3. Rebuild — that track now plays natively with real seek and volume, no
   internet required

Only add files you own or have the rights to distribute. `.gitignore`
excludes `public/audio/*.mp3` by default so copyrighted audio never gets
committed by accident.

## Updating the song list

Edit `src/data/songs.json` — each entry is:

```json
{
  "id": 1,
  "category": "Classic Bollywood / Film Bhajans",
  "title": "Yashomati Maiya Se Bole Nandlala",
  "artist": "",
  "album": "Satyam Shivam Sundaram (1978)",
  "youtubeSearch": "https://www.youtube.com/results?search_query=..."
}
```
# krishna-playlist-preview
