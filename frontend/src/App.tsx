import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'

interface Student {
  id: number
  firstName: string
  lastName: string
  admissionNumber?: string
  className?: string
  section?: string
  gender?: string
  dateOfBirth?: string
  active: boolean
}

interface Attendance {
  id: number
  studentId: number
  studentName: string
  className?: string
  date: string
  status: string
  notes?: string
}

interface DashboardSummary {
  studentCount: number
  classCount: number
  attendanceCount: number
  presentCount: number
  absentCount: number
  date: string
}

const initialFormState = {
  firstName: '',
  lastName: '',
  admissionNumber: '',
  className: '',
  section: '',
  gender: '',
  dateOfBirth: '',
  active: true,
}

const initialLoginState = {
  userName: 'teacher',
  password: 'Password123',
}

const initialAttendanceForm = {
  studentId: '',
  date: new Date().toISOString().slice(0, 10),
  status: 'Present',
  notes: '',
}

function App() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(initialFormState)
  const [token, setToken] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginForm, setLoginForm] = useState(initialLoginState)
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [attendanceError, setAttendanceError] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState('')
  const [attendanceForm, setAttendanceForm] = useState(initialAttendanceForm)
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/students')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load students')
        return response.json()
      })
      .then((data) => setStudents(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/dashboard')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load dashboard')
        return response.json()
      })
      .then((data) => setDashboard(data))
      .catch((err) => setDashboardError(err.message))
  }, [])

  useEffect(() => {
    if (students.length === 0) return
    const classes = Array.from(
      new Set(students.map((student) => student.className).filter(Boolean)),
    ) as string[]
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0])
    }
  }, [students, selectedClass])

  useEffect(() => {
    if (!selectedClass) return
    setAttendanceLoading(true)
    fetch(`/api/attendance/${encodeURIComponent(selectedClass)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load attendance')
        return response.json()
      })
      .then((data) => setAttendance(data))
      .catch((err) => setAttendanceError(err.message))
      .finally(() => setAttendanceLoading(false))
  }, [selectedClass])

  const fullName = useMemo(
    () => `${form.firstName} ${form.lastName}`.trim(),
    [form.firstName, form.lastName],
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleAttendanceChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setAttendanceForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError('Please sign in before adding students.')
      return
    }

    const body = {
      ...form,
      className: form.className || undefined,
      section: form.section || undefined,
      admissionNumber: form.admissionNumber || undefined,
      gender: form.gender || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
    }

    const response = await fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      setError('Unable to save student. Please try again.')
      return
    }

    const createdStudent = await response.json()
    setStudents((current) => [createdStudent, ...current])
    setForm(initialFormState)
  }

  const handleDelete = async (studentId: number) => {
    if (!token) {
      setError('Please sign in before deleting students.')
      return
    }

    const response = await fetch(`/api/students/${studentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      setError('Unable to delete student.')
      return
    }

    setStudents((current) => current.filter((student) => student.id !== studentId))
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError(null)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })

    if (!response.ok) {
      setLoginError('Invalid username or password.')
      return
    }

    const data = await response.json()
    setToken(data.accessToken)
    setRole(data.role)
    setUserName(data.userName)
  }

  const handleAttendanceSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAttendanceError(null)

    if (!token) {
      setAttendanceError('Please sign in before recording attendance.')
      return
    }

    const response = await fetch('/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        studentId: Number(attendanceForm.studentId),
        date: attendanceForm.date,
        status: attendanceForm.status,
        notes: attendanceForm.notes || undefined,
      }),
    })

    if (!response.ok) {
      setAttendanceError('Unable to record attendance.')
      return
    }

    const created = await response.json()
    setAttendance((current) => [created, ...current])
    setAttendanceForm((current) => ({
      ...current,
      studentId: '',
      notes: '',
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">School Management ERP</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Minimal student management starter for the .NET backend and React frontend.
          </p>
        </header>

        <section className="mb-10 grid gap-6 lg:grid-cols-5">
          {dashboardError ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 lg:col-span-5">
              {dashboardError}
            </div>
          ) : (
            <>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Students</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {dashboard?.studentCount ?? '--'}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Classes</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {dashboard?.classCount ?? '--'}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Attendance Today</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {dashboard?.attendanceCount ?? '--'}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Present</p>
                <p className="mt-3 text-2xl font-semibold text-emerald-600">
                  {dashboard?.presentCount ?? '--'}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Absent</p>
                <p className="mt-3 text-2xl font-semibold text-rose-600">
                  {dashboard?.absentCount ?? '--'}
                </p>
              </div>
            </>
          )}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Student Directory</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Browse students and manage records directly from the frontend.
                </p>
              </div>
              <span className="rounded-full bg-indigo-500 px-3 py-1 text-sm font-semibold text-white">
                {students.length} students
              </span>
            </div>

            {loading ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                Loading students...
              </div>
            ) : error ? (
              <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                {error}
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="rounded-3xl border border-slate-200 p-5 shadow-sm transition hover:border-indigo-300"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {student.admissionNumber ?? 'No admission ID'} • {student.className ?? 'No class'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(student.id)}
                        className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Quick add student</h2>
            <p className="mt-1 text-sm text-slate-500">Add a new student record to the directory.</p>

            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Sign in</p>
              <p className="text-slate-500">Use staff credentials to edit records.</p>
              <form className="mt-4 grid gap-3" onSubmit={handleLogin}>
                <input
                  name="userName"
                  value={loginForm.userName}
                  onChange={handleLoginChange}
                  placeholder="Username"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                />
                <input
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Sign in
                </button>
                {loginError ? <p className="text-xs text-rose-600">{loginError}</p> : null}
                {token ? (
                  <p className="text-xs text-emerald-600">Signed in as {userName} ({role})</p>
                ) : null}
              </form>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">First name</span>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Last name</span>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Class</span>
                  <input
                    name="className"
                    value={form.className}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Section</span>
                  <input
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Admission ID</span>
                  <input
                    name="admissionNumber"
                    value={form.admissionNumber}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Gender</span>
                  <input
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Date of birth</span>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  name="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Active student
              </label>

              <button
                type="submit"
                className="mt-4 w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Add student
              </button>
            </form>

            <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Preview</p>
              <p>{fullName || 'Student name will appear here'}</p>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Attendance</h2>
                <p className="mt-1 text-sm text-slate-500">Track daily attendance by class.</p>
              </div>
              <select
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              >
                <option value="" disabled>
                  Select class
                </option>
                {Array.from(
                  new Set(students.map((student) => student.className).filter(Boolean)),
                ).map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>

            {attendanceLoading ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                Loading attendance...
              </div>
            ) : attendanceError ? (
              <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                {attendanceError}
              </div>
            ) : attendance.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                No attendance records yet.
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {attendance.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-3xl border border-slate-200 p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{record.studentName}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {record.date} • {record.status}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {record.className ?? selectedClass}
                      </span>
                    </div>
                    {record.notes ? (
                      <p className="mt-3 text-sm text-slate-500">{record.notes}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Record attendance</h2>
            <p className="mt-1 text-sm text-slate-500">Add a new attendance entry.</p>

            <form className="mt-6 space-y-4" onSubmit={handleAttendanceSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Student</span>
                <select
                  name="studentId"
                  value={attendanceForm.studentId}
                  onChange={handleAttendanceChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                  required
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Date</span>
                <input
                  name="date"
                  type="date"
                  value={attendanceForm.date}
                  onChange={handleAttendanceChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Status</span>
                <select
                  name="status"
                  value={attendanceForm.status}
                  onChange={handleAttendanceChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Excused">Excused</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Notes</span>
                <input
                  name="notes"
                  value={attendanceForm.notes}
                  onChange={handleAttendanceChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                />
              </label>

              <button
                type="submit"
                className="mt-4 w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Record attendance
              </button>
            </form>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default App
