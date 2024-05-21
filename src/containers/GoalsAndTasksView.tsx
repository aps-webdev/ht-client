import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { GoalData } from '@/models/goal.model';
import { CheckCheck, Trash2, X } from 'lucide-react';
import moment from 'moment';
import AddGoal from './AddGoal';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import AddTask from './AddTask';
import { _delete, _get, _put } from '@/lib/api-client';
import { TaskData } from '@/models/task.model';

const GoalsAndTasksView = ({
  goals,
  getUserInfo,
  userId,
}: {
  goals: GoalData[] | undefined;
  userId: string | undefined;
  getUserInfo: () => Promise<void>;
}) => {
  const [selectedGoal, setSelectedGoal] = useState<GoalData>();
  const [taskData, setTaskData] = useState<TaskData[]>([]);

  useEffect(() => {
    if (selectedGoal) {
      getGoalInfo(selectedGoal?._id);
    }
  }, [selectedGoal]);

  const handleGoalDelete = async (goalId: string) => {
    try {
      const response = await _delete(`goals/delete/${goalId}`);
      if (response) {
        getUserInfo();
        setSelectedGoal(undefined);
        setTaskData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGoalInfo = async (goalId: string | undefined) => {
    try {
      const response = await _get(`goals/${goalId}`);
      if (response) setTaskData([...response.data.tasks]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTaskDelete = async (
    goalId: string | undefined,
    taskId: string
  ) => {
    try {
      const response = await _delete(`tasks/delete/${taskId}`);
      if (response) {
        getGoalInfo(goalId);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='flex w-full h-full'>
      <GoalCard
        goals={goals}
        deleteGoal={handleGoalDelete}
        userId={userId}
        getUserInfo={getUserInfo}
        setSelectedGoal={setSelectedGoal}
        selectedGoal={selectedGoal}
      />
      <Separator orientation='vertical' className='border flex-grow h-auto' />

      <Taskcard
        tasks={taskData}
        goalId={selectedGoal?._id}
        deleteTask={handleTaskDelete}
        getGoalInfo={getGoalInfo}
        getUserInfo={getUserInfo}
      />
    </div>
  );
};

export default GoalsAndTasksView;

const GoalCard = ({
  goals,
  deleteGoal,
  userId,
  getUserInfo,
  setSelectedGoal,
  selectedGoal,
}: {
  goals: GoalData[] | undefined;
  deleteGoal: (goalId: string) => Promise<void>;
  userId: string | undefined;
  getUserInfo: () => Promise<void>;
  setSelectedGoal: Dispatch<SetStateAction<GoalData | undefined>>;
  selectedGoal: GoalData | undefined;
}) => {
  console.log('is this goal card component re rendered');
  return (
    <div className='w-1/2 pr-8'>
      <div className='flex justify-between items-center'>
        <p className='text-3xl font-medium'>Goals List</p>
        <AddGoal size='small' user={userId} getUserInfo={getUserInfo} />
      </div>
      {goals &&
        goals.map((goal) => {
          return (
            <Card
              key={goal._id}
              className={`mt-6 shadow-lg cursor-pointer ${
                selectedGoal?._id === goal?._id && 'bg-secondary'
              }`}
              onClick={() => setSelectedGoal(goal)}>
              <CardHeader className='flex-row justify-between items-center space-y-0'>
                <CardTitle className='text-justify text-3xl'>
                  {goal.name}
                </CardTitle>
                <div className='flex items-center justify-center'>
                  <Label className='mr-2 text-md'>Completed</Label>
                  {goal.completed ? (
                    <Badge className='bg-green-600'>
                      <CheckCheck className='w-4 h-4' />
                    </Badge>
                  ) : (
                    <Badge variant='destructive'>
                      <X className='w-4 h-4' />
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className='w-fit grid grid-cols-2 gap-y-2'>
                <div>Start date :</div>
                <div className='font-medium text-green-700'>
                  {moment(goal.minTimeLine).format('Do MMM YYYY')}
                </div>
                <div>End date :</div>
                <div className='font-medium text-red-700'>
                  {moment(goal.maxTimeLine).format('Do MMM YYYY')}
                </div>
              </CardContent>
              <CardFooter className='justify-between'>
                <span className='text-gray-500 font-light '>
                  Please complete all task to mark goal as completed
                </span>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='hover:bg-red-100'
                  onClick={() => deleteGoal(goal._id)}>
                  <Trash2 className='text-red-600 h-7 w-7' />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
    </div>
  );
};

const Taskcard = ({
  tasks,
  goalId,
  deleteTask,
  getGoalInfo,
  getUserInfo,
}: {
  tasks: TaskData[];
  goalId: string | undefined;
  deleteTask: (goalId: string | undefined, taskId: string) => Promise<void>;
  getGoalInfo: (goalId: string | undefined) => Promise<void>;
  getUserInfo: () => Promise<void>;
}) => {
  const [disabledSwitch, setDisabledSwitch] = useState(false);
  useEffect(() => {
    if (goalId) {
      getGoalInfo(goalId);
    }
  }, [goalId]);

  const handleTaskComplete = async (checked: boolean, taskId: string) => {
    try {
      setDisabledSwitch(true);
      const response = await _put(`tasks/update/${taskId}`, {
        completed: checked,
      });
      if (response) {
        getGoalInfo(goalId);
        getUserInfo();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDisabledSwitch(false);
    }
  };
  return (
    <div className='w-1/2 pl-8'>
      <div className='flex justify-between items-center'>
        <p className='text-3xl font-medium'>
          Tasks {tasks.length > 0 && 'List'}
        </p>
        {goalId && (
          <AddTask size='small' goal={goalId} getGoalInfo={getGoalInfo} />
        )}
      </div>
      {(tasks.length > 0 &&
        tasks.map((task) => {
          return (
            <Card key={task._id} className='mt-6 shadow-lg'>
              <CardHeader className='flex-row justify-between items-center space-y-0'>
                <CardTitle className='text-justify text-3xl'>
                  {task.name}
                </CardTitle>
                <div className='flex items-center justify-center'>
                  <Label
                    className='mr-2 text-md cursor-pointer'
                    htmlFor='completetask'>
                    Completed
                  </Label>
                  <Switch
                    id='completetask'
                    checked={task.completed}
                    onCheckedChange={(checked) =>
                      handleTaskComplete(checked, task._id)
                    }
                    disabled={disabledSwitch}
                  />
                </div>
              </CardHeader>
              <CardContent className='w-fit grid grid-cols-2 gap-y-2 items-center'>
                <div>Quantity :</div>
                <div className='font-medium'>{task.quantity}</div>
                <div>Frequency :</div>
                <div className='font-medium'>{task.frequency}</div>
              </CardContent>
              <CardFooter className='justify-between'>
                <div className='flex items-center justify-center'>
                  <Label htmlFor='datetime' className='mr-4'>
                    Reminder
                  </Label>
                  {moment(task.reminderTime).format('MMMM Do YYYY, h:mm:ss a')}
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='hover:bg-red-100'
                  onClick={() => deleteTask(goalId, task._id)}>
                  <Trash2 className='text-red-600 h-7 w-7' />
                </Button>
              </CardFooter>
            </Card>
          );
        })) ||
        (!goalId && (
          <div className='text-3xl mt-24'>
            Choose goal to see it&apos;s tasks
          </div>
        )) || (
          <div className='text-3xl mt-24'>
            No task present, add one using &quot;Add Task&quot;
          </div>
        )}
    </div>
  );
};
