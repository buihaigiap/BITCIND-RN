import { getCpuCoreCount, runMultiThreadedBenchmark } from 'expo-benchmark';
import { Activity, Cpu, ShieldCheck, Zap } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BenchmarkModal from './BenchmarkModal';

enum BenchmarkState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
}

export const Benchmark = ({ setShowWebView, setBenchmarkResult }: any) => {
  const [status, setStatus] = useState<BenchmarkState>(BenchmarkState.IDLE);
  const [modalResult, setModalResult] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === BenchmarkState.RUNNING) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
    }
  }, [status]);

  const runBenchmark = async () => {
    if (status === BenchmarkState.RUNNING) return;

    setStatus(BenchmarkState.RUNNING);
    setProgress(0);
    setShowWebView(false);

    // Animate progress
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    // Update progress percentage
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    try {
      const benchmarkResult = await runMultiThreadedBenchmark(5);
      clearInterval(progressInterval);
      setProgress(100);
      
      setBenchmarkResult({
        kiloHashesPerSecond: benchmarkResult.kiloHashesPerSecond,
        megaHashesPerSecond: benchmarkResult.megaHashesPerSecond,
        threads: getCpuCoreCount(),
        timestamp: Date.now(),
      });

      // Transform result for BenchmarkModal
      setModalResult({
        MH: benchmarkResult.megaHashesPerSecond,
        KH: benchmarkResult.kiloHashesPerSecond,
        duration: benchmarkResult.durationMs,
        threads: benchmarkResult.threads,
        cpuScore: getCpuCoreCount(),
        deviceInfo: {
          platform: Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Unknown',
          cores: getCpuCoreCount(),
        },
      });

      setStatus(BenchmarkState.COMPLETED);

      setTimeout(() => {
        setShowWebView(true);
      }, 300000);
    } catch (error) {
      console.error('❌ Benchmark error:', error);
      clearInterval(progressInterval);
      setStatus(BenchmarkState.IDLE);
      setProgress(0);
      progressAnim.setValue(0);
    }
  };

  const reset = () => {
    setStatus(BenchmarkState.IDLE);
    setModalResult(null);
    setProgress(0);
    progressAnim.setValue(0);
  };

  const formatNumber = (num: number) =>
    num.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View style={[styles.logoBox, { transform: [{ rotate }] }]}>
        <Cpu size={48} color="#60a5fa" />
      </Animated.View>

      <Text style={styles.title}>Benchmark Pro</Text>
      <Text style={styles.subtitle}>
        Test your device's raw performance with our advanced computing engine.
      </Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat icon={Zap} label="CPU Speed" value="High" />
        <Stat icon={Activity} label="GPU Load" value="Normal" />
        <Stat icon={ShieldCheck} label="Security" value="Safe" />
      </View>

      {/* Button / Progress */}
      {status !== BenchmarkState.RUNNING ? (
        <TouchableOpacity style={styles.button} onPress={runBenchmark}>
          <Zap size={18} color="#000" />
          <Text style={styles.buttonText}>
            {status === BenchmarkState.IDLE ? 'Start New Benchmark' : 'Run Again'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.progressBox}>
          <Text style={styles.progressTitle}>Running calculations...</Text>
          <Text style={styles.progressPercent}>{progress}%</Text>

          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Result Modal */}
      {modalResult && (
        <BenchmarkModal
          visible={status === BenchmarkState.COMPLETED}
          results={modalResult}
          onClose={reset}
        />
      )}
    </View>
  );
};

function Stat({ icon: Icon, label, value }: any) {
  return (
    <View style={styles.stat}>
      <Icon size={35} color="#60a5fa" />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07121ef7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 40,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  statValue: {
    color: '#e5e7eb',
    fontWeight: '600',
    fontSize: 17,
  },
  button: {
    width: '90%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 20,

  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBox: {
    width: '100%',
    backgroundColor: '#020617',
    padding: 20,
    borderRadius: 20,
  },
  progressTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressPercent: {
    color: '#fff',
    fontSize: 20,
    alignSelf: 'flex-end',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
});
