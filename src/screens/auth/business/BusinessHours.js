import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { hp, wp } from '../../../utils/responsive';
import { COLORS } from '../../../constants';
import { PoppinsText } from '../../../components';
import DateTimePicker from '@react-native-community/datetimepicker';

const BusinessHours = ({ onBusinessHoursChange, parentBusinessHours }) => {
  useEffect(() => {
    setBusinessHours(parentBusinessHours);
  }, [parentBusinessHours]);

  const [businessHours, setBusinessHours] = useState({
    sunday: { isOpen: false, opening: '', closing: '' },
    monday: { isOpen: false, opening: '', closing: '' },
    tuesday: { isOpen: false, opening: '', closing: '' },
    wednesday: { isOpen: false, opening: '', closing: '' },
    thursday: { isOpen: false, opening: '', closing: '' },
    friday: { isOpen: false, opening: '', closing: '' },
    saturday: { isOpen: false, opening: '', closing: '' },
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());

  // 24h formatting: returns "HH:mm"
  const formatTime = date => {
    if (!date) return '';
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Parse "HH:mm" to Date
  const parseTimeString = timeString => {
    if (!timeString) return new Date();
    const [h, m] = timeString.split(':').map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  };

  const handleToggleDay = day => {
    const prev = { ...businessHours };
    const newBusinessHours = {
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
        opening: !prev[day].isOpen ? '09:00' : '',
        closing: !prev[day].isOpen ? '11:00' : '',
      },
    };
    setBusinessHours(newBusinessHours);
    onBusinessHoursChange(newBusinessHours);
  };

  const days = [
    { key: 'sunday', label: 'Sunday' },
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
  ];

  const handleTimeChange = (day, field, time) => {
    const prev = { ...businessHours };
    const newBusinessHours = {
      ...prev,
      [day]: {
        ...prev[day],
        [field]: time,
      },
    };
    setBusinessHours(newBusinessHours);
    onBusinessHoursChange(newBusinessHours);
  };

  const handleTimePickerPress = (day, field) => {
    if (!businessHours[day].isOpen) return;
    setSelectedDay(day);
    setSelectedField(field);
    const currentTime = businessHours[day][field];
    setSelectedTime(currentTime ? parseTimeString(currentTime) : new Date());
    setShowTimePicker(true);
  };

  const handleDateTimePickerChange = (_event, selectedDate) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedDate && selectedDay && selectedField) {
      const formattedTime = formatTime(selectedDate); // "HH:mm"
      handleTimeChange(selectedDay, selectedField, formattedTime);
    }
  };

  const handleDateTimePickerDismiss = () => setShowTimePicker(false);

  return (
    <View>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <PoppinsText
          style={[styles.headerText, { textAlign: 'left' }]}
          weight="bold"
        >
          Day
        </PoppinsText>
        <PoppinsText style={styles.headerText} weight="bold">
          Status
        </PoppinsText>
        <PoppinsText style={styles.headerText} weight="bold">
          Opening
        </PoppinsText>
        <PoppinsText style={styles.headerText} weight="bold">
          Closing
        </PoppinsText>
      </View>

      {/* Rows */}
      {days.map(day => {
        const dayData = businessHours[day.key];
        return (
          <View key={day.key} style={styles.tableRow}>
            <View style={styles.dayColumn}>
              <PoppinsText style={styles.dayText} weight="regular">
                {day.label}
              </PoppinsText>
            </View>

            <View style={styles.statusColumn}>
              <Switch
                value={dayData.isOpen}
                onValueChange={() => handleToggleDay(day.key)}
                trackColor={{ false: COLORS.gray, true: COLORS.blue }}
                thumbColor={COLORS.white}
                ios_backgroundColor={COLORS.gray}
              />
            </View>

            <View style={[styles.timeColumn, { marginLeft: wp(5) }]}>
              <TouchableOpacity
                style={[
                  styles.timeInput,
                  !dayData.isOpen && styles.timeInputDisabled,
                ]}
                disabled={!dayData.isOpen}
                onPress={() => handleTimePickerPress(day.key, 'opening')}
              >
                <PoppinsText
                  style={[
                    styles.timeText,
                    !dayData.isOpen && styles.timeTextDisabled,
                  ]}
                  weight="regular"
                >
                  {dayData.opening || 'Select Time'}
                </PoppinsText>
              </TouchableOpacity>
            </View>

            <View style={styles.timeColumn}>
              <TouchableOpacity
                style={[
                  styles.timeInput,
                  !dayData.isOpen && styles.timeInputDisabled,
                ]}
                disabled={!dayData.isOpen}
                onPress={() => handleTimePickerPress(day.key, 'closing')}
              >
                <PoppinsText
                  style={[
                    styles.timeText,
                    !dayData.isOpen && styles.timeTextDisabled,
                  ]}
                  weight="regular"
                >
                  {dayData.closing || 'Select Time'}
                </PoppinsText>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateTimePickerChange}
          onTouchCancel={handleDateTimePickerDismiss}
          is24Hour={true} // Android: force 24h picker
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: wp('5%'),
    paddingTop: Platform.OS === 'ios' ? hp('2%') : hp('4%'),
    paddingBottom: hp('10%'),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('4%'),
  },
  progressStepContainer: { flexDirection: 'row', alignItems: 'center' },
  progressDot: { width: 12, height: 12, borderRadius: 6 },
  progressDotActive: { backgroundColor: COLORS.primary },
  progressDotInactive: { backgroundColor: COLORS.gray },
  progressLine: { width: wp('15%'), height: 2, marginHorizontal: wp('2%') },
  progressLineActive: { backgroundColor: COLORS.primary },
  progressLineInactive: { backgroundColor: COLORS.gray },
  headerSection: { marginBottom: hp('4%') },
  title: {
    fontSize: hp('3%'),
    color: COLORS.textColorPr,
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: hp('1.8%'),
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: hp('2.5%'),
  },
  tableHeader: { flexDirection: 'row', marginBottom: hp('2%') },
  headerText: {
    fontSize: hp('1.5%'),
    color: COLORS.darkGray,
    flex: 2,
    marginHorizontal: hp(1),
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textInputBorder,
  },
  dayColumn: { width: wp(25), alignItems: 'flex-start' },
  statusColumn: { width: wp(10), alignItems: 'center' },
  timeColumn: { width: wp(25), alignItems: 'center' },
  dayText: { fontSize: hp('1.5%'), color: COLORS.textColorPr },
  timeInput: {
    backgroundColor: COLORS.textInputBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.textInputBorder,
    paddingVertical: hp(0.8),
    minWidth: wp('20%'),
    alignItems: 'center',
  },
  timeInputDisabled: { opacity: 0.5 },
  timeText: { fontSize: hp('1.6%'), color: COLORS.textInput },
  timeTextDisabled: { color: COLORS.darkGray },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp('5%'),
    paddingBottom: Platform.OS === 'ios' ? hp('3%') : hp('2%'),
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.textInputBorder,
  },
  continueButton: { borderRadius: 12 },
});

export default BusinessHours;
