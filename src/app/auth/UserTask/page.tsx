"use client"
import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { FaPencil, FaCheck, FaRotateLeft, FaChartLine } from "react-icons/fa6";
import { MdDelete, MdAdd, MdTaskAlt, MdOutlineFormatListBulleted, MdTimer } from "react-icons/md";
import { HiLogout } from "react-icons/hi";

interface ITask {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
}

export default function UserTask() {
    const [tasks, setTasks] = useState<ITask[]>([])
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [loading, setLoading] = useState(true)
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null)

    // Stats calculation
    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, pending, percent };
    }, [tasks]);

    const fetchUser = async () => {
        try {
            const response = await axios.get("/api/auth/me")
            if (response.data.success) {
                setCurrentUser(response.data.data)
            }
        } catch (error: any) {
            window.location.href = "/auth/login"
        }
    }

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/api/tasks")
            if (response.data.success) {
                setTasks(response.data.data)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch tasks")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
        fetchTasks()
    }, [])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskTitle.trim()) return

        try {
            const response = await axios.post("/api/tasks", { title: newTaskTitle })
            if (response.data.success) {
                toast.success("Task added successfully")
                setNewTaskTitle("")
                fetchTasks()
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add task")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return
        try {
            const response = await axios.delete(`/api/tasks/${id}`)
            if (response.data.success) {
                toast.success("Task deleted")
                setTasks(tasks.filter(t => t._id !== id))
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete task")
        }
    }

    const handleToggleComplete = async (task: ITask) => {
        try {
            const response = await axios.put(`/api/tasks/${task._id}`, { completed: !task.completed })
            if (response.data.success) {
                setTasks(tasks.map(t => t._id === task._id ? { ...t, completed: !t.completed } : t))
            }
        } catch (error: any) {
            toast.error("Failed to update task")
        }
    }

    const startEditing = (task: ITask) => {
        setEditingTaskId(task._id)
        setEditTitle(task.title)
    }

    const handleUpdate = async (id: string) => {
        if (!editTitle.trim()) return
        try {
            const response = await axios.put(`/api/tasks/${id}`, { title: editTitle })
            if (response.data.success) {
                toast.success("Task updated")
                setEditingTaskId(null)
                setTasks(tasks.map(t => t._id === id ? { ...t, title: editTitle } : t))
            }
        } catch (error: any) {
            toast.error("Failed to update task")
        }
    }

    const handleLogout = async () => {
        try {
            const response = await axios.get("/api/auth/logout")
            if (response.data.success) {
                toast.success("Logged out")
                window.location.href = "/auth/login"
            }
        } catch (error: any) {
            toast.error("Logout failed")
        }
    }

    const handleDeleteAll = async () => {
        if (!confirm("Are you sure you want to delete ALL tasks? This action cannot be undone.")) return
        try {
            const response = await axios.delete("/api/tasks")
            if (response.data.success) {
                toast.success("All tasks deleted")
                setTasks([])
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete all tasks")
        }
    }

    // ── Full-page loading overlay ──────────────────────────────────────────
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center overflow-hidden">
                {/* Ambient background blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

                {/* Central loader card */}
                <div className="relative flex flex-col items-center gap-8 px-10 py-12 rounded-3xl border border-border/40 backdrop-blur-xl bg-secondary/20 shadow-2xl shadow-black/40">

                    {/* Spinning rings */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Outer ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" style={{ animationDuration: "1s" }} />
                        {/* Middle ring */}
                        <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
                        {/* Inner glow dot */}
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_24px_rgba(59,130,246,0.5)]">
                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-black tracking-tight text-foreground">
                            Loading your workspace
                        </h2>
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Fetching your tasks from the server…
                        </p>
                    </div>

                    {/* Shimmer progress bar */}
                    <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-primary via-purple-400 to-primary"
                            style={{
                                width: "60%",
                                animation: "shimmerProgress 1.6s ease-in-out infinite",
                            }}
                        />
                    </div>
                </div>

                {/* Keyframe for the shimmer progress bar */}
                <style>{`
                    @keyframes shimmerProgress {
                        0%   { transform: translateX(-160px); }
                        100% { transform: translateX(260px); }
                    }
                `}</style>
            </div>
        )
    }
    // ──────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-[family-name:var(--font-geist-sans)] relative overflow-x-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-top duration-700">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                            <span className="text-gradient">Task Workspace</span>
                        </h1>
                        {currentUser && (
                            <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full w-fit border border-border/50">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                <span className="text-sm font-medium">{currentUser.email}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 bg-secondary hover:bg-destructive/10 border border-border hover:border-destructive/30 text-muted-foreground hover:text-destructive px-5 py-2.5 rounded-2xl transition-all duration-300 text-sm font-bold shadow-sm"
                    >
                        <HiLogout className="text-lg group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </header>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Tasks', value: stats.total, icon: <MdOutlineFormatListBulleted />, color: 'blue' },
                        { label: 'Completed', value: stats.completed, icon: <MdTaskAlt />, color: 'green' },
                        { label: 'Pending', value: stats.pending, icon: <MdTimer />, color: 'amber' },
                        { label: 'Efficiency', value: `${stats.percent}%`, icon: <FaChartLine />, color: 'purple' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-5 rounded-2xl border border-border/40 hover:border-primary/30 transition-all duration-500 animate-in zoom-in delay-100 group">
                            <div className="flex items-center justify-between mb-3 text-muted-foreground">
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                                <span className="text-lg group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-black text-foreground">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Task Input */}
                <div className="glass-card p-4 md:p-6 rounded-3xl border border-border/40 shadow-xl mb-10 transition-all hover:border-primary/20 animate-in slide-in-from-bottom duration-700">
                    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="What needs to be done today?"
                                className="w-full bg-black/40 border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-foreground placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                        >
                            <MdAdd className="text-2xl" />
                            <span>Create Task</span>
                        </button>
                    </form>
                </div>

                {/* Task List Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            Your Daily Flow
                            <span className="text-muted-foreground font-normal text-sm bg-secondary px-2 py-0.5 rounded-lg border border-border/50">{tasks.length}</span>
                        </h2>
                        {tasks.length > 3 && (
                            <button
                                onClick={handleDeleteAll}
                                className="flex items-center gap-2 text-destructive hover:bg-destructive/10 px-4 py-2 rounded-xl border border-transparent hover:border-destructive/20 transition-all text-xs font-bold uppercase tracking-wider"
                            >
                                <MdDelete className="text-lg" />
                                <span>Clear All Tasks</span>
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 min-h-[400px]">
                        {tasks.length === 0 ? (
                            <div className="text-center py-24 glass-card border-2 border-dashed border-border/40 rounded-3xl animate-in zoom-in duration-700">
                                <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 text-muted-foreground opacity-50">
                                    <MdTaskAlt className="text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No tasks yet</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto">Click the add button above to start tracking your goals.</p>
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className={`group glass-card border ${task.completed ? 'border-green-500/20 bg-green-500/5' : 'border-border/60 hover:border-primary/40'} rounded-2xl p-5 flex items-center justify-between transition-all duration-300 hover:translate-x-1 hover:shadow-lg shadow-black/20 animate-in slide-in-from-right duration-500`}
                                >
                                    <div className="flex items-center gap-5 flex-1 pr-4">
                                        <button
                                            onClick={() => handleToggleComplete(task)}
                                            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${task.completed
                                                ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                                                : 'border-muted hover:border-primary bg-black/20'
                                                }`}
                                        >
                                            {task.completed && <FaCheck className="text-sm text-white" />}
                                        </button>

                                        {editingTaskId === task._id ? (
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    autoFocus
                                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(task._id)}
                                                    className="flex-1 bg-black/60 border border-primary rounded-xl px-3 py-1.5 outline-none text-foreground font-medium"
                                                />
                                                <button onClick={() => handleUpdate(task._id)} className="p-2 text-green-400 hover:bg-green-400/10 rounded-xl transition-colors"><FaCheck /></button>
                                                <button onClick={() => setEditingTaskId(null)} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"><FaRotateLeft /></button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col">
                                                <span className={`text-base md:text-lg font-bold transition-all duration-500 truncate max-w-[200px] sm:max-w-md ${task.completed ? 'text-muted-foreground/60 line-through decoration-2' : 'text-foreground'}`}>
                                                    {task.title}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground/50 font-medium">Added on {new Date(task.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {editingTaskId !== task._id && (
                                        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                                            <button
                                                onClick={() => startEditing(task)}
                                                className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300"
                                                title="Edit Task"
                                            >
                                                <FaPencil className="text-sm" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300"
                                                title="Delete Task"
                                            >
                                                <MdDelete className="text-xl" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <footer className="mt-20 py-10 text-center border-t border-border/30">
                <p className="text-xs text-muted-foreground/40 font-bold uppercase tracking-widest tracking-tighter">Designed for Maximum Focus & Productivity</p>
            </footer>
        </div>
    )
}