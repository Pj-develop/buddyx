import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format, addDays, isSameDay } from 'date-fns';

const EVENTS = [
  {
    id: '1',
    title: 'Team Standup',
    date: new Date(2024, 1, 20, 10, 0),
    duration: '30min',
    participants: ['John', 'Sarah', 'Mike'],
  },
  {
    id: '2',
    title: 'Client Meeting',
    date: new Date(2024, 1, 20, 14, 0),
    duration: '1h',
    participants: ['Client A', 'Project Manager'],
  },
];

export default function CalendarScreen() {
  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));

  const renderDateHeader = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.dateHeader}>
      {dates.map((date) => (
        <TouchableOpacity 
          key={date.toISOString()} 
          style={[
            styles.dateItem,
            isSameDay(date, today) && styles.dateItemActive,
          ]}>
          <Text style={[
            styles.dateDay,
            isSameDay(date, today) && styles.dateTextActive,
          ]}>
            {format(date, 'EEE')}
          </Text>
          <Text style={[
            styles.dateNumber,
            isSameDay(date, today) && styles.dateTextActive,
          ]}>
            {format(date, 'd')}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderEvent = (event) => (
    <TouchableOpacity key={event.id} style={styles.eventCard}>
      <View style={styles.eventTime}>
        <Text style={styles.eventTimeText}>
          {format(event.date, 'h:mm a')}
        </Text>
        <Text style={styles.eventDuration}>{event.duration}</Text>
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventParticipants}>
          {event.participants.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderDateHeader()}
      <ScrollView style={styles.eventsContainer}>
        {EVENTS.map(renderEvent)}
      </ScrollView>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  dateHeader: {
    backgroundColor: 'white',
    paddingVertical: 12,
  },
  dateItem: {
    width: 60,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderRadius: 8,
  },
  dateItemActive: {
    backgroundColor: '#007AFF',
  },
  dateDay: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  dateTextActive: {
    color: 'white',
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    flexDirection: 'row',
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
  eventTime: {
    marginRight: 16,
  },
  eventTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  eventDuration: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  eventParticipants: {
    fontSize: 14,
    color: '#8E8E93',
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
  addButtonText: {
    fontSize: 32,
    color: 'white',
    lineHeight: 32,
  },
});