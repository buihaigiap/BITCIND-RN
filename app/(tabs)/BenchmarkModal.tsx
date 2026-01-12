import {
  Cpu,
  Database,
  Monitor,
  X
} from 'lucide-react-native';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BenchmarkModalProps {
  visible: boolean;
  results: any;
  onClose: () => void;
  setShowWebView : any
}

const BenchmarkModal: React.FC<BenchmarkModalProps> = ({
  visible,
  results,
  onClose,
  setShowWebView
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Performance Score</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Main score */}
          <View style={styles.mainScore}>
            <Text style={styles.subTitle}>
              OVERALL PERFORMANCE INDEX
            </Text>

            <View style={styles.scoreRow}>
              <Text style={styles.score}>
                {results.KH.toLocaleString()}
                <Text style={styles.unit}>KH/s</Text>
              </Text>
            </View>
          </View>

          {/* Breakdown */}
          <View style={styles.breakdowns}>
            <ScoreRow
              icon={Monitor}
              label="MH/s"
              value={results.MH}
              color="#45d681ff"
              bg="rgba(192,132,252,0.15)"
            />
            <ScoreRow
              icon={Database}
              label="Threads"
              value={results.threads}
              color="#fbbf24"
              bg="rgba(251,191,36,0.15)"
            />
            <ScoreRow
              icon={Cpu}
              label="CPU Multi-Core"
              value={results.cpuScore}
              color="#60a5fa"
              bg="rgba(96,165,250,0.15)"
            />
          </View>

          {/* Device info */}
          <View style={styles.deviceInfo}>
            <View>
              <Text style={styles.infoLabel}>SYSTEM PLATFORM</Text>
              <Text style={styles.infoValue}>
                {results.deviceInfo.platform}
              </Text>
            </View>

            <View>
              <Text style={styles.infoLabel}>PROCESSING CORES</Text>
              <Text style={styles.infoValue}>
                {results.deviceInfo.cores} Virtual Cores
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={ () => {
                setShowWebView(true)
                onClose
              }}
              
              style={styles.doneBtn}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface ScoreRowProps {
  icon: any;
  label: string;
  value: number;
  color: string;
  bg: string;
}

const ScoreRow: React.FC<ScoreRowProps> = ({
  icon: Icon,
  label,
  value,
  color,
  bg,
}) => (
  <View style={styles.scoreItem}>
    <View style={styles.scoreLeft}>
      <View style={[styles.iconBox, { backgroundColor: bg }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>

    <Text style={styles.scoreValue}>
      {value.toLocaleString()}
    </Text>
  </View>
);

export default BenchmarkModal;
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },

  container: {
    backgroundColor: '#020617',
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },



  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },

  closeBtn: {
    padding: 6,
  },

  mainScore: {
    backgroundColor: 'rgba(30,41,59,0.4)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },

  subTitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#94a3b8',
    fontWeight: '700',
    marginBottom: 8,
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  score: {
    fontSize: 45,
    fontWeight: '900',
    color: '#fff',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(52,211,153,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  badgeText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '700',
  },

  breakdowns: {
    gap: 12,
    marginBottom: 24,
  },

  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(30,41,59,0.3)',
  },

  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconBox: {
    padding: 8,
    borderRadius: 12,
  },

  scoreLabel: {
    color: '#cbd5f5',
    fontWeight: '500',
  },

  scoreValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  deviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148,163,184,0.2)',
    paddingTop: 16,
    marginBottom: 24,
  },

  infoLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },

  infoValue: {
    fontSize: 14,
    color: '#e5e7eb',
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    gap: 12,
  },

  shareBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  shareText: {
    color: '#fff',
    fontWeight: '700',
  },

  doneBtn: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  doneText: {
    color: '#020617',
    fontWeight: '700',
  },
  unit : {
    fontSize: 20,
  }
});
