"use client";

import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Tabs,
  Tab,
  Progress,
  Chip,
  Avatar,
  AvatarGroup,
  Input,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { useState } from "react";
import UserManagement from "@/components/UserManagement";
import ReportsManager from "@/components/ReportsManager";
import ProjectsManager from "@/components/ProjectsManager";
import AutomationManager from "@/components/AutomationManager";

const Icons = {
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>,
  Projects: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Reports: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  TrendingUp: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Activity: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
};

export default function AdminDashboard({ stats, distribution, teamActivity, allTasks, profileRequests, activities }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const quickStats = [
    {
      title: "Total Users",
      value: stats?.activeUsers || 24,
      change: "+12%",
      trend: "up",
      icon: Icons.Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Projects", 
      value: 8,
      change: "+3",
      trend: "up",
      icon: Icons.Projects,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Total Tasks",
      value: stats?.totalTasks || 156,
      change: "+28%",
      trend: "up",
      icon: Icons.Dashboard,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+5%",
      trend: "up",
      icon: Icons.TrendingUp,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const recentActivities = activities?.slice(0, 6) || [
    { id: 1, user: "John Doe", action: "created task", target: "Homepage Design", time: "2 min ago" },
    { id: 2, user: "Sarah Wilson", action: "completed", target: "User Research", time: "15 min ago" },
    { id: 3, user: "Mike Chen", action: "updated project", target: "Mobile App", time: "1 hour ago" }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardBody className="p-0">
                <div className={`bg-gradient-to-r ${stat.color} p-6 text-white rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <IconComponent />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="success" variant="flat">
                      {stat.change}
                    </Chip>
                    <span className="text-sm text-gray-600">vs last month</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <Button size="sm" variant="flat" color="primary">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar 
                      size="md" 
                      name={activity.user?.charAt(0) || activity.full_name?.charAt(0)} 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-900">{activity.user || activity.full_name}</span>
                        <span className="text-gray-600 mx-1">{activity.action || 'performed an action'}</span>
                        <span className="font-medium text-blue-600">{activity.target || activity.description}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time || activity.created_at}</p>
                    </div>
                    <Chip size="sm" variant="dot" color="primary">
                      New
                    </Chip>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Team Overview */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900">Team Overview</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {teamActivity?.slice(0, 5).map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        size="sm" 
                        name={user.full_name?.charAt(0)} 
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.role || 'Team Member'}</p>
                      </div>
                    </div>
                    <Chip 
                      size="sm" 
                      color={user.last_login ? "success" : "default"} 
                      variant="dot"
                    >
                      {user.last_login ? "Online" : "Offline"}
                    </Chip>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No team data available</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="flat" 
                  color="primary"
                  startContent={<Icons.Users />}
                >
                  Manage Users
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="flat" 
                  color="secondary"
                  startContent={<Icons.Projects />}
                >
                  Create Project
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="flat" 
                  color="success"
                  startContent={<Icons.Reports />}
                >
                  Generate Report
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Control Center
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive system management and analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search anything..."
                startContent={<Icons.Search />}
                className="w-80"
                variant="bordered"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                color="primary" 
                startContent={<Icons.Plus />}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
              >
                New Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Tabs */}
        <Tabs 
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          variant="underlined" 
          className="mb-8"
          classNames={{
            tabList: "bg-white/60 backdrop-blur-sm rounded-lg p-1 shadow-lg",
            tab: "px-6 py-3 font-semibold",
            cursor: "bg-gradient-to-r from-blue-500 to-purple-500"
          }}
        >
          <Tab 
            key="overview" 
            title={
              <div className="flex items-center gap-2">
                <Icons.Dashboard />
                <span>Overview</span>
              </div>
            }
          >
            {renderOverview()}
          </Tab>
          
          <Tab 
            key="users" 
            title={
              <div className="flex items-center gap-2">
                <Icons.Users />
                <span>User Management</span>
              </div>
            }
          >
            <UserManagement users={teamActivity} profileRequests={profileRequests} />
          </Tab>
          
          <Tab 
            key="projects" 
            title={
              <div className="flex items-center gap-2">
                <Icons.Projects />
                <span>Projects</span>
              </div>
            }
          >
            <ProjectsManager tasks={allTasks} />
          </Tab>
          
          <Tab 
            key="reports" 
            title={
              <div className="flex items-center gap-2">
                <Icons.Reports />
                <span>Analytics</span>
              </div>
            }
          >
            <ReportsManager stats={stats} distribution={distribution} activities={activities} />
          </Tab>
          
          <Tab 
            key="automation" 
            title={
              <div className="flex items-center gap-2">
                <Icons.Settings />
                <span>Automation</span>
              </div>
            }
          >
            <AutomationManager />
          </Tab>
        </Tabs>
      </div>

      {/* Modern Footer Banner */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-2xl">
          <CardBody className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">🚀 ToolStack Ops - Next Generation</h3>
                <p className="text-white/90">Advanced project management with AI-powered insights and automation</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">99.9%</div>
                  <div className="text-sm text-white/80">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm text-white/80">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">∞</div>
                  <div className="text-sm text-white/80">Scalability</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}