# Content Upload Testing Guide

## API Endpoints & Flow

### 1. Get S3 Upload URL
- **Endpoint**: `POST /api/v1/content/get-upload-url`
- **Headers**: 
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
- **Payload**:
```json
{
  "filename": "piano_tutorial_1234567890.mp4",
  "content_type": "video/mp4",
  "file_size": 20
}
```

### 2. Upload to S3
- **Method**: `PUT` to the presigned URL
- **Headers**: `Content-Type: video/mp4`
- **Body**: Binary video file

### 3. Create Content Record
- **Endpoint**: `PUT /api/v1/content/create-with-s3-key`
- **Headers**: 
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
- **Payload**:
```json
{
  "title": "Piano Tutorial - Moonlight Sonata",
  "description": "Learning Beethoven's masterpiece!",
  "file_key": "uploads/xxxxx/video.mp4",
  "tempo": 120,
  "notes_data": {
    "title": "Piano Tutorial - Moonlight Sonata",
    "key_signature": "C",
    "time_signature": "4/4",
    "measures": [
      {
        "measure_number": 1,
        "notes": [
          {"pitch": "C4", "duration": 200, "beat": 1.0},
          {"pitch": "D4", "duration": 300, "beat": 1.0}
        ]
      }
    ]
  }
}
```

## Sample Test Data

### Video Names (no .mp4 extension needed)
1. **Piano Tutorial - Moonlight Sonata**
2. **Guitar Cover - Wonderwall**
3. **Violin Practice Session**
4. **Jazz Improvisation Lesson**
5. **Rock Guitar Solo Tutorial**
6. **Classical Piano Etude Op 10**

### Captions
1. **🎹 Learning Beethoven's masterpiece! Still working on the tempo transitions.**
2. **🎸 My acoustic cover of this classic song! Let me know what you think in the comments.**
3. **🎻 Daily practice routine - focusing on bow control and vibrato techniques.**
4. **🎷 Experimenting with jazz scales and chord progressions. Improvisation is key!**
5. **🎸 Shredding some classic rock solos! Turn up the volume and enjoy!**
6. **🎹 Working through Chopin's Etude Op. 10 No. 4 - such a technical challenge!**

### Musical Notes Format
The app accepts notes in this format: `PITCH:DURATION,PITCH:DURATION`

#### Examples:
1. **Simple Scale**: `C4:200,D4:300,E4:200,F4:400,G4:600,A4:400,B4:200,C5:800`
2. **Chord Progression**: `G3:400,C4:200,E4:200,G4:400,C4:200,E4:200,D4:600`
3. **Arpeggio**: `A4:300,C#5:300,E5:300,A5:600,E5:300,C#5:300,A4:300`
4. **Jazz Pattern**: `D4:200,F4:200,A4:200,C5:400,A4:200,F4:200,D4:400`
5. **Rock Riff**: `E3:100,G3:100,B3:100,E4:200,B3:100,G3:100,E3:200`
6. **Classical Phrase**: `C4:150,E4:150,G4:150,C5:300,G4:150,E4:150,C4:300`

#### Note Format Explanation:
- **Pitch**: Note name + octave (e.g., C4, D#5, Bb3)
- **Duration**: Time in milliseconds (e.g., 200 = 200ms)
- **Separator**: Comma between notes

### Tempo Values
- **Slow (Largo)**: 30-60 BPM
- **Moderate (Andante)**: 60-80 BPM
- **Walking (Moderato)**: 80-120 BPM
- **Fast (Allegro)**: 120-160 BPM
- **Very Fast (Presto)**: 160-200 BPM
- **Extreme (Prestissimo)**: 200-300 BPM

## Quick Test Instructions

1. **Open CreatePostScreen**
2. **Tap "Fill Sample"** button to auto-fill test data
3. **Select a video** from your gallery
4. **Review the auto-filled data**:
   - Video name (no .mp4 needed)
   - Caption with emojis
   - Musical notes in correct format
   - Tempo (tap slider to change)
5. **Tap "Share"** to upload

## Console Logs to Check

The app will log detailed information:

```
========================================
=== STEP 1: GET S3 UPLOAD URL ===
========================================
🔗 API Endpoint: https://24pw8gqd0i.execute-api.us-east-1.amazonaws.com/api/v1/content/get-upload-url
📋 Method: POST
🔑 Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
📦 Request Payload:
{
  "filename": "piano_tutorial_1234567890.mp4",
  "content_type": "video/mp4",
  "file_size": 20
}
----------------------------------------
✅ Response Status: 200
📥 Response Data:
{
  "upload_url": "https://s3.amazonaws.com/...",
  "file_key": "uploads/user123/video.mp4"
}
========================================

========================================
=== STEP 2: S3 UPLOAD ===
========================================
🔗 S3 Upload URL: https://s3.amazonaws.com/...
🔑 File Key: uploads/user123/video.mp4
📋 Method: PUT
📁 File Type: video/mp4
----------------------------------------
✅ S3 Upload completed successfully
========================================

========================================
=== STEP 3: CREATE CONTENT RECORD ===
========================================
🔗 API Endpoint: https://24pw8gqd0i.execute-api.us-east-1.amazonaws.com/api/v1/content/create-with-s3-key
📋 Method: PUT
🔑 Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
📦 Request Payload:
{
  "title": "Piano Tutorial - Moonlight Sonata",
  "description": "Learning Beethoven's masterpiece!",
  "file_key": "uploads/user123/video.mp4",
  "tempo": 140,
  "notes_data": {...}
}
----------------------------------------
✅ Response Status: 201
📥 Response Data:
{
  "id": "content_123",
  "message": "Content created successfully"
}
========================================
```

## Test Token
The app will use this test token if no stored token exists:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NTk3YTZkMi04OGUxLTQ3OGUtYTZmNS00NGRiYWQ0ODBmMzEiLCJleHAiOjE3NTY3MTk1NTUsInR5cGUiOiJhY2Nlc3MifQ.zXOXD3QzeQ0VSmOqnVpqZ5mWtYnG6N7fdImZxGeAe_0
```

## Troubleshooting

1. **If upload fails**: Check console logs for specific error
2. **If S3 upload hangs**: Video might be too large
3. **If API returns 401**: Token may have expired
4. **If notes parsing fails**: Check format is exactly `PITCH:DURATION,PITCH:DURATION`