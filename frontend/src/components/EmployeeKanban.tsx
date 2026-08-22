import React, { useState, useEffect } from "react";
import { SpotlightCard } from "./SpotlightCard";
import { Plane, Search } from "lucide-react";
import { api, INITIAL_EMPLOYEES } from "../services/api";

export interface EmployeeItem {
  id: string;
  loginId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  jobTitle?: string;
  department?: string | { id?: string; name?: string; code?: string };
  avatarUrl?: string;
  profilePicture?: string;
  status?: "present" | "leave" | "absent" | string;
  todayStatus?: string;
  monthlyWage?: number;
  [key: string]: any;
}

interface EmployeeKanbanProps {
  employees?: EmployeeItem[];
  onSelectEmployee: (emp: EmployeeItem, defaultTab?: 'profile' | 'salary' | 'attendance') => void;
  onOpenCreateModal?: () => void;
  [key: string]: any;
}

export const EmployeeKanban: React.FC<EmployeeKanbanProps> = ({
  employees: propEmployees,
  onSelectEmployee,
  onOpenCreateModal,
}) => {
  const [employees, setEmployees] = useState<EmployeeItem[]>(propEmployees || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDept, setActiveDept] = useState("All");

  useEffect(() => {
    if (!propEmployees || propEmployees.length === 0) {
      api.getEmployees().then((data) => {
        setEmployees(data || INITIAL_EMPLOYEES);
      });
    } else {
      setEmployees(propEmployees);
    }
  }, [propEmployees]);

  const getDeptName = (dept: any): string => {
    if (!dept) return "General";
    if (typeof dept === "string") return dept;
    return dept.name || "General";
  };

  const departments = [
    "All",
    ...Array.from(new Set(employees.map((e) => getDeptName(e.department)).filter(Boolean))),
  ];

  const filteredEmployees = employees.filter((emp) => {
    const fullName = (emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`).trim().toLowerCase();
    const loginId = (emp.loginId || "").toLowerCase();
    const role = (emp.role || emp.jobTitle || emp.designation?.title || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const deptName = getDeptName(emp.department);

    const matchesSearch = fullName.includes(search) || loginId.includes(search) || role.includes(search);
    const matchesDept = activeDept === "All" || deptName === activeDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 w-72 transition-all"
            />
          </div>

          <div className="hidden lg:flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800/80 p-1 rounded-xl">
            {departments.map((dept) => (
              <button
                key={String(dept)}
                onClick={() => setActiveDept(String(dept))}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  activeDept === dept
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {String(dept)}
              </button>
            ))}
          </div>
        </div>

        {onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20"
          >
            + New Employee
          </button>
        )}
      </div>

      {/* Excalidraw Kanban Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEmployees.map((emp) => {
          const displayName = (emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`).trim() || "Employee";
          const displayRole = emp.role || emp.jobTitle || emp.designation?.title || "Staff Member";
          const deptName = getDeptName(emp.department);
          const rawStatus = (emp.status || emp.todayStatus || "absent").toLowerCase();
          const status = rawStatus === "on_leave" ? "leave" : rawStatus;

          return (
            <SpotlightCard
              key={emp.id}
              onClick={() => onSelectEmployee(emp)}
              className="cursor-pointer group flex flex-col items-center text-center backdrop-blur-xl relative"
            >
              {/* Pinned Top-Right Presence Indicator */}
              <div className="absolute top-4 right-4 z-20">
                {status === "present" && (
                  <span className="relative flex h-3 w-3" title="Present in Office">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                  </span>
                )}
                {status === "leave" && (
                  <div
                    className="p-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30"
                    title="On Leave"
                  >
                    <Plane className="w-3.5 h-3.5" />
                  </div>
                )}
                {status !== "present" && status !== "leave" && (
                  <span
                    className="inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_8px_#f59e0b]"
                    title="Absent"
                  ></span>
                )}
              </div>

              {/* Centered Avatar */}
              <div className="relative mb-3 mt-1">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-zinc-700/60 p-1 bg-zinc-900 group-hover:border-purple-500/50 transition-colors">
                  <img
                    src={
                      emp.avatarUrl ||
                      emp.profilePicture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
                    }
                    alt={displayName}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Deterministic Login ID Badge */}
              {emp.loginId && (
                <span className="text-[11px] font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-2">
                  {emp.loginId}
                </span>
              )}

              {/* Name & Job Title */}
              <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
                {displayName}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{displayRole}</p>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 w-full flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                <span>{deptName}</span>
                <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">
                  View Profile →
                </span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};
