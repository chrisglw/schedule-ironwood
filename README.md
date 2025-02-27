# Schedule Management System

## Overview

Welcome to the **Schedule Management System**, a project developed using React and Firebase Database. This system was created to improve the scheduling process at Ironwood Insights Group by moving away from paper-based tracking. While working at the call center, I noticed that we have to write down our shifts on paper and then give them to a manager or supervisor, who manually enters the information into the system. Looking for a way to improve this process, I volunteered to develop this solution. The goal of this project is to make scheduling more efficient for both agents and managers.

## Features

- **Agent Schedule Input**: 
  - Agents can enter their name and select the days and times they want to work.
  - The system allows you to choose as many or as few days as needed.
  - Schedule can be set as either permanent (default) or temporary. If temporary, a specific date can be entered for the schedule to take effect.
  
- **Admin Login**: 
  - Supervisors can log in using credentials.
  - View all submitted schedules in a list.
  - Manage schedule statuses to track the entry status. 
    - Default status: Yellow (Not entered).
    - Once entered into the system: Green (Entered).
    - If the schedule is invalid, it can be marked with "Invalid."
  - Sorting by week. 

## Screenshots

![Agent View](/src/assets/AgentView.png)
![Manager View](/src/assets/ManagerView.png)

## How It Works

1. **Schedule Submission**:
   - Enter your name and select your working hours.
   - Choose whether the schedule is permanent or temporary.
   - If the schedule is temporary, specify the week it applies to. If no date is entered, the system assumes the schedule is for the next week.
   - Submit the schedule once you're satisfied.

2. **Admin Workflow**:
   - Log in with credentials.
   - View the list of schedules submitted by agents.
   - Update the status of the schedule (e.g., "Invalid," "Entered").
   - The color-coded statuses help the admin keep track of pending and confirmed schedules.

## Tech Stack

- **Frontend**: React
- **Backend**: Firebase Database (for storing and managing schedule data)