import React from 'react';
import '../styles/Tabs.css';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const childrenArray = React.Children.toArray(children);

  return (
    <div className="tabs-container">
      {childrenArray.map((child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            activeTab,
            onTabChange: setActiveTab
          });
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="tabs-list">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            activeTab,
            onTabChange
          });
        }
        return child;
      })}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  activeTab,
  onTabChange
}) => {
  return (
    <button
      className={`tab-trigger ${activeTab === value ? 'active' : ''}`}
      onClick={() => onTabChange?.(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  activeTab
}) => {
  if (activeTab !== value) return null;

  return <div className="tabs-content">{children}</div>;
};
