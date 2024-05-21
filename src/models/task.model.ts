import { GoalData } from './goal.model';

interface CustomReminder {
  days: number[];
  time: string;
}

export type TaskForm = {
  name: string;
  quantity: string;
  frequency: 'once a week' | 'twice a day' | 'one day';
  reminderTime: string;
  customReminder: {
    time: string;
    days: number[];
  };
};

export type TaskData = {
  name: string;
  quantity: number;
  frequency: string;
  reminder: boolean;
  reminderTime: string;
  completed: boolean;
  customReminder: CustomReminder;
  _id: string;
  goal: GoalData;
};
