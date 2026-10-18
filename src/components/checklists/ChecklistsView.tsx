import React, { useState } from 'react';
import { Plus, CheckSquare, Clock, Check, ChevronRight, Pin } from 'lucide-react';
import { Checklist } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface ChecklistsViewProps {
  checklists: Checklist[];
  onSelectChecklist: (cl: Checklist) => void;
  onNewChecklist: () => void;
  onTogglePin: (cl: Checklist) => void;
}

export const ChecklistsView: React.FC<ChecklistsViewProps> = ({
  checklists,
  onSelectChecklist,
  onNewChecklist,
  onTogglePin,
}) => {
  const activeLists = checklists.filter(c => !c.trashed && !c.archived);

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 sm:px-6">
      <header className="pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size={42} />
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-ink-primary leading-tight">
              Checklists & Action
            </h1>
            <p className="text-xs text-ink-secondary">Structured Deliverables</p>
          </div>
        </div>

        <button
          onClick={onNewChecklist}
          className="px-4 py-2 rounded-full bg-ochre hover:bg-ochre-dark text-white text-xs font-medium flex items-center gap-1.5 shadow-lifted active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Checklist
        </button>
      </header>

      {activeLists.length === 0 ? (
        <div className="mt-12 text-center py-12 px-6 bg-white/70 border border-hairline rounded-card shadow-resting">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-ochre/10 flex items-center justify-center text-ochre mb-4">
            <CheckSquare className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl text-ink-primary mb-2">No Active Checklists</h2>
          <p className="text-sm text-ink-secondary max-w-sm mx-auto mb-6 leading-relaxed">
            Organize tasks, launch preps, grocery runs, and action plans with drag-and-drop reordering.
          </p>
          <button
            onClick={onNewChecklist}
            className="px-5 py-2.5 rounded-full bg-ochre hover:bg-ochre-dark text-white text-sm font-medium inline-flex items-center gap-2 shadow-lifted"
          >
            <Plus className="w-4 h-4" />
            Create First Checklist
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {activeLists.map((cl) => {
            const completedCount = cl.items.filter(i => i.completed).length;
            const totalCount = cl.items.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={cl.id}
                onClick={() => onSelectChecklist(cl)}
                className="bg-white border border-hairline rounded-card p-5 shadow-resting hover:shadow-lifted transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-ochre bg-ochre/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {cl.category || 'General'}
                    </span>
                    {cl.pinned && (
                      <Pin className="w-3.5 h-3.5 fill-ochre text-ochre" />
                    )}
                  </div>
                  <span className="text-xs font-mono text-ink-tertiary">
                    {completedCount} of {totalCount} completed
                  </span>
                </div>

                <h3 className="font-serif text-lg font-medium text-ink-primary mb-1">
                  {cl.title}
                </h3>
                {cl.subtitle && (
                  <p className="text-xs text-ink-secondary line-clamp-1 mb-3">
                    {cl.subtitle}
                  </p>
                )}

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-recessed overflow-hidden mb-3">
                  <div
                    className="bg-ochre h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-ink-tertiary pt-2 border-t border-hairline">
                  {cl.reminder_time ? (
                    <span className="flex items-center gap-1 text-ochre font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {cl.reminder_time}
                    </span>
                  ) : (
                    <span>Updated recently</span>
                  )}
                  <span className="flex items-center gap-0.5 text-ochre font-medium">
                    View list <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
