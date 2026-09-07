import React, { useEffect, useState } from 'react'
import { Plus, Warehouse, Route } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import Modal from '../components/ui/Modal.jsx'
import { listDepots, listRuns, createDepot } from '../data/dataService.js'

export default function Depots() {
  const [depots, setDepots] = useState([])
  const [runs, setRuns] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')

  async function refresh() {
    const [d, r] = await Promise.all([listDepots(), listRuns({})])
    setDepots(d); setRuns(r)
  }
  useEffect(() => { refresh() }, [])

  async function submit(e) {
    e.preventDefault()
    const created = await createDepot({ name: name.toUpperCase() })
    setDepots((d) => [...d, created])
    setModalOpen(false)
    setName('')
  }

  return (
    <AppLayout title="Depots" subtitle="Collection points, identified by postcode. Any driver can collect from any depot.">
      <div className="mb-5 flex justify-end">
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={16} /> Add depot</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {depots.map((d) => {
          const depotRuns = runs.filter((r) => r.depot_id === d.id)
          return (
            <div key={d.id} className="panel p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-route-50 text-route-600">
                  <Warehouse size={19} />
                </span>
                <div>
                  <p className="font-display text-[15px] font-semibold text-ink">{d.name}</p>
                  <p className="text-[11.5px] text-ash-400">Collection point</p>
                </div>
              </div>
              <div className="mt-4 flex gap-6 border-t border-black/5 pt-4">
                <div className="flex items-center gap-1.5 text-[12.5px] text-ash-600"><Route size={14} /> {depotRuns.length} runs total</div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add depot">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-ash-600">Postcode</label>
            <input required placeholder="e.g. NG22 9LD" className="field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add depot</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  )
}
