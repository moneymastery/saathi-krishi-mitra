import { MyFieldsList } from "./MyFieldsList";

export const SoilSatiView = () => {
  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-6 bg-gradient-primary text-white">
        <h1 className="text-3xl font-bold mb-2">🌍 SoilSati</h1>
        <p className="text-sm opacity-90">Satellite-powered field intelligence</p>
      </header>

      {/* My Fields List */}
      <div className="px-6 py-4">
        <MyFieldsList />
      </div>
    </div>
  );
};
