// Auto-generated content file - Do not edit manually
// Generated from: src/content/pages/admin.yml
// Language: EN

import type { PageContent } from '@/types/content';

export const admin_enContent: PageContent = {
  "meta": {
    "title": "Admin Panel | AI Whisperers",
    "description": "Manage users, courses, content, and platform settings.",
    "language": "en",
    "keywords": [
      "AI",
      "education"
    ]
  },
  "hero": {
    "title": "Admin Dashboard",
    "subtitle": "Platform management and oversight"
  },
  "navigation": {
    "items": [
      {
        "label": "Dashboard",
        "href": "/admin",
        "icon": "LayoutDashboard"
      },
      {
        "label": "Users",
        "href": "/admin/users",
        "icon": "Users"
      },
      {
        "label": "Courses",
        "href": "/admin/courses",
        "icon": "BookOpen"
      },
      {
        "label": "Content",
        "href": "/admin/content",
        "icon": "FileText"
      },
      {
        "label": "Analytics",
        "href": "/admin/analytics",
        "icon": "BarChart"
      },
      {
        "label": "Settings",
        "href": "/admin/settings",
        "icon": "Settings"
      }
    ]
  },
  "stats": {
    "title": "Platform Overview",
    "metrics": [
      {
        "label": "Total Users",
        "value": "0",
        "icon": "Users",
        "color": "blue"
      },
      {
        "label": "Active Courses",
        "value": "0",
        "icon": "BookOpen",
        "color": "green"
      },
      {
        "label": "Total Revenue",
        "value": "$0",
        "icon": "DollarSign",
        "color": "purple"
      },
      {
        "label": "Completion Rate",
        "value": "0%",
        "icon": "TrendingUp",
        "color": "orange"
      }
    ]
  },
  "recent_activity": {
    "title": "Recent Activity",
    "empty": "No recent admin activity"
  },
  "quick_actions": {
    "title": "Quick Actions",
    "actions": [
      {
        "label": "Add New Course",
        "icon": "Plus",
        "href": "/admin/courses/new"
      },
      {
        "label": "Manage Users",
        "icon": "UserPlus",
        "href": "/admin/users"
      },
      {
        "label": "View Analytics",
        "icon": "BarChart",
        "href": "/admin/analytics"
      },
      {
        "label": "Platform Settings",
        "icon": "Settings",
        "href": "/admin/settings"
      }
    ]
  }
} as const;

export default admin_enContent;
