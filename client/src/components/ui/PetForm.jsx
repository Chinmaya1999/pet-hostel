import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { PET_PHOTO_PRESETS } from '../../data/media';
import { SPECIES_EMOJI } from '../../lib/format';

const empty = { name: '', species: 'dog', breed: '', age: '', weight: '', gender: 'unknown', photo: PET_PHOTO_PRESETS[0], vaccinated: true, feedingInstructions: '', medications: '', allergies: '', vetName: '', vetPhone: '', notes: '' };

export default function PetForm({ pet, onSaved, onCancel }) {
  const [form, setForm] = useState(pet ? { ...empty, ...pet } : empty);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form, age: form.age === '' ? undefined : Number(form.age), weight: form.weight === '' ? undefined : Number(form.weight) };
      const { data } = pet?._id ? await api.put(`/pets/${pet._id}`, payload) : await api.post('/pets', payload);
      toast.success(pet?._id ? `${data.name}'s profile updated` : `${data.name} joined the family! 🎉`);
      onSaved?.(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <span className="label">Photo</span>
        <div className="flex items-center gap-4">
          <img src={form.photo || PET_PHOTO_PRESETS[0]} alt="" className="h-20 w-20 shrink-0 rounded-3xl object-cover shadow-soft" />
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {PET_PHOTO_PRESETS.map((p) => (
              <button type="button" key={p} onClick={() => setForm({ ...form, photo: p })} className={`h-12 w-12 shrink-0 overflow-hidden rounded-xl transition ${form.photo === p ? 'ring-3 ring-coral' : 'opacity-70 hover:opacity-100'}`}>
                <img src={p.replace('w=600', 'w=120')} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <input className="input mt-3" value={form.photo} onChange={set('photo')} placeholder="…or paste an image URL" aria-label="Photo URL" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="p-name">Name *</label><input id="p-name" required className="input" value={form.name} onChange={set('name')} placeholder="Bruno" /></div>
        <div>
          <span className="label">Species *</span>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(SPECIES_EMOJI).map((s) => (
              <button type="button" key={s} onClick={() => setForm({ ...form, species: s })} className={`rounded-full px-3 py-2 text-xs font-bold capitalize transition ${form.species === s ? 'bg-ink text-cream' : 'bg-white'}`}>
                {SPECIES_EMOJI[s]} {s}
              </button>
            ))}
          </div>
        </div>
        <div><label className="label" htmlFor="p-breed">Breed</label><input id="p-breed" className="input" value={form.breed} onChange={set('breed')} placeholder="Golden Retriever" /></div>
        <div className="grid grid-cols-3 gap-2">
          <div><label className="label" htmlFor="p-age">Age</label><input id="p-age" type="number" min="0" step="0.5" className="input !px-3" value={form.age} onChange={set('age')} placeholder="yrs" /></div>
          <div><label className="label" htmlFor="p-weight">Kg</label><input id="p-weight" type="number" min="0" step="0.1" className="input !px-3" value={form.weight} onChange={set('weight')} /></div>
          <div>
            <label className="label" htmlFor="p-gender">Sex</label>
            <select id="p-gender" className="input !px-2" value={form.gender} onChange={set('gender')}>
              <option value="male">M</option><option value="female">F</option><option value="unknown">—</option>
            </select>
          </div>
        </div>
      </div>

      <div><label className="label" htmlFor="p-feed">Feeding instructions</label><textarea id="p-feed" rows={2} className="input resize-none" value={form.feedingInstructions} onChange={set('feedingInstructions')} placeholder="2 cups kibble at 8am and 7pm…" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="p-meds">Medications</label><input id="p-meds" className="input" value={form.medications} onChange={set('medications')} placeholder="None" /></div>
        <div><label className="label" htmlFor="p-all">Allergies</label><input id="p-all" className="input" value={form.allergies} onChange={set('allergies')} placeholder="None" /></div>
        <div><label className="label" htmlFor="p-vet">Vet name</label><input id="p-vet" className="input" value={form.vetName} onChange={set('vetName')} /></div>
        <div><label className="label" htmlFor="p-vetp">Vet phone</label><input id="p-vetp" className="input" value={form.vetPhone} onChange={set('vetPhone')} /></div>
      </div>
      <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 font-semibold">
        <input type="checkbox" checked={form.vaccinated} onChange={set('vaccinated')} className="h-5 w-5 accent-coral" />
        Vaccinations are up to date 💉
      </label>
      <div className="flex gap-3 pt-2">
        {onCancel && <button type="button" onClick={onCancel} className="btn-ghost flex-1">Cancel</button>}
        <button disabled={busy} className="btn-primary flex-1">{busy ? 'Saving…' : pet?._id ? 'Save changes' : 'Add pet'}</button>
      </div>
    </form>
  );
}
