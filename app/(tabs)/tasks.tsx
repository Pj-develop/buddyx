import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Update project timeline',
    dueDate: '2024-02-25',
    completed: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Schedule team review meeting',
    dueDate: '2024-02-23',
    completed: true,
    priority: 'medium',
  },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      default: return '#34C759';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => toggleTask(item.id)}>
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleContainer}>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
          <Text style={[
            styles.taskTitle,
            item.completed && styles.taskCompleted
          ]}>
            {item.title}
          </Text>
        </View>
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.completed ? '#34C759' : '#8E8E93'}
        />
      </View>
      <Text style={styles.taskDate}>Due: {item.dueDate}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
  taskCard: {
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});