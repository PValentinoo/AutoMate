import { Wrench } from "lucide-react";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-lg mx-auto text-center text-white">
        {/* Simple Icon */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full">
            <Wrench className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-5xl font-bold mb-6 text-white">
          Under vedligeholdelse
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          Vi arbejder på at gøre Auto<span className="italic">Mate</span> bedre.
        </p>
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Kom tilbage snart!
        </p>

        {/* Simple Contact */}
        <div className="text-gray-400">
          <p className="mb-2">Har du brug for at komme i kontakt?</p>
          <a 
            href="mailto:XXX" 
            className="text-blue-400 hover:text-blue-300 transition-colors underline"
          >
            XXX
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 text-gray-500 text-sm">
          <p>© 2025 Auto<span className="italic">Mate</span>. Alle rettigheder forbeholdes.</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
