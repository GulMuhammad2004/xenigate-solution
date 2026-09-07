import React, { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { nextRunNumberForDate } from '../../data/dataService.js'
import { datesBetween, toLocalISODate } from '../../lib/dates.js'

const empty = {
  depot_id: '', delivery: '',
  start_time: '06:00', delivery_time: '07:30', staff_id: '', price: '',
  repeat_enabled: false, repeat_until: '',
}

export default function RunFormModal({ open, onClose, onSave, depots, staff, date, isAdmin }) {
  const [form, setForm] = useState(empty)
  const [previewNumber, setPreviewNumber] = useState('')
  const [saving, setSaving] = useState(false)

  // Resets EVERY time the modal opens — repeat is always off by default,
  // so a leftover value from a previous run can never silently carry over.
  useEffect(() => {
    if (open) {
      setForm({ ...empty, depot_id: depots[0]?.id || '' })
      nextRunNumberForDate(date).then(setPreviewNumber)
    }
  }, [open, date])

  const availableStaff = staff.filter((s) => s.active)

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  function quickRepeat(days) {
    const end = new Date(date + 'T00:00:00')
    end.setDate(end.getDate() + (days - 1))
    set('repeat_until', toLocalISODate(end))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)

    const shouldRepeat = form.repeat_enabled && form.repeat_until && form.repeat_until > date
    const runDates = shouldRepeat ? datesBetween(date, form.repeat_until) : [date]

    // Each date gets its OWN next-available number, so day two of a
    // repeated run restarts at XFS-001 too, not wherever day one left off.
    const payloads = []
    for (const run_date of runDates) {
      const run_number = await nextRunNumberForDate(run_date)
      payloads.push({
        run_number,
        depot_id: form.depot_id,
        delivery: form.delivery.toUpperCase(),
        start_time: form.start_time,
        delivery_time: form.delivery_time,
        staff_id: form.staff_id || null,
        price: form.price === '' ? null : Number(form.price),
        run_date,
      })
    }

    setSaving(false)
    onSave(payloads)
  }

  return (
    <Modal open={open} onClose={onClose} title="Add a run" width="max-w-lg">
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-lg bg-canvas px-3.5 py-2.5">
          <p className="text-[11.5px] font-medium text-ash-500">Run ID (auto-assigned)</p>
          <p className="font-display text-[15px] font-semibold text-ink">{previewNumber || '—'}</p>
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Collection depot</label>
          <select required className="field" value={form.depot_id} onChange={(e) => set('depot_id', e.target.value)}>
            {depots.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Delivery location</label>
          <input required placeholder="e.g. LE3 or customer postcode" className="field" value={form.delivery} onChange={(e) => set('delivery', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Collection time</label>
            <input required type="time" className="field" value={form.start_time} onChange={(e) => set('start_time', e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Delivery time</label>
            <input required type="time" className="field" value={form.delivery_time} onChange={(e) => set('delivery_time', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Assign driver</label>
            <select className="field" value={form.staff_id} onChange={(e) => set('staff_id', e.target.value)}>
              <option value="">Leave unassigned</option>
              {availableStaff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>
          {isAdmin && (
            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Price (£)</label>
              <input
                type="number" min="0" step="0.01" placeholder="0.00"
                className="field" value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-black/10 p-3.5">
          <label className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <input
              type="checkbox"
              checked={form.repeat_enabled}
              onChange={(e) => set('repeat_enabled', e.target.checked)}
              className="h-4 w-4 rounded border-ash-400/40"
            />
            Repeat this run on multiple days
          </label>

          {form.repeat_enabled && (
            <div className="mt-3">
              <p className="mb-2.5 text-[11.5px] text-ash-500">
                Creates this run every day from {date} up to the date below. Each day gets its own Run ID, starting from XFS-001 again.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  min={date}
                  className="field w-auto"
                  value={form.repeat_until}
                  onChange={(e) => set('repeat_until', e.target.value)}
                />
                <button type="button" onClick={() => quickRepeat(7)} className="rounded-lg bg-canvas px-2.5 py-1.5 text-[12px] font-medium text-ink">
                  +1 week
                </button>
                <button type="button" onClick={() => quickRepeat(14)} className="rounded-lg bg-canvas px-2.5 py-1.5 text-[12px] font-medium text-ink">
                  +2 weeks
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Adding…' : (form.repeat_enabled && form.repeat_until > date ? 'Add runs' : 'Add run')}
          </button>
        </div>
      </form>
    </Modal>
  )
}