// IndicadorMatch — Badge de score de compatibilidade

export default function IndicadorMatch({ score }) {
  let corClasse, icone, label;

  if (score >= 70) {
    corClasse = 'text-acento-400 border-acento-500/30 bg-acento-500/10';
    icone = '🎯';
    label = 'Excelente';
  } else if (score >= 40) {
    corClasse = 'text-aviso-400 border-aviso-500/30 bg-aviso-500/10';
    icone = '🔍';
    label = 'Possível';
  } else {
    corClasse = 'text-texto-secundario border-borda bg-fundo-card';
    icone = '❓';
    label = 'Baixo';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${corClasse}`}>
      <span>{icone}</span>
      <span>{score}%</span>
      <span className="text-xs font-normal opacity-75">{label}</span>
    </div>
  );
}
