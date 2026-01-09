# Adding Your Own Interviewer Video

## Quick Guide

### Option 1: Use a Video File

1. **Get a video**:
   - Download from free stock sites like Pexels or Pixabay
   - Search for "professional person talking" or "business person"
   - Choose a subtle, looping-friendly clip

2. **Add to project**:
   ```bash
   # Place video in frontend/public folder
   frontend/public/interviewer.mp4
   ```

3. **Update AvatarPlayer.tsx**:
   Find this line (around line 68):
   ```tsx
   {/* <source src="/interviewer-video.mp4" type="video/mp4" /> */}
   ```
   
   Replace with:
   ```tsx
   <source src="/interviewer.mp4" type="video/mp4" />
   ```

### Option 2: Use Online Video URL

Update line 68 to use any video URL:
```tsx
<source src="https://your-video-url.com/video.mp4" type="video/mp4" />
```

### Option 3: Free AI Avatar Services

Use services like:
- **D-ID** - Has free tier for AI avatars
- **Synthesia** - Free trial available
- **Ready Player Me** - Free 3D avatars

## Recommended Free Stock Videos

**Pexels**:
- https://www.pexels.com/search/videos/professional%20interview/

**Pixabay**:
- https://pixabay.com/videos/search/business%20person/

## Video Format Tips

- **Format**: MP4 (H.264) for best browser support
- **Duration**: 10-30 seconds (will loop)
- **Resolution**: 1280x720 or 1920x1080
- **Aspect Ratio**: 16:9
- **File Size**: Keep under 5MB for fast loading

## Current Behavior

- **Without video**: Shows animated avatar (circle with icon)
- **With video**: Plays video when speaking, pauses when silent
- **Audio**: Web Speech API speaks independently

The fallback animated avatar is always there if video doesn't load!
