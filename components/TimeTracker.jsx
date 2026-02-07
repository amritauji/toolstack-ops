"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Button, Chip, Progress, Avatar } from "@nextui-org/react";

const TimeTracker = ({ tasks = [] }) => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Mock time entries
  const mockEntries = [
    { id: 1, taskTitle: "Design homepage", duration: 120, date: "2024-01-20", user: "John Doe" },
    { id: 2, taskTitle: "Setup CI/CD", duration: 180, date: "2024-01-20", user: "Jane Smith" },
    { id: 3, taskTitle: "Content review", duration: 60, date: "2024-01-19", user: "Mike Johnson" }
  ];

  const entries = timeEntries.length > 0 ? timeEntries : mockEntries;

  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const startTimer = (taskId, taskTitle) => {
    if (activeTimer) {
      stopTimer();
    }
    setActiveTimer({ taskId, taskTitle, startTime: Date.now() });
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (activeTimer) {
      const duration = Math.floor(elapsedTime / 60); // Convert to minutes
      const newEntry = {
        id: Date.now(),
        taskTitle: activeTimer.taskTitle,
        duration,
        date: new Date().toISOString().split('T')[0],
        user: "Current User"
      };
      setTimeEntries(prev => [newEntry, ...prev]);
    }
    setActiveTimer(null);
    setElapsedTime(0);
  };

  const getTotalTimeToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries
      .filter(entry => entry.date === today)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const mockTasks = [
    { id: 1, title: "Design homepage mockup", project: "Website" },
    { id: 2, title: "Setup CI/CD pipeline", project: "DevOps" },
    { id: 3, title: "Content review", project: "Marketing" }
  ];

  const availableTasks = tasks.length > 0 ? tasks : mockTasks;

  return (
    <div className="space-y-6">
      {/* Active Timer */}
      <Card>
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Time Tracker</h3>
            <Chip color="primary" variant="flat">
              Today: {formatDuration(getTotalTimeToday())}
            </Chip>
          </div>

          {activeTimer ? (
            <div className="text-center py-6">
              <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                {formatTime(elapsedTime)}
              </div>
              <p className="text-gray-600 mb-4">Working on: {activeTimer.taskTitle}</p>
              <Button color="danger" onPress={stopTimer}>
                Stop Timer
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">Select a task to start tracking time</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {availableTasks.slice(0, 3).map((task) => (
                  <Button
                    key={task.id}
                    variant="bordered"
                    className="h-auto p-4"
                    onPress={() => startTimer(task.id, task.title)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-gray-500">{task.project}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Recent Time Entries */}
      <Card>
        <CardBody className="p-6">
          <h4 className="text-lg font-semibold mb-4">Recent Time Entries</h4>
          <div className="space-y-3">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar size="sm" name={entry.user.charAt(0)} />
                  <div>
                    <p className="font-medium text-sm">{entry.taskTitle}</p>
                    <p className="text-xs text-gray-500">{entry.user} • {entry.date}</p>
                  </div>
                </div>
                <Chip size="sm" color="primary" variant="flat">
                  {formatDuration(entry.duration)}
                </Chip>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardBody className="p-6">
          <h4 className="text-lg font-semibold mb-4">This Week</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">32h</div>
              <div className="text-sm text-gray-500">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">18</div>
              <div className="text-sm text-gray-500">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">6.4h</div>
              <div className="text-sm text-gray-500">Daily Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">94%</div>
              <div className="text-sm text-gray-500">Productivity</div>
            </div>
          </div>
          <Progress value={75} className="mt-4" color="primary" />
          <p className="text-sm text-gray-500 mt-2">75% of weekly goal (40h)</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default TimeTracker;