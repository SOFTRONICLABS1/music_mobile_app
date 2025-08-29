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
import { IconSymbol } from '../components/ui/IconSymbol';
import { useTheme } from '../theme/ThemeContext';

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
  const [postData, setPostData] = useState({
    videoName: '',
    caption: '',
    notes: ''
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
          type: 'user_uploaded'
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
    // For now, we'll simulate file upload with a simple alert
    // In a real implementation, you would use a file picker library
    Alert.alert(
      'Upload Notes File',
      'Choose an option:',
      [
        {
          text: 'Camera (Scan Notes)',
          onPress: () => {
            // Simulate scanning sheet music or handwritten notes
            const mockFile = {
              name: 'scanned_notes.jpg',
              type: 'image/jpeg',
              size: 1024000
            };
            setNotesFile(mockFile);
            Alert.alert('Success', 'Notes scanned and uploaded successfully!');
          }
        },
        {
          text: 'Gallery (Photo of Notes)',
          onPress: () => {
            // Use the same image picker for notes photos
            const options = {
              mediaType: 'photo',
              quality: 0.8,
            };
            
            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                console.log('User cancelled notes picker');
              } else if (response.errorMessage) {
                Alert.alert('Error', 'Failed to select notes image');
              } else if (response.assets && response.assets[0]) {
                const selectedImage = response.assets[0];
                const mockFile = {
                  name: selectedImage.fileName || 'music_notes.jpg',
                  type: selectedImage.type,
                  uri: selectedImage.uri,
                  size: selectedImage.fileSize
                };
                setNotesFile(mockFile);
                Alert.alert('Success', 'Notes image uploaded successfully!');
              }
            });
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleInputChange = (field, value) => {
    setPostData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreatePost = () => {
    if (!selectedVideo) {
      Alert.alert('Missing Video', 'Please select a music video first.');
      return;
    }

    if (!postData.caption.trim()) {
      Alert.alert('Missing Caption', 'Please add a caption for your post.');
      return;
    }

    // Here you would typically send the data to your API
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
        <TouchableOpacity onPress={handleCreatePost}>
          <Text style={[styles.shareButton, { color: theme.primary }]}>Share</Text>
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Music Notes (Optional)</Text>
          
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
              style={[styles.textInput, styles.notesInputField, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              value={postData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Add Music notes"
              placeholderTextColor={theme.textTertiary}
              multiline={true}
              numberOfLines={2}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.uploadNotesButtonRight, { backgroundColor: theme.primary }]}
              onPress={handleNotesFileUpload}
            >
              <Text style={[styles.uploadButtonText, { color: 'white' }]}>📄 Select</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Details Form */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Post Details</Text>
          
          {/* Video Name */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Video Name</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              value={postData.videoName}
              onChangeText={(value) => handleInputChange('videoName', value)}
              placeholder="Enter video name..."
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
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notesInputField: {
    flex: 1,
    height: 60,
    paddingTop: 12,
  },
  uploadNotesButtonRight: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 0,
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
});