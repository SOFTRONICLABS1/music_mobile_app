import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  FlatList
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { IconSymbol } from '../components/ui/IconSymbol';
import { useTheme } from '../theme/ThemeContext';
import API_CONFIG, { API_ENDPOINTS } from '../src/api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample music videos data
const musicVideos = [
  {
    id: '1',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    duration: '3:45',
    thumbnail: 'https://picsum.photos/120/120?random=1',
    difficulty: 'Medium',
    genre: 'Pop'
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    duration: '3:22',
    thumbnail: 'https://picsum.photos/120/120?random=2',
    difficulty: 'Hard',
    genre: 'Synth-pop'
  },
  {
    id: '3',
    title: 'Someone Like You',
    artist: 'Adele',
    duration: '4:45',
    thumbnail: 'https://picsum.photos/120/120?random=3',
    difficulty: 'Easy',
    genre: 'Ballad'
  },
  {
    id: '4',
    title: 'Uptown Funk',
    artist: 'Bruno Mars',
    duration: '4:30',
    thumbnail: 'https://picsum.photos/120/120?random=4',
    difficulty: 'Hard',
    genre: 'Funk'
  }
];

export default function CreatePostScreen({ navigation }) {
  const { theme } = useTheme();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [notesFile, setNotesFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [postData, setPostData] = useState({
    videoName: '',
    caption: '',
    notes: '',
    tempo: 120,  // Default tempo in BPM
    suggestedGames: ''  // Comma-separated game names
  });

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setPostData(prev => ({
      ...prev,
      videoName: video.title
    }));
    setShowVideoSelector(false);
  };

  const handleVideoUpload = () => {
    const options = {
      mediaType: 'video',
      quality: 0.8,
      videoQuality: 'medium',
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.errorMessage) {
        console.log('Video picker error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select video');
      } else if (response.assets && response.assets[0]) {
        const selectedVideoFile = response.assets[0];
        console.log('Selected video:', selectedVideoFile);
        
        // Create video object similar to music videos
        const videoData = {
          id: Date.now().toString(),
          title: selectedVideoFile.fileName || 'My Video',
          artist: 'You',
          duration: '0:00', // We could calculate this if needed
          thumbnail: selectedVideoFile.uri,
          uri: selectedVideoFile.uri,
          type: 'user_uploaded',
          fileSize: selectedVideoFile.fileSize, // Store actual file size in bytes
          mimeType: selectedVideoFile.type // Store actual MIME type
        };
        
        setSelectedVideo(videoData);
        setPostData(prev => ({
          ...prev,
          videoName: videoData.title
        }));
      }
    });
  };

  const handleNotesFileUpload = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [
          DocumentPicker.types.plainText,
          DocumentPicker.types.pdf,
          'text/*',
          'application/json'
        ],
        copyTo: 'documentDirectory'
      });
      
      const selectedFile = {
        name: result.name,
        type: result.type,
        uri: result.uri,
        size: result.size
      };
      
      setNotesFile(selectedFile);
      Alert.alert('Success', `File "${result.name}" selected successfully!`);
      
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled file selection');
      } else {
        console.error('File picker error:', error);
        Alert.alert('Error', 'Failed to select file. Please try again.');
      }
    }
  };

  const handleInputChange = (field, value) => {
    setPostData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Sample data generator for testing
  const fillSampleData = () => {
    const sampleNames = [
      'Piano Tutorial - Moonlight Sonata',
      'Guitar Cover - Wonderwall',
      'Violin Practice Session',
      'Jazz Improvisation',
      'Rock Guitar Solo',
      'Classical Piano Etude'
    ];
    
    const sampleCaptions = [
      '🎹 Learning Beethoven\'s masterpiece! Still working on the tempo transitions.',
      '🎸 My acoustic cover of this classic! Let me know what you think.',
      '🎻 Daily practice routine - focusing on bow control and vibrato.',
      '🎷 Experimenting with jazz scales and chord progressions.',
      '🎸 Shredding some classic rock solos! Turn up the volume!',
      '🎹 Working through Chopin\'s Etude Op. 10 No. 4 - such a challenge!'
    ];
    
    const sampleNotes = [
      'C4:200,D4:300,E4:200,F4:400,G4:600,A4:400,B4:200,C5:800',
      'G3:400,C4:200,E4:200,G4:400,C4:200,E4:200,D4:600',
      'A4:300,C#5:300,E5:300,A5:600,E5:300,C#5:300,A4:300',
      'D4:200,F4:200,A4:200,C5:400,A4:200,F4:200,D4:400',
      'E3:100,G3:100,B3:100,E4:200,B3:100,G3:100,E3:200',
      'C4:150,E4:150,G4:150,C5:300,G4:150,E4:150,C4:300'
    ];
    
    const sampleGames = [
      'Piano Tiles, Guitar Hero, Beat Saber',
      'Rock Band, Just Dance, Rocksmith',
      'Osu!, Cytus, Deemo',
      'Clone Hero, Frets on Fire, Stepmania',
      'Audiosurf, Beat Hazard, Crypt of the NecroDancer',
      'Thumper, Rez Infinite, Amplitude'
    ];
    
    const randomIndex = Math.floor(Math.random() * sampleNames.length);
    
    setPostData({
      videoName: sampleNames[randomIndex],
      caption: sampleCaptions[randomIndex],
      notes: sampleNotes[randomIndex],
      tempo: 120 + Math.floor(Math.random() * 60), // Random tempo between 120-180
      suggestedGames: sampleGames[randomIndex]
    });
    
    Alert.alert('Sample Data Added', 'Sample data has been filled in. You can modify it as needed.');
  };

  const handleCreatePost = async () => {
    if (!selectedVideo) {
      Alert.alert('Missing Video', 'Please select a video first.');
      return;
    }

    if (!postData.videoName.trim()) {
      Alert.alert('Missing Video Name', 'Please add a name for your video.');
      return;
    }

    if (!postData.caption.trim()) {
      Alert.alert('Missing Caption', 'Please add a caption for your post.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress({ step: 1, message: 'Preparing upload...' });

      // Only proceed with upload if it's a user-uploaded video
      if (!selectedVideo.uri || selectedVideo.type !== 'user_uploaded') {
        // For sample videos, just show success
        Alert.alert(
          'Post Created!',
          'Your music post has been created successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
        return;
      }

      // Get the auth token - use the updated test token if no stored token
      let authToken = await AsyncStorage.getItem('access_token');
      if (!authToken) {
        authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NTk3YTZkMi04OGUxLTQ3OGUtYTZmNS00NGRiYWQ0ODBmMzEiLCJleHAiOjE3NTY3MTk1NTUsInR5cGUiOiJhY2Nlc3MifQ.zXOXD3QzeQ0VSmOqnVpqZ5mWtYnG6N7fdImZxGeAe_0';
        console.log('Using test auth token');
      }

      // Step 1: Get S3 Upload URL
      const fileName = `${postData.videoName.trim().replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.mp4`;
      
      // Get actual file size in bytes from selected video
      const fileSizeInBytes = selectedVideo.fileSize || 52428800; // Default to 50MB if not available
      
      // Ensure proper MIME type format - always use video/mp4 for uploaded videos
      let contentType = 'video/mp4';
      
      // Use stored MIME type if available, otherwise fall back to selectedVideo.type
      if (selectedVideo.mimeType && selectedVideo.mimeType.includes('/')) {
        contentType = selectedVideo.mimeType;
      } else if (selectedVideo.type && selectedVideo.type.includes('/')) {
        contentType = selectedVideo.type;
      }
      
      const uploadUrlPayload = {
        filename: fileName,
        content_type: contentType,
        file_size: fileSizeInBytes
      };

      console.log('\n========================================');
      console.log('=== STEP 1: GET S3 UPLOAD URL ===');
      console.log('========================================');
      console.log('🔗 API Endpoint:', `${API_CONFIG.BASE_URL}/content/get-upload-url`);
      console.log('📋 Method: POST');
      console.log('🔑 Authorization:', authToken ? `Bearer ${authToken.substring(0, 30)}...` : 'No token found');
      console.log('📦 Request Payload:');
      console.log(JSON.stringify(uploadUrlPayload, null, 2));
      console.log('----------------------------------------');

      setUploadProgress({ step: 1, message: 'Getting upload URL...' });

      const uploadUrlResponse = await fetch(`${API_CONFIG.BASE_URL}/content/get-upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json'
        },
        body: JSON.stringify(uploadUrlPayload),
      });

      const uploadUrlData = await uploadUrlResponse.json();
      console.log('✅ Response Status:', uploadUrlResponse.status);
      console.log('📥 Response Data:');
      console.log(JSON.stringify(uploadUrlData, null, 2));
      console.log('========================================\n');

      if (!uploadUrlResponse.ok) {
        throw new Error(uploadUrlData.message || `Failed to get upload URL: ${uploadUrlResponse.status}`);
      }

      // Step 2: Upload to S3 using POST with form fields
      setUploadProgress({ step: 2, message: 'Uploading video to S3...', percentage: 0 });

      console.log('\n========================================');
      console.log('=== STEP 2: S3 UPLOAD ===');
      console.log('========================================');
      console.log('🔗 S3 Upload URL:', uploadUrlData.upload_url);
      console.log('🔑 S3 Key:', uploadUrlData.s3_key);
      console.log('📋 Method: POST (with form fields)');
      console.log('📁 Fields:', uploadUrlData.fields);
      console.log('----------------------------------------');
      
      // Create FormData with S3 fields and file
      const s3FormData = new FormData();
      
      // Add all the required S3 form fields
      if (uploadUrlData.fields) {
        Object.entries(uploadUrlData.fields).forEach(([key, value]) => {
          s3FormData.append(key, value);
          console.log(`📝 Form field: ${key} = ${value}`);
        });
      }
      
      // Add the file last (AWS S3 requirement)
      s3FormData.append('file', {
        uri: selectedVideo.uri,
        type: 'video/mp4',
        name: uploadUrlData.fields?.key || 'video.mp4',
      });
      
      console.log('📤 Uploading file to S3...');
      
      // Upload with progress tracking
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress({ 
            step: 2, 
            message: `Uploading video to S3... ${percentComplete}%`, 
            percentage: percentComplete 
          });
        }
      };

      // Create a promise for the XHR request
      const s3UploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          console.log('S3 Upload Response Status:', xhr.status);
          console.log('S3 Upload Response:', xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            // Check if it's an AWS credential error - retry once
            if (xhr.status === 403 && (xhr.responseText.includes('InvalidAccessKeyId') || xhr.responseText.includes('SignatureDoesNotMatch'))) {
              reject(new Error('RETRY_UPLOAD'));
            } else {
              reject(new Error(`S3 upload failed: ${xhr.status} - ${xhr.responseText}`));
            }
          }
        };
        xhr.onerror = () => reject(new Error('S3 upload network error'));
        
        xhr.open('POST', uploadUrlData.upload_url);
        // Don't set Content-Type header for FormData - let browser set it with boundary
        xhr.send(s3FormData);
      });

      try {
        await s3UploadPromise;
        console.log('✅ S3 Upload completed successfully');
        console.log('========================================\n');
      } catch (error) {
        if (error.message === 'RETRY_UPLOAD') {
          console.log('🔄 Credentials expired, getting fresh presigned URL...');
          setUploadProgress({ step: 2, message: 'Getting fresh upload credentials...' });
          
          // Wait 2 seconds to allow backend to refresh credentials
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Get fresh presigned URL
          const retryUploadUrlResponse = await fetch(`${API_CONFIG.BASE_URL}/content/get-upload-url`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
              'accept': 'application/json'
            },
            body: JSON.stringify(uploadUrlPayload),
          });

          const retryUploadUrlData = await retryUploadUrlResponse.json();
          
          if (!retryUploadUrlResponse.ok) {
            throw new Error(retryUploadUrlData.message || `Failed to get retry upload URL: ${retryUploadUrlResponse.status}`);
          }

          // Retry S3 upload with fresh credentials
          const retryS3FormData = new FormData();
          
          if (retryUploadUrlData.fields) {
            Object.entries(retryUploadUrlData.fields).forEach(([key, value]) => {
              retryS3FormData.append(key, value);
            });
          }
          
          retryS3FormData.append('file', {
            uri: selectedVideo.uri,
            type: 'video/mp4',
            name: retryUploadUrlData.fields?.key || 'video.mp4',
          });

          const retryXhr = new XMLHttpRequest();
          
          retryXhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setUploadProgress({ 
                step: 2, 
                message: `Retrying upload to S3... ${percentComplete}%`, 
                percentage: percentComplete 
              });
            }
          };

          const retryUploadPromise = new Promise((resolve, reject) => {
            retryXhr.onload = () => {
              if (retryXhr.status >= 200 && retryXhr.status < 300) {
                resolve(retryXhr.response);
              } else {
                if (retryXhr.status === 403 && (retryXhr.responseText.includes('InvalidAccessKeyId') || retryXhr.responseText.includes('SignatureDoesNotMatch'))) {
                  reject(new Error('AWS credentials are still expired on the server. Please contact support or try again in a few minutes.'));
                } else {
                  reject(new Error(`S3 retry upload failed: ${retryXhr.status} - ${retryXhr.responseText}`));
                }
              }
            };
            retryXhr.onerror = () => reject(new Error('S3 retry upload network error'));
            
            retryXhr.open('POST', retryUploadUrlData.upload_url);
            retryXhr.send(retryS3FormData);
          });

          await retryUploadPromise;
          
          // Update s3_key for content creation
          uploadUrlData.s3_key = retryUploadUrlData.s3_key;
          
          console.log('✅ S3 Retry Upload completed successfully');
          console.log('========================================\n');
        } else {
          throw error;
        }
      }

      // Step 3: Create content record with S3 key
      setUploadProgress({ step: 3, message: 'Creating content record...' });

      // Parse notes data if provided
      let notesData = null;
      if (postData.notes) {
        // Check if notes are in musical notation format or just text
        if (postData.notes.includes(':')) {
          // Parse musical notation format (e.g., "C4:200,D4:300")
          const notes = postData.notes.split(',').map(note => {
            const [pitch, duration] = note.trim().split(':');
            return { 
              pitch: pitch.toUpperCase(), 
              duration: parseInt(duration) || 200,
              beat: 1.0 
            };
          });
          
          notesData = {
            title: postData.videoName.trim(),
            key_signature: "C",
            time_signature: "4/4",
            measures: [
              {
                measure_number: 1,
                notes: notes
              }
            ]
          };
        } else {
          // Just plain text notes
          notesData = {
            title: postData.videoName.trim(),
            key_signature: "C",
            time_signature: "4/4",
            measures: [
              {
                measure_number: 1,
                notes: [
                  { pitch: "C4", duration: "quarter", beat: 1.0 }
                ]
              }
            ]
          };
        }
      }

      // Determine content_type based on what we're uploading
      let apiContentType = 'media_file'; // Default for uploaded files
      let apiMediaType = 'video'; // Default media type
      
      // Dynamically set media_type based on actual file type
      if (selectedVideo.mimeType) {
        if (selectedVideo.mimeType.startsWith('audio/')) {
          apiMediaType = 'audio';
        } else if (selectedVideo.mimeType.startsWith('video/')) {
          apiMediaType = 'video';
        }
      }
      
      // If user only provided notes without media file, use notes_only
      if (!selectedVideo.uri && notesData) {
        apiContentType = 'notes_only';
        apiMediaType = 'notation';
      }

      const createContentPayload = {
        title: postData.videoName.trim(),
        description: postData.caption.trim(),
        content_type: apiContentType,
        media_type: apiMediaType,
        social_url: null,
        social_platform: null,
        notes_data: notesData,
        tempo: postData.tempo || 120,
        is_public: true,
        access_type: 'free',
        tags: []
      };

      // Create API URL with s3_key as query parameter
      const s3KeyParam = encodeURIComponent(uploadUrlData.s3_key);
      const createContentUrl = `${API_CONFIG.BASE_URL}/content/create-with-s3-key?s3_key=${s3KeyParam}`;

      console.log('\n========================================');
      console.log('=== STEP 3: CREATE CONTENT RECORD ===');
      console.log('========================================');
      console.log('🔗 API Endpoint:', createContentUrl);
      console.log('📋 Method: POST');
      console.log('🔑 Authorization:', authToken ? `Bearer ${authToken.substring(0, 30)}...` : 'No token found');
      console.log('🔑 S3 Key:', uploadUrlData.s3_key);
      console.log('📦 Request Payload:');
      console.log(JSON.stringify(createContentPayload, null, 2));
      console.log('----------------------------------------');

      const createResponse = await fetch(createContentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json'
        },
        body: JSON.stringify(createContentPayload),
      });

      const createResponseData = await createResponse.json();
      console.log('✅ Response Status:', createResponse.status);
      console.log('📥 Response Data:');
      console.log(JSON.stringify(createResponseData, null, 2));
      console.log('========================================\n');

      if (createResponse.ok) {
        setUploadProgress({ step: 4, message: 'Upload complete!', complete: true });
        
        Alert.alert(
          'Post Created!',
          'Your music content has been uploaded successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        throw new Error(createResponseData.message || `Server error: ${createResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Failed to create post:', error);
      Alert.alert(
        'Upload Failed',
        error.message || 'Failed to create your post. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#666666';
    }
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.videoItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={() => handleVideoSelect(item)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
      <View style={styles.videoInfo}>
        <Text style={[styles.videoTitle, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.videoArtist, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.artist}
        </Text>
        <View style={styles.videoMeta}>
          <Text style={[styles.videoDuration, { color: theme.textTertiary }]}>
            {item.duration}
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelButton, { color: theme.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Create Post</Text>
        <TouchableOpacity onPress={handleCreatePost} disabled={isUploading}>
          <Text style={[styles.shareButton, { 
            color: isUploading ? theme.textTertiary : theme.primary,
            opacity: isUploading ? 0.6 : 1 
          }]}>
            {isUploading ? 'Uploading...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Music Video Selection */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Music Video</Text>
          
          {selectedVideo ? (
            <TouchableOpacity
              style={[styles.selectedVideoContainer, { borderColor: theme.primary }]}
              onPress={() => setShowVideoSelector(true)}
            >
              <Image source={{ uri: selectedVideo.thumbnail }} style={styles.selectedVideoThumbnail} />
              <View style={styles.selectedVideoInfo}>
                <Text style={[styles.selectedVideoTitle, { color: theme.text }]}>
                  {selectedVideo.title}
                </Text>
                <Text style={[styles.selectedVideoArtist, { color: theme.textSecondary }]}>
                  {selectedVideo.artist}
                </Text>
                <Text style={[styles.selectedVideoDuration, { color: theme.textTertiary }]}>
                  {selectedVideo.duration} • {selectedVideo.genre}
                </Text>
              </View>
              <Text style={[styles.changeText, { color: theme.primary }]}>Change</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.selectVideoButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={handleVideoUpload}
            >
              <Text style={[styles.selectVideoIcon, { color: theme.primary }]}>🎵</Text>
              <Text style={[styles.selectVideoText, { color: theme.textSecondary }]}>
                Upload
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Music Notes Section */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Music Notes</Text>
          
          {notesFile && (
            <View style={[styles.uploadedFileContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.uploadedFileName, { color: theme.text }]}>📄 {notesFile.name}</Text>
              <TouchableOpacity onPress={() => setNotesFile(null)}>
                <Text style={[styles.removeFileText, { color: theme.error || '#FF3B30' }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.notesInputContainer}>
            <TextInput
              style={[styles.textInput, styles.notesInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              value={postData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="e.g: C4:200,D4:300,E4:200,F4:400,G4:600"
              placeholderTextColor={theme.textTertiary}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.uploadNotesButtonBelow, { backgroundColor: theme.primary }]}
              onPress={handleNotesFileUpload}
            >
              <Text style={[styles.uploadButtonText, { color: 'white' }]}>📄 Select File</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tempo Section */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>BPM</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              value={postData.tempo.toString()}
              onChangeText={(value) => {
                const numValue = parseInt(value) || 120;
                handleInputChange('tempo', numValue);
              }}
              placeholder="120"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Suggested Games Section */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <View style={styles.sectionHeaderWithInfo}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Suggested Games</Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => Alert.alert(
                'Suggested Games',
                'If user has chosen game/games, those will be suggested for the user to play along with your music content.',
                [{ text: 'OK' }]
              )}
            >
              <Text style={[styles.infoButtonText, { color: theme.textTertiary }]}>ℹ️</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              value={postData.suggestedGames}
              onChangeText={(value) => handleInputChange('suggestedGames', value)}
              placeholder="e.g: Piano Tiles, Guitar Hero, Beat Saber"
              placeholderTextColor={theme.textTertiary}
            />
          </View>
        </View>

        {/* Post Details Form */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Post Details</Text>
            <TouchableOpacity
              style={[styles.sampleDataButton, { backgroundColor: theme.primary }]}
              onPress={fillSampleData}
            >
              <Text style={styles.sampleDataButtonText}>Fill Sample</Text>
            </TouchableOpacity>
          </View>
          
          {/* Video Name */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Title</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              value={postData.videoName}
              onChangeText={(value) => handleInputChange('videoName', value)}
              placeholder="e.g: My Piano Cover, Song Tutorial (no .mp4 needed)"
              placeholderTextColor={theme.textTertiary}
            />
          </View>

          {/* Caption */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Caption</Text>
            <TextInput
              style={[styles.textInput, styles.captionInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              value={postData.caption}
              onChangeText={(value) => handleInputChange('caption', value)}
              placeholder="Write a caption for your music post..."
              placeholderTextColor={theme.textTertiary}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

        </View>
      </ScrollView>

      {/* Upload Progress Indicator */}
      {isUploading && uploadProgress && (
        <View style={[styles.progressContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <Text style={[styles.progressText, { color: theme.text }]}>
            {uploadProgress.message}
          </Text>
          {uploadProgress.step && !uploadProgress.complete && (
            <View style={[styles.progressBar, { backgroundColor: theme.background }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: theme.primary, 
                    width: uploadProgress.percentage 
                      ? `${uploadProgress.percentage}%` 
                      : `${(uploadProgress.step / 4) * 100}%` 
                  }
                ]} 
              />
            </View>
          )}
        </View>
      )}

      {/* Video Selection Modal */}
      <Modal
        visible={showVideoSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVideoSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.videoSelectorModal, { backgroundColor: theme.card || theme.surface, borderColor: theme.border }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <TouchableOpacity onPress={() => setShowVideoSelector(false)}>
                <Text style={[styles.modalCancelButton, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Choose Music Video</Text>
              <View style={{ width: 60 }} />
            </View>

            {/* Video List */}
            <FlatList
              data={musicVideos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              style={styles.videoList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cancelButton: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sampleDataButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sampleDataButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeaderWithInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    gap: 4,
  },
  infoButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    fontSize: 12,
  },
  selectedVideoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  selectedVideoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedVideoInfo: {
    flex: 1,
  },
  selectedVideoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedVideoArtist: {
    fontSize: 14,
    marginBottom: 2,
  },
  selectedVideoDuration: {
    fontSize: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectVideoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  selectVideoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  selectVideoText: {
    fontSize: 16,
  },
  uploadVideoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
  },
  uploadVideoIcon: {
    fontSize: 20,
  },
  uploadVideoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notesInputContainer: {
    marginBottom: 0,
  },
  uploadNotesButtonBelow: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  uploadedFileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  uploadedFileName: {
    fontSize: 14,
    flex: 1,
  },
  removeFileText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  captionInput: {
    height: 100,
  },
  notesInput: {
    height: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  videoSelectorModal: {
    flex: 1,
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalCancelButton: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  videoList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  videoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  videoArtist: {
    fontSize: 14,
    marginBottom: 4,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoDuration: {
    fontSize: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Upload Progress Styles
  progressContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  // Tempo Slider Styles
  tempoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tempoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  sliderFill: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    marginLeft: -10,
  },
});