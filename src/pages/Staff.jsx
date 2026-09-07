import React, { useEffect, useState } from 'react'
import { Plus, Phone, ToggleLeft, ToggleRight } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import Modal from '../components/ui/Modal.jsx'
import { listStaff, createStaff, updateStaff } from '../data/dataService.js'

export default function Staff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '' })

  async function refresh() {
    const s = await listStaff()
    setStaff(s); setLoading(false)
  }
  useEffect(() => { refresh() }, [])

  async function toggleActive(s) {
    setStaff((rows) => rows.map((r) => (r.id === s.id ? { ...r, active: !r.active } : r)))
    await updateStaff(s.id, { active: !s.active })
  }

  async function submit(e) {
    e.preventDefault()
    const created = await createStaff(form)
    setStaff((rows) => [...rows, created])
    setModalOpen(false)
    setForm({ full_name: '', phone: '' })
  }

  return (
    <AppLayout title="Staff" subtitle="Drivers can be assigned to a run at any depot.">
      <div className="mb-5 flex justify-end">
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={16} /> Add staff</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-[13px] text-ash-500">Loading staff…</p>}
        {staff.map((s) => (
          <div key={s.id} className="panel flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-route-gradient font-display text-[13px] font-semibold text-white">
                {s.full_name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <div>
                <p className="text-[13.5px] font-semibold text-ink">{s.full_name}</p>
                <p className="text-[12px] text-ash-500">{s.active ? 'Available for any depot' : 'Currently unavailable'}</p>
                {s.phone && <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-ash-400"><Phone size={11} /> {s.phone}</p>}
              </div>
            </div>
            <button onClick={() => toggleActive(s)} title={s.active ? 'Mark unavailable' : 'Mark available'}>
              {s.active ? <ToggleRight size={26} className="text-good" /> : <ToggleLeft size={26} className="text-ash-400" />}
            </button>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add staff member">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Full name</label>
            <input required className="field" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Phone</label>
            <input className="field" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add staff</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  )
}
