import { GoalData } from './goal.model';

export type UserData = {
  _id: string;
  username: string;
  email: string;
  goals: GoalData[];
};
