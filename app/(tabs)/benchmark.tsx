import { BenchmarkResult, getCpuCoreCount, runMultiThreadedBenchmark } from 'expo-benchmark';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
export const Benchmark = ({setShowWebView} : any) => {
    const [result, setResult] = useState<BenchmarkResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
     const handleMultiThreadedBenchmark = async () => {
        setIsRunning(true);
        setResult(null);
        setShowWebView(false);
        try {
          const benchmarkResult = await runMultiThreadedBenchmark(5);
          setResult(benchmarkResult);
          setIsModalVisible(true);
          // Hide modal and show webview after 3 seconds
          setTimeout(() => {
            setIsModalVisible(false);
            setShowWebView(true);
          }, 1000);
        } catch (error) {
          console.error('Benchmark error:', error);
          setIsRunning(false);
        } finally {
          setIsRunning(false);
        }
      };

  const formatNumber = (num: number) =>
    num.toLocaleString(undefined, { maximumFractionDigits: 2 });

    return (
        <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
              <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                  <Text style={styles.title}>Hashrate Benchmark</Text>
                  <Text style={styles.subtitle}>Test your device's performance</Text>
        
                  <View style={styles.infoCard}>
                    <Text style={styles.infoText}>CPU Cores: {getCpuCoreCount()}</Text>
                  </View>
        
                  <Pressable
                    style={[styles.runButton, isRunning && styles.buttonDisabled]}
                    onPress={handleMultiThreadedBenchmark}
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <ActivityIndicator size="large" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Start Benchmark</Text>
                    )}
                  </Pressable>
                </View>
        
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isModalVisible}
                  onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalTitle}>Benchmark Complete!</Text>
                      {result && (
                        <>
                          <View style={styles.modalResultCard}>
                            <Text style={styles.resultValue}>{formatNumber(result.kiloHashesPerSecond)}</Text>
                            <Text style={styles.resultUnit}>KH/s</Text>
                          </View>
                          <View style={styles.modalResultCard}>
                            <Text style={styles.resultValue}>{formatNumber(result.megaHashesPerSecond)}</Text>
                            <Text style={styles.resultUnit}>MH/s</Text>
                          </View>
                        </>
                      )}
                      <Text style={styles.redirectText}>Redirecting to web view...</Text>
                    </View>
                  </View>
                </Modal>
              </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  runButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ff9f43',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  runAgainButton: {
    marginTop: 20,
    backgroundColor: '#ff9f43',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  runAgainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalResultCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    width: 250,
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  resultUnit: {
    fontSize: 18,
    color: '#2a5298',
    fontWeight: '600',
  },
  redirectText: {
    marginTop: 15,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  }
});
