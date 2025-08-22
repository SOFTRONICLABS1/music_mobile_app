import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useTheme } from '@/theme/ThemeContext';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}
const countries: Country[] = [
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷' },
];
export default function PhoneVerificationScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[6]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const handlePhoneSubmit = () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }
    // Phone number accepted, move to next screen
    console.log('Phone number accepted:', phoneNumber);
    router.replace('/(tabs)');
  };
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="arrow.left" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Progress Indicator - Below Back Button */}
        <View style={styles.progressSection}>
          <ThemedText style={styles.progressText}>Step 3 of 3</ThemedText>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: '100%', backgroundColor: theme.primary }]} />
          </View>
        </View>
        {/* Main Content */}
        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={[styles.iconContainer, { backgroundColor: theme.surface, shadowColor: theme.primary }]}>
              <IconSymbol name="phone.fill" size={60} color={theme.primary} />
            </View>
            <ThemedText style={styles.title}>
              Verify your phone
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Add your phone number to secure your account and connect with friends
            </ThemedText>
          </View>
          {/* Phone Input */}
            <View style={styles.phoneSection}>
              <View style={[styles.phoneInputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <TouchableOpacity 
                  style={[styles.countrySelector, { borderRightColor: theme.border }]}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <ThemedText style={styles.countryFlag}>{selectedCountry.flag}</ThemedText>
                  <ThemedText style={styles.countryCodeText}>{selectedCountry.dialCode}</ThemedText>
                  <IconSymbol name="chevron.down" size={16} color={theme.primary} />
                </TouchableOpacity>
                <TextInput
                  style={[styles.phoneInput, { color: theme.text }]}
                  placeholder="Phone number"
                  placeholderTextColor={theme.textSecondary}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  { backgroundColor: phoneNumber.length < 8 ? theme.border : theme.primary }
                ]} 
                onPress={handlePhoneSubmit}
                disabled={phoneNumber.length < 8}
              >
                <ThemedText style={[
                  styles.sendButtonText,
                  { color: phoneNumber.length < 8 ? theme.textSecondary : 'white' }
                ]}>
                  Continue
                </ThemedText>
                <IconSymbol 
                  name="arrow.right" 
                  size={20} 
                  color={phoneNumber.length < 8 ? theme.textSecondary : "white"} 
                />
              </TouchableOpacity>
            </View>
        </ScrollView>
        {/* Country Picker Modal */}
        {showCountryPicker && (
          <View style={styles.modalOverlay}>
            <View style={[styles.countryPickerModal, { backgroundColor: theme.surface }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                <ThemedText style={styles.modalTitle}>Select Country</ThemedText>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowCountryPicker(false)}
                >
                  <IconSymbol name="xmark" size={24} color={theme.primary} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.countryList}>
                {countries.map((country) => (
                  <TouchableOpacity
                    key={country.code}
                    style={[
                      styles.countryItem,
                      selectedCountry.code === country.code ? { backgroundColor: theme.primary + '20' } : null
                    ]}
                    onPress={() => handleCountrySelect(country)}
                  >
                    <ThemedText style={styles.countryFlag}>{country.flag}</ThemedText>
                    <ThemedText style={styles.countryName}>{country.name}</ThemedText>
                    <ThemedText style={styles.countryDialCode}>{country.dialCode}</ThemedText>
                    {selectedCountry.code === country.code && (
                      <IconSymbol name="checkmark" size={20} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme color
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    // color: theme color
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  phoneSection: {
    marginBottom: 30,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    marginBottom: 20,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    gap: 8,
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCodeText: {
    fontSize: 16,
    // color: theme color
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  otpSection: {
    alignItems: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: 'bold',
    // color: theme color
  },
  verifyButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  resendSection: {
    alignItems: 'center',
    gap: 8,
  },
  resendText: {
    fontSize: 14,
    // color: theme color
  },
  resendButton: {
    fontSize: 14,
    // color: theme color
    fontWeight: '600',
  },
  disabledText: {
    // color: theme color
  },
  disabledButton: {
    // backgroundColor: theme color
  },
  disabledButtonText: {
    // color: theme color
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 24,
  },
  progressText: {
    fontSize: 14,
    // color: theme color
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    // backgroundColor: theme color
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    // backgroundColor: theme color
    borderRadius: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryPickerModal: {
    // backgroundColor: theme color
    borderRadius: 20,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: theme color
  },
  closeButton: {
    padding: 4,
  },
  countryList: {
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  selectedCountryItem: {
    // backgroundColor: theme color + '20',
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    // color: theme color
    fontWeight: '500',
  },
  countryDialCode: {
    fontSize: 16,
    // color: theme color
    fontWeight: '600',
  },
});