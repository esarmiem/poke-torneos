// ============================================
// PÁGINA DE AJUSTES
// ============================================

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { PokemonSprite, sprites } from "@/components/PokemonSprite";
import { 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle,
  FileJson,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function SettingsPage() {
  const router = useRouter();
  const { tournament, resetTournament, exportTournament, importTournament, error } = useTournamentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  
  // Exportar torneo
  const handleExport = () => {
    const data = exportTournament();
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tournament_${format(new Date(), "yyyy-MM-dd_HH-mm")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  // Importar torneo
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImportError(null);
    setImportSuccess(false);
    
    try {
      const text = await file.text();
      importTournament(text);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) {
      setImportError("Error al importar el archivo. Asegúrate de que sea un archivo JSON válido.");
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Resetear torneo
  const handleReset = () => {
    resetTournament();
    setShowResetDialog(false);
    router.push("/");
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Ajustes
            <PokemonSprite {...sprites.dialga} size="xs" variant="decorative" />
          </h1>
          <p className="text-slate-600">
            Gestiona tu torneo y datos
          </p>
        </div>
      </div>
      
      {/* Info del torneo actual */}
      {tournament && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Torneo Actual
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Nombre:</span>
              <span className="font-medium text-slate-900">{tournament.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Estado:</span>
              <Badge variant={tournament.status === "RUNNING" ? "success" : "secondary"}>
                {tournament.status === "SETUP" ? "Configuración" :
                 tournament.status === "RUNNING" ? "En curso" : "Finalizado"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Jugadores:</span>
              <span className="font-medium text-slate-900">{tournament.players.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Rondas:</span>
              <span className="font-medium text-slate-900">{tournament.rounds.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Creado:</span>
              <span className="font-medium text-slate-900">
                {format(new Date(tournament.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
              </span>
            </div>
          </div>
        </Card>
      )}
      
      {/* Guía */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-indigo-900 mb-2">
              Guía para Administradores
            </h2>
            <p className="text-indigo-800 text-sm mb-4">
              ¿Eres nuevo organizando torneos? ¿Necesitas entender mejor los términos 
              y conceptos? Nuestra guía completa te explica todo paso a paso, 
              desde los conceptos básicos hasta consejos para ser un excelente host.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                Conceptos básicos
              </span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                Glosario de términos
              </span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                Paso a paso
              </span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                Consejos de host
              </span>
            </div>
            <Button 
              onClick={() => router.push("/guide")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Guía Completa
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Export/Import */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Exportar / Importar
        </h2>
        <p className="text-slate-600 text-sm mb-4">
          Guarda una copia de seguridad de tu torneo o restaura uno anterior.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport} disabled={!tournament}>
            <Download className="w-4 h-4 mr-2" />
            Exportar JSON
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
        
        {importError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {importError}
          </div>
        )}
        
        {importSuccess && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">
            Torneo importado correctamente
          </div>
        )}
      </Card>
      
      {/* Zona peligrosa */}
      <Card className="p-6 border-red-200 bg-red-50/30">
        <h2 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Zona Peligrosa
        </h2>
        <p className="text-red-700/80 text-sm mb-4">
          Estas acciones son irreversibles. Asegúrate de haber exportado una copia de seguridad si es necesario.
        </p>
        
        <Button 
          variant="destructive" 
          onClick={() => setShowResetDialog(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Nuevo Torneo (Borrar Todo)
        </Button>
      </Card>
      
      {/* Diálogo de confirmación */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              ¿Borrar todo?
            </h2>
          </div>
          
          <p className="text-slate-600 mb-4">
            Esta acción eliminará permanentemente el torneo actual, incluyendo todos los jugadores, rondas y resultados. Esta acción no se puede deshacer.
          </p>
          
          {tournament && (
            <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-medium text-slate-700">Torneo a eliminar:</p>
              <p className="text-slate-600">{tournament.nombre}</p>
              <p className="text-slate-500">
                {tournament.players.length} jugadores, {tournament.rounds.length} rondas
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowResetDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleReset}
            >
              Sí, Borrar Todo
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
