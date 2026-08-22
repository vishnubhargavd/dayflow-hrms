import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, Search, Plus } from "lucide-react";
import { InteractiveCard } from "./InteractiveCard";
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
  joiningYear?: number;
  [key: string]: any;
}

interface EmployeeKanbanProps {
  employees?: EmployeeItem[];
  onSelectEmployee: (emp: EmployeeItem, defaultTab?: 'profile' | 'salary' | 'attendance') => void;
  onOpenCreateModal?: () => void;
  [key: string]: any;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 25 },
  },
};

export const EmployeeKanban: React.FC<EmployeeKanbanProps> = ({
  employees: propEmployees,
  onSelectEmployee,
  onOpenCreateModal,
}) => {
  const [employees, setEmployees] = useState<EmployeeItem[]>(propEmployees || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDept, setActiveDept] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propEmployees || propEmployees.length === 0) {
      setLoading(true);
      api.getEmployees()
        .then((data) => {
          setEmployees(data || INITIAL_EMPLOYEES);
        })
        .finally(() => setLoading(false));
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Odoo Control Panel Bar (Sub-Header) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        {/* Left: Odoo [NEW] Button & Title */}
        <div className="flex items-center gap-4">
          {onOpenCreateModal && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenCreateModal}
              className="bg-gradient-to-r from-[#714B67] to-[#593a51] text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-all shadow-[0_4px_16px_rgba(113,75,103,0.4)] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>NEW</span>
            </motion.button>
          )}

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">Employees</h1>
            <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/[0.08] text-zinc-400 font-mono">
              {filteredEmployees.length}
            </span>
          </div>
        </div>

        {/* Right: Search Box & Department Chips */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#14151f]/80 border border-white/[0.08] rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#714B67] w-64 transition-all"
            />
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-[#14151f]/80 border border-white/[0.08] p-1 rounded-xl">
            {departments.map((dept) => (
              <button
                key={String(dept)}
                onClick={() => setActiveDept(String(dept))}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeDept === dept
                    ? "bg-[#714B67] text-white shadow-[0_2px_10px_rgba(113,75,103,0.5)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                {String(dept)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shimmer Skeleton Loader */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#14151f]/80 border border-white/[0.08] rounded-2xl p-5 animate-pulse space-y-4 shadow-xl"
            >
              <div className="flex justify-between items-center">
                <div className="w-16 h-4 bg-white/5 rounded" />
                <div className="w-3 h-3 bg-white/5 rounded-full" />
              </div>
              <div className="flex flex-col items-center space-y-2 pt-2">
                <div className="w-[68px] h-[68px] bg-white/5 rounded-2xl" />
                <div className="w-24 h-4 bg-white/5 rounded mt-2" />
                <div className="w-28 h-3 bg-white/5 rounded" />
                <div className="w-20 h-4 bg-white/5 rounded-md" />
              </div>
              <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                <div className="w-16 h-3 bg-white/5 rounded" />
                <div className="w-20 h-3 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* High-End Enterprise Kanban Grid with 3D Magnetic Interactive Cards */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5"
        >
          {filteredEmployees.map((emp) => {
            const displayName = (emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`).trim() || "Employee";
            const displayRole = emp.role || emp.jobTitle || emp.designation?.title || "Staff Member";
            const deptName = getDeptName(emp.department);
            const rawStatus = (emp.status || emp.todayStatus || "absent").toLowerCase();
            const status = rawStatus === "on_leave" ? "leave" : rawStatus;
            const joiningYear = emp.joiningYear || 2023;

            return (
              <motion.div key={emp.id} variants={itemVariants}>
                <InteractiveCard
                  onClick={() => onSelectEmployee(emp)}
                  className="group flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Top Row: Department Badge & Presence Indicator */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-white/5 text-zinc-400 border border-white/5 px-2 py-0.5 rounded text-[11px] font-medium truncate max-w-[120px]">
                        {deptName}
                      </span>

                      {/* Presence Indicator */}
                      <div>
                        {status === "present" && (
                          <span className="relative flex h-2.5 w-2.5" title="Present in Office">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                          </span>
                        )}
                        {status === "leave" && (
                          <div
                            className="p-1 rounded bg-[#017E84]/20 text-[#017E84] border border-[#017E84]/40"
                            title="On Leave"
                          >
                            <Plane className="w-3 h-3" />
                          </div>
                        )}
                        {status !== "present" && status !== "leave" && (
                          <span
                            className="inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]"
                            title="Absent"
                          />
                        )}
                      </div>
                    </div>

                    {/* Centered Avatar (68x68px) & Details */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-[68px] h-[68px] rounded-2xl overflow-hidden border border-white/[0.1] p-0.5 bg-[#0c0d14] shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-[#714B67] group-hover:scale-105 transition-all duration-300">
                        <img
                          src={
                            emp.avatarUrl ||
                            emp.profilePicture ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
                          }
                          alt={displayName}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Name & Job Title */}
                      <h3 className="text-base font-semibold text-white mt-3 group-hover:text-[#D4A5C9] transition-colors">
                        {displayName}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{displayRole}</p>

                      {/* Deterministic Login ID Badge */}
                      {emp.loginId && (
                        <span className="text-[11px] font-mono bg-[#714B67]/15 text-[#D4A5C9] border border-[#714B67]/30 px-2.5 py-0.5 rounded-md mt-2 font-medium">
                          {emp.loginId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="border-t border-white/[0.06] mt-4 pt-3 flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-[11px]">Joined {joiningYear}</span>
                    <span className="text-[#017E84] group-hover:text-[#D4A5C9] group-hover:translate-x-0.5 transition-all font-medium flex items-center gap-0.5">
                      <span>View Profile</span>
                      <span>→</span>
                    </span>
                  </div>
                </InteractiveCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
