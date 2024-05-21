'use client';

import { useAuth } from '@/contexts/auth-provider';
import { _delete, _get } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import AddGoal from './AddGoal';
import { useRouter } from 'next/navigation';
import { UserData } from '@/models/user.model';
import GoalsAndTasksView from './GoalsAndTasksView';

const DashboardContainer = () => {
  const { user, login } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    if (!user) router.replace('/');
    getUserInfo();
  }, [user]);

  const getUserInfo = async () => {
    try {
      const response = await _get('users/me');
      if (response) {
        login();
        setUserData(response.data as UserData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='mt-24 flex flex-col items-center justify-center'>
      {userData?.goals && userData.goals.length > 0 ? (
        <GoalsAndTasksView
          goals={userData?.goals}
          userId={userData?._id}
          getUserInfo={getUserInfo}
        />
      ) : (
        <>
          <p className='text-5xl mb-12'>Start with adding some Goals</p>
          <AddGoal
            size='large'
            user={userData?._id}
            getUserInfo={getUserInfo}
          />
        </>
      )}
    </div>
  );
};

export default DashboardContainer;
