import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTranscripts } from '../../utils/database';
import { format } from 'date-fns';

interface Transcript {
  id: string;
  text: string;
  analysis?: {
    summary?: string;
  };
  created_at: string;
}

export default function TranscriptsScreen() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTranscripts();
  }, []);

  const loadTranscripts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTranscripts();
      setTranscripts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading transcripts:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Transcript }) => (
    <TouchableOpacity style={styles.transcriptCard}>
      <View style={styles.transcriptHeader}>
        <Text style={styles.transcriptTitle}>
          {item.analysis?.summary || 'Transcript'}
        </Text>
        <Text style={styles.transcriptDate}>
          {format(new Date(item.created_at), 'MMM d, yyyy')}
        </Text>
      </View>
      <Text style={styles.transcriptPreview} numberOfLines={2}>
        {item.text}
      </Text>
      <View style={styles.transcriptActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={loadTranscripts}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (transcripts.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>No transcripts yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transcripts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onRefresh={loadTranscripts}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContainer: {
    padding: 16,
  },
  transcriptCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transcriptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  transcriptDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  transcriptPreview: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
    marginBottom: 12,
  },
  transcriptActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});