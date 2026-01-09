import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Benchmark } from './benchmark';
export default function HomeScreen() {
  const [showWebView, setShowWebView] = useState(false);

  if (showWebView) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <WebView
          style={styles.webView}
          source={{ uri: 'https://expo.dev' }}
        />
      </SafeAreaView>
    );
  }

  return (
      <Benchmark setShowWebView={setShowWebView} />
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
