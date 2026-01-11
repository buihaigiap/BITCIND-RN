import { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Benchmark } from './benchmark';

export default function HomeScreen() {
  const [showWebView, setShowWebView] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<any>(null);
  const webViewRef = useRef<WebView>(null);

  if (showWebView) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <WebView
          ref={webViewRef}
          style={styles.webView}
          source={{ uri: ' http://192.168.100.132:5173' }}
          onLoadEnd={() => {
            if (benchmarkResult) {
              webViewRef.current?.injectJavaScript(`
                window.dispatchEvent(
                  new CustomEvent('benchmarkResult', {
                    detail: ${JSON.stringify(benchmarkResult)}
                  })
                );
                true;
              `);
            }
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <Benchmark
      setShowWebView={setShowWebView}
      setBenchmarkResult={setBenchmarkResult}
    />
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
