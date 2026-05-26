import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import * as menuApi from '@/features/admin/api/menu.api';
import { message } from 'antd';

type AdminSidebarMenuProps = {
  sidebarItems: DashboardSidebarItem[];
  onSidebarItemsChange?: (items: DashboardSidebarItem[]) => void;
  collapsed: boolean;
  activeKey: string;
  navigate: (path: string) => void;
};

export function AdminSidebarMenu({
  sidebarItems,
  onSidebarItemsChange,
  collapsed,
  activeKey,
  navigate,
}: AdminSidebarMenuProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [draggedGroupIdx, setDraggedGroupIdx] = useState<number | null>(null);
  const [draggedItemInfo, setDraggedItemInfo] = useState<{ groupKey: string; index: number } | null>(null);
  const [dragOverGroupIdx, setDragOverGroupIdx] = useState<number | null>(null);
  const [dragOverItemInfo, setDragOverItemInfo] = useState<{ groupKey: string; index: number } | null>(null);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // --- Drag and Drop: Groups ---
  const handleGroupDragStart = (e: React.DragEvent, index: number) => {
    if (collapsed) return;
    setDraggedGroupIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    // Subtle dragging ghost opacity style handled dynamically
  };

  const handleGroupDragOver = (e: React.DragEvent, index: number) => {
    if (collapsed || draggedGroupIdx === null) return;
    e.preventDefault();
    if (index !== draggedGroupIdx) {
      setDragOverGroupIdx(index);
    }
  };

  const handleGroupDragEnd = () => {
    setDraggedGroupIdx(null);
    setDragOverGroupIdx(null);
  };

  const handleGroupDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedGroupIdx === null || draggedGroupIdx === targetIndex) return;

    // Filter dynamic groups and core items
    const coreItems = sidebarItems.filter((item) => item.type === 'core');
    const dynamicGroups = sidebarItems.filter((item) => item.type === 'group');

    // Adjust indices since core items are at the beginning
    const adjustedSource = draggedGroupIdx - coreItems.length;
    const adjustedTarget = targetIndex - coreItems.length;

    if (adjustedSource < 0 || adjustedTarget < 0) return;

    const reorderedGroups = [...dynamicGroups];
    const [removed] = reorderedGroups.splice(adjustedSource, 1);
    reorderedGroups.splice(adjustedTarget, 0, removed);

    const updatedItems = [...coreItems, ...reorderedGroups];

    // Optimistic Update UI immediately
    if (onSidebarItemsChange) {
      onSidebarItemsChange(updatedItems);
    }

    setDraggedGroupIdx(null);
    setDragOverGroupIdx(null);

    // Sync to DB in the background
    try {
      const promises = reorderedGroups.map((group, index) => {
        if (group.id) {
          return menuApi.updateMenuOrder(group.id, index + 1);
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      window.dispatchEvent(new Event('menuUpdated'));
      message.success('Đã cập nhật thứ tự nhóm menu!');
    } catch (err) {
      console.error('Failed to sync group order:', err);
      message.error('Lỗi đồng bộ thứ tự nhóm vào CSDL!');
    }
  };

  // --- Drag and Drop: Items (Within Group) ---
  const handleItemDragStart = (e: React.DragEvent, groupKey: string, index: number) => {
    e.stopPropagation();
    setDraggedItemInfo({ groupKey, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDragOver = (e: React.DragEvent, groupKey: string, index: number) => {
    if (!draggedItemInfo || draggedItemInfo.groupKey !== groupKey) return;
    e.preventDefault();
    e.stopPropagation();
    if (index !== draggedItemInfo.index) {
      setDragOverItemInfo({ groupKey, index });
    }
  };

  const handleItemDragEnd = () => {
    setDraggedItemInfo(null);
    setDragOverItemInfo(null);
  };

  const handleItemDrop = async (e: React.DragEvent, groupKey: string, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItemInfo || draggedItemInfo.groupKey !== groupKey || draggedItemInfo.index === targetIndex) return;

    const newItems = sidebarItems.map((group) => {
      if (group.key === groupKey && group.children) {
        const reorderedChildren = [...group.children];
        const [removed] = reorderedChildren.splice(draggedItemInfo.index, 1);
        reorderedChildren.splice(targetIndex, 0, removed);
        return {
          ...group,
          children: reorderedChildren,
        };
      }
      return group;
    });

    // Optimistic Update UI immediately
    if (onSidebarItemsChange) {
      onSidebarItemsChange(newItems);
    }

    const updatedGroup = newItems.find((g) => g.key === groupKey);
    const childrenToSync = updatedGroup?.children || [];

    setDraggedItemInfo(null);
    setDragOverItemInfo(null);

    // Sync to DB in the background
    try {
      const promises = childrenToSync.map((child, index) => {
        if (child.id) {
          return menuApi.updateMenuItemOrder(child.id, index + 1);
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      window.dispatchEvent(new Event('menuUpdated'));
      message.success('Đã cập nhật thứ tự nút bấm!');
    } catch (err) {
      console.error('Failed to sync item order:', err);
      message.error('Lỗi đồng bộ thứ tự link vào CSDL!');
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-1 px-3 select-none">
      {sidebarItems.map((item, index) => {
        // --- Core items (Static) ---
        if (item.type === 'core') {
          const isActive = activeKey === item.path;
          return (
            <button
              key={item.key}
              onClick={() => item.path && navigate(item.path)}
              className={cn(
                'group/btn relative flex w-full items-center gap-3 rounded-xl py-3 text-sm font-medium transition-all duration-200',
                collapsed ? 'justify-center px-0' : 'px-4',
                isActive
                  ? 'bg-cosmate-soft-pink/50 text-cosmate-pink shadow-[inset_0_0_0_1px_rgba(236,72,153,0.15)]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {isActive && (
                <div className="absolute left-1.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-cosmate-pink" />
              )}
              <span className={cn('shrink-0 transition-transform duration-200 group-hover/btn:scale-110', isActive && 'text-cosmate-pink')}>
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        }

        // --- Dynamic Groups (Draggable) ---
        const isGroupExpanded = expandedGroups[item.key] ?? true;
        const isDraggingThisGroup = draggedGroupIdx === index;
        const isDragOverThisGroup = dragOverGroupIdx === index;

        return (
          <div
            key={item.key}
            draggable={!collapsed}
            onDragStart={(e) => handleGroupDragStart(e, index)}
            onDragOver={(e) => handleGroupDragOver(e, index)}
            onDragEnd={handleGroupDragEnd}
            onDrop={(e) => handleGroupDrop(e, index)}
            className={cn(
              'group/group-sec relative my-1 rounded-xl transition-all duration-200 border border-transparent',
              isDraggingThisGroup && 'opacity-40 border-dashed border-cosmate-pink/40 bg-cosmate-soft-pink/5',
              isDragOverThisGroup && 'border-dashed border-cosmate-pink bg-cosmate-soft-pink/10 translate-y-1'
            )}
          >
            {/* Group Header */}
            <div
              className={cn(
                'flex w-full items-center justify-between rounded-xl py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors',
                collapsed ? 'justify-center px-0' : 'pl-3 pr-2 hover:bg-muted/40'
              )}
            >
              <div
                onClick={() => !collapsed && toggleGroup(item.key)}
                className={cn(
                  'flex items-center gap-2 truncate cursor-pointer',
                  !collapsed && 'flex-1 pr-2'
                )}
              >
                {!collapsed && (
                  <GripVertical
                    size={13}
                    className="shrink-0 cursor-grab text-muted-foreground/30 opacity-0 group-hover/group-sec:opacity-100 transition-opacity active:cursor-grabbing hover:text-cosmate-pink"
                    title="Kéo để sắp xếp nhóm"
                  />
                )}
                <span className="truncate">{item.label}</span>
              </div>

              {!collapsed && (
                <button
                  type="button"
                  onClick={() => toggleGroup(item.key)}
                  className="flex h-5 w-5 items-center justify-center rounded-md hover:bg-muted text-muted-foreground/60 transition-colors"
                >
                  {isGroupExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              )}
            </div>

            {/* Group Children (Items) */}
            {isGroupExpanded && item.children && item.children.length > 0 && (
              <div className={cn('flex flex-col gap-1', !collapsed && 'mt-1 pl-2.5')}>
                {item.children.map((child, childIdx) => {
                  const isChildActive = activeKey === child.path;
                  const isDraggingThisChild =
                    draggedItemInfo?.groupKey === item.key && draggedItemInfo?.index === childIdx;
                  const isDragOverThisChild =
                    dragOverItemInfo?.groupKey === item.key && dragOverItemInfo?.index === childIdx;

                  return (
                    <div
                      key={child.key}
                      draggable={!collapsed}
                      onDragStart={(e) => handleItemDragStart(e, item.key, childIdx)}
                      onDragOver={(e) => handleItemDragOver(e, item.key, childIdx)}
                      onDragEnd={handleItemDragEnd}
                      onDrop={(e) => handleItemDrop(e, item.key, childIdx)}
                      className={cn(
                        'group/item relative rounded-lg border border-transparent transition-all duration-150',
                        isDraggingThisChild && 'opacity-40 border-dashed border-cosmate-pink/40 bg-cosmate-soft-pink/5',
                        isDragOverThisChild && 'border-dashed border-cosmate-pink bg-cosmate-soft-pink/10 translate-x-1'
                      )}
                    >
                      <button
                        onClick={() => child.path && navigate(child.path)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg py-2.5 text-xs transition-all duration-200',
                          collapsed ? 'justify-center px-0' : 'pl-2.5 pr-2',
                          isChildActive
                            ? 'bg-cosmate-soft-pink/50 text-cosmate-pink font-semibold shadow-[inset_0_0_0_1px_rgba(236,72,153,0.15)]'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        {!collapsed && (
                          <GripVertical
                            size={12}
                            className="shrink-0 cursor-grab text-muted-foreground/30 opacity-0 group-hover/item:opacity-100 transition-opacity active:cursor-grabbing hover:text-cosmate-pink"
                            title="Kéo để sắp xếp link"
                          />
                        )}
                        <span className={cn('shrink-0 transition-transform duration-200 group-hover/item:scale-105', isChildActive && 'text-cosmate-pink')}>
                          {child.icon}
                        </span>
                        {!collapsed && <span className="truncate">{child.label}</span>}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
