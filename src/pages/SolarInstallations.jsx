import { useState, useEffect } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Sun,
  ShieldCheck,
  FileCheck2,
  Camera
} from 'lucide-react';
import { CardSkeleton } from '../components/shared/Skeleton';
import { api } from '../utils/api';

export default function SolarInstallations() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.get('/solar/projects')
      .then((data) => {
        if (isMounted) {
          setProjects(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load solar installation projects:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Wrench className="text-[#166534]" size={24} /> Installation & Commissioning BOS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Module mounting, DC/AC wiring, inverters, earthing pits & net meter synchronization
          </p>
        </div>
      </div>

      {/* Installation Projects Cards with Skeleton Loader */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map(p => (
            <div key={p.projectId} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="font-mono text-[11px] font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {p.projectId}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-1">{p.customerName}</h3>
                  <div className="text-xs text-slate-500">{p.address}, {p.district}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                  ⚡ {p.solarCapacity}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs mb-3">
                <div>
                  <span className="text-slate-400">Panels / Modules:</span>
                  <p className="font-semibold text-slate-800">{p.panelBrand}</p>
                </div>
                <div>
                  <span className="text-slate-400">Inverter:</span>
                  <p className="font-semibold text-slate-800">{p.inverterBrand}</p>
                </div>
                <div>
                  <span className="text-slate-400">Structure:</span>
                  <p className="font-semibold text-slate-800">{p.structureType}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500">Installer: <strong>{p.assignedInstaller || 'Mahesh Chauhan'}</strong></span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">{p.installationStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
