export const guestUser = {
  _id: "guest-user",
  name: "Guest Creator",
  email: "guest@tubeforge.demo",
  picture: "https://i.pravatar.cc/80?img=12",
  isGuest: true,
};

export const guestVideos = [
  {
    id: "guest-video-1",
    _id: "guest-video-1",
    snippet: {
      title: "How to Build a Viral Short",
      description: "A demo TubeForge creator workflow.",
      publishedAt: "2026-06-01T09:00:00Z",
      thumbnails: {
        default: {
          url: "https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=320&q=80",
        },
        medium: {
          url: "https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=640&q=80",
        },
      },
    },
    contentDetails: {
      videoId: "guest-video-1",
    },
  },
  {
    id: "guest-video-2",
    _id: "guest-video-2",
    snippet: {
      title: "Editing a Talking Head Video Fast",
      description: "Demo analytics and thumbnail preview.",
      publishedAt: "2026-05-28T11:30:00Z",
      thumbnails: {
        default: {
          url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=320&q=80",
        },
        medium: {
          url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=640&q=80",
        },
      },
    },
    contentDetails: {
      videoId: "guest-video-2",
    },
  },
  {
    id: "guest-video-3",
    _id: "guest-video-3",
    snippet: {
      title: "Creator Dashboard Walkthrough",
      description: "Sample TubeForge channel content.",
      publishedAt: "2026-05-20T14:15:00Z",
      thumbnails: {
        default: {
          url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=320&q=80",
        },
        medium: {
          url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=80",
        },
      },
    },
    contentDetails: {
      videoId: "guest-video-3",
    },
  },
];

export const guestThumbnails = [
  {
    _id: "guest-thumbnail-1",
    title: "AI Thumbnail Demo",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80",
  },
  {
    _id: "guest-thumbnail-2",
    title: "YouTube Growth Tips",
    imageUrl:
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1280&q=80",
  },
];

export const guestSavedVideos = [
  {
    _id: "guest-saved-video-1",
    title: "Demo Saved Video",
    description: "A sample saved video for guest browsing.",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: "",
  },
];

export const guestDashboard = {
  message: "Guest dashboard data fetched",
  channel: {
    title: "TubeForge Demo Channel",
    description: "Explore TubeForge without connecting a Google account.",
    subscribers: "12840",
    views: "842300",
    totalVideos: "36",
    thumbnail: guestUser.picture,
  },
  videos: guestVideos,
};

export const guestVideoAnalytics = {
  views: 24800,
  estimatedMinutesWatched: 5240,
  averageViewDuration: 218,
  likes: 1430,
  comments: 186,
  subscribersGained: 312,
};

export const guestChannelAnalytics = {
  message: "Guest channel analytics fetched",
  analytics: guestVideoAnalytics,
  timeline: [
    { date: "2026-06-01", views: 1200, subs: 14 },
    { date: "2026-06-02", views: 2200, subs: 24 },
    { date: "2026-06-03", views: 3100, subs: 32 },
    { date: "2026-06-04", views: 2800, subs: 29 },
    { date: "2026-06-05", views: 4300, subs: 47 },
    { date: "2026-06-06", views: 5200, subs: 58 },
    { date: "2026-06-07", views: 6100, subs: 66 },
  ],
};
