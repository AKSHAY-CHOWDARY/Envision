import React from 'react'
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
  SignUpButton
} from "@clerk/clerk-react";
import { useNavigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';

const Navigation = () => {
  const {user} = useUser();
  console.log(user);
  const navigate = useNavigate();
  return (
    <div className='bg-indigo-700 py-4 w-full'>
      {/* Show SignInButton if the user is signed out */}
			<SignedOut>
				<div className='flex space-x-3 justify-end px-4'>
          <button className='font-semibold px-4 bg-white rounded-md py-2' ><SignInButton/></button>
          <button className='font-semibold px-4 bg-white rounded-md py-2' ><SignUpButton/></button>
				</div>
			</SignedOut>
      {/* Show UserButton if the user is signed in */}
      <SignedIn>
        <div className='flex justify-between px-5 space-x-4'>
          <p className='text-white'>{user?.fullName}</p>
          <div className='flex space-x-4 '>
          <button className='font-semibold text-white text-lg cursor-pointer hover:text-indigo-200' onClick={()=>navigate('/jobs')} >Jobs</button>
          <UserButton />
          </div>
        </div>

      </SignedIn>
    </div>
  )
}





export default Navigation