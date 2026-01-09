import {
  BenchmarkResult,
  getCpuCoreCount,
  runMultiThreadedBenchmark,
  runQuickBenchmark,
} from 'expo-benchmark';
import { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
export default function HomeScreen() {
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleQuickBenchmark = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const benchmarkResult = await runQuickBenchmark();
      setResult(benchmarkResult);
    } catch (error) {
      console.error('Benchmark error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleMultiThreadedBenchmark = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const benchmarkResult = await runMultiThreadedBenchmark(5);
      setResult(benchmarkResult);
    } catch (error) {
      console.error('Benchmark error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const formatNumber = (num: number) =>
    num.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
   <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📱 Hashrate Benchmark</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Info</Text>
          <Text style={styles.text}>CPU Cores: {getCpuCoreCount()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Run Benchmark</Text>
          
          <Pressable
            style={[styles.button, isRunning && styles.buttonDisabled]}
            onPress={handleQuickBenchmark}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>Quick Benchmark (1s)</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonPrimary, isRunning && styles.buttonDisabled]}
            onPress={handleMultiThreadedBenchmark}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>
              Multi-threaded ({getCpuCoreCount()} cores, 5s)
            </Text>
          </Pressable>
        </View>

        {isRunning && (
          <View style={styles.card}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.text}>Running benchmark...</Text>
          </View>
        )}

        {result && !isRunning && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Results</Text>
            <Text style={styles.text}>Algorithm: {result.algorithm}</Text>
            <Text style={styles.text}>Threads: {result.threads}</Text>
            <Text style={styles.text}>
              Duration: {formatNumber(result.durationMs)} ms
            </Text>
            <Text style={styles.text}>
              Total Hashes: {formatNumber(result.hashCount)}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.hashrate}>
              {formatNumber(result.kiloHashesPerSecond)} KH/s
            </Text>
            <Text style={styles.hashrateSmall}>
              ({formatNumber(result.megaHashesPerSecond)} MH/s)
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  button: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  hashrate: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  hashrateSmall: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
