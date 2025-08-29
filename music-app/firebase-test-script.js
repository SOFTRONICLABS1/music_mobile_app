/**
 * Simple Firebase Test Script
 * Run this in the Metro console or add to your app temporarily to test Firebase
 */

const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Try importing Firebase
    const firebaseApp = await import('@react-native-firebase/app');
    const firebaseAuth = await import('@react-native-firebase/auth');
    
    console.log('🔥 Firebase imports successful');
    console.log('🔥 Firebase app instance:', !!firebaseApp.default().app);
    console.log('🔥 Firebase auth instance:', !!firebaseAuth.default().app);
    
    // Test if Firebase is configured
    const apps = firebaseApp.default().apps;
    console.log('🔥 Firebase apps configured:', apps.length);
    
    if (apps.length > 0) {
      console.log('🔥 Firebase app name:', apps[0].name);
      console.log('🔥 Firebase project ID:', apps[0].options.projectId);
    }
    
    console.log('✅ Firebase test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    return false;
  }
};

// Export for testing
export default testFirebaseConnection;

// Auto-run if this file is imported
testFirebaseConnection();