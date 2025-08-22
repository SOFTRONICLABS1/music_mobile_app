import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';
import { useTheme } from '@/theme/ThemeContext';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  avatar?: string;
}

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  gameTitle: string;
  comments: Comment[];
  onAddComment: (comment: string) => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onClose,
  gameTitle,
  comments,
  onAddComment,
}) => {
  const { theme } = useTheme();
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={[styles.container, { backgroundColor: theme.background }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        {/* Handle Bar */}
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: theme.textSecondary }]} />
        </View>
        
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Comments</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Game Info */}
        <View style={[styles.gameInfo, { backgroundColor: theme.surface }]}>
          <IconSymbol name="gamecontroller.fill" size={20} color={theme.primary} />
          <Text style={[styles.gameTitle, { color: theme.text }]}>{gameTitle}</Text>
        </View>

        {/* Comments List */}
        <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={[styles.avatarContainer, { backgroundColor: theme.surface }]}>
                <IconSymbol name="person.fill" size={16} color={theme.textSecondary} />
              </View>
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={[styles.username, { color: theme.text }]}>@{comment.user}</Text>
                  <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
                    {comment.timestamp}
                  </Text>
                </View>
                <Text style={[styles.commentText, { color: theme.text }]}>{comment.text}</Text>
              </View>
            </View>
          ))}
          
          {comments.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol name="bubble.right" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No comments yet. Be the first to comment!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Comment Input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholder="Add a comment..."
              placeholderTextColor={theme.textSecondary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: newComment.trim() ? theme.primary : theme.border }
              ]}
              onPress={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              <IconSymbol
                name="paperplane.fill"
                size={16}
                color={newComment.trim() ? 'white' : theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '65%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});