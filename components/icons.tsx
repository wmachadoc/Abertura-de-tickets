import React from 'react';

const createIcon = (path: React.ReactNode): React.FC<React.SVGProps<SVGSVGElement>> => 
  ({ className = 'w-6 h-6', ...props }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
      {...props}
    >
      {path}
    </svg>
  );

export const DashboardIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
);

export const TicketIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
);

export const UsersIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />
);

export const SettingsIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
);

export const ReportsIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
);

export const LogoutIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
);

export const PlusIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
);

export const ArrowLeftIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
);

export const ChevronUpIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
);

export const ChevronDownIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
);

export const TagIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59L18 8.17a2 2 0 010 2.83l-5.59 5.59A2 2 0 0111 17H5a2 2 0 01-2-2V5a2 2 0 012-2h2z" />
);
export const ClipboardListIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
);
export const OfficeBuildingIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-5-4h1m-1 4h1" />
);
export const ReplyIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6" />
);
export const ClockIcon = createIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
);
export const FolderIcon = createIcon(
    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
);
export const FileIcon = createIcon(
    <><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></>
);
export const GoogleSheetsIcon = createIcon(
    <path fill="currentColor" d="M14.5,3H9.5Q8.65,3,8.075,3.575Q7.5,4.15,7.5,5V9H16.5V5Q16.5,4.15,15.925,3.575Q15.35,3,14.5,3M14.5,15H9.5Q8.65,15,8.075,14.425Q7.5,13.85,7.5,13V11H16.5V13Q16.5,13.85,15.925,14.425Q15.35,15,14.5,15M16.5,10H7.5V10Z M14.5,17H9.5Q8.65,17,8.075,17.575Q7.5,18.15,7.5,19V21H16.5V19Q16.5,18.15,15.925,17.575Q15.35,17,14.5,17M6,2V8Q6,8.425 5.713,8.713Q5.425,9 5,9H2V2ZM6,10V14H2V10ZM6,16V22H5Q4.575,22 4.288,21.713Q4,21.425 4,21V16ZM7,1H17Q18.65,1 19.825,2.175Q21,3.35 21,5V19Q21,20.65 19.825,21.825Q18.65,23 17,23H7Q5.35,23 4.175,21.825Q3,20.65 3,19V5Q3,3.35 4.175,2.175Q5.35,1 7,1Z" />
);
