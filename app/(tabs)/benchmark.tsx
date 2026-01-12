import { getCpuCoreCount, runMultiThreadedBenchmark } from 'expo-benchmark';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, ShieldCheck, Zap } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BenchmarkModal from './BenchmarkModal';

const { width, height } = Dimensions.get('window');

const Particle = ({ delay }: { delay: number }) => {
  const moveAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const runAnimation = () => {
      moveAnim.setValue(0);
      opacityAnim.setValue(0);
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(moveAnim, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacityAnim, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
          ]),
        ]),
      ]).start(() => runAnimation());
    };
    runAnimation();
  }, []);

  const x = Math.random() * width;
  const y = Math.random() * height;

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          top: y,
          opacity: opacityAnim,
          transform: [
            {
              translateY: moveAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -100 - Math.random() * 100],
              }),
            },
          ],
        },
      ]}
    />
  );
};

const Particles = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {[...Array(20)].map((_, i) => (
        <Particle key={i} delay={i * 200} />
      ))}
    </View>
  );
};

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
    progressAnim.setValue(0);
    setShowWebView(false);

    // Update progress percentage and animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newVal = prev + 2;
        if (newVal >= 100) {
          clearInterval(progressInterval);
          progressAnim.setValue(100);
          return 100;
        }
        progressAnim.setValue(newVal);
        return newVal;
      });
    }, 100);

    try {
      const benchmarkResult = await runMultiThreadedBenchmark(5);
      clearInterval(progressInterval);
      
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

      const currentProgress = progress;
      setProgress(100);
      if (currentProgress < 100) {
        Animated.timing(progressAnim, {
          toValue: 100,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          setStatus(BenchmarkState.COMPLETED);
        });
      } else {
        progressAnim.setValue(100);
        setStatus(BenchmarkState.COMPLETED);
      }

    
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

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#0f172a']}
      style={styles.container}
    >
      <Particles />
      
      {/* Content wrapper for better organization and shadows */}
      <View style={styles.card}>
        {/* Logo with shadow */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/btcd-logo.jpg')} 
            style={{ width: 100, height: 100, borderRadius: 20 }} 
          />
        </View>

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
          <TouchableOpacity 
            activeOpacity={0.8}
            style={[styles.button, styles.shadow]} 
            onPress={runBenchmark}
          >
            <Zap size={20} color="black" />
            <Text style={styles.buttonText}>
              {status === BenchmarkState.IDLE ? 'Start New Benchmark' : 'Run Again'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.progressBox, styles.shadow]}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Running calculations...</Text>
              <Text style={styles.progressPercent}>{progress}%</Text>
            </View>
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
      </View>

      {/* Result Modal */}
      {modalResult && (
        <BenchmarkModal
          setShowWebView ={setShowWebView}
          visible={status === BenchmarkState.COMPLETED}
          results={modalResult}
          onClose={reset}
        />
      )}
    </LinearGradient>
  );
};export default Benchmark;

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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#60a5fa',
    borderRadius: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    fontFamily:'serif',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  statValue: {
    color: '#e5e7eb',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 2,
  },
  button: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  progressBox: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  progressPercent: {
    color: '#3b82f6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
});
