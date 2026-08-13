import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Check, AlertTriangle, Lock, BookOpen, Users, Star } from 'lucide-react';

export default function TermosDeUsoModal() {
  const { aceitarTermos } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight <= clientHeight) {
        setScrolledToBottom(true);
        setScrollProgress(100);
      }
    }
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
    setScrollProgress(progress);
    if (Math.abs(scrollHeight - scrollTop - clientHeight) <= 4) {
      setScrolledToBottom(true);
    }
  };

  const handleAceitar = async () => {
    setCarregando(true);
    await aceitarTermos();
    setCarregando(false);
  };

  const Section = ({ icon: Icon, iconColor, iconBg, title, children }) => (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={17} color={iconColor} />
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{title}</h3>
      </div>
      <div style={{ paddingLeft: '46px', fontSize: '13.5px', lineHeight: 1.7, color: '#64748b' }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: 'white',
        width: '100%', maxWidth: '600px',
        borderRadius: '28px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '92vh',
        overflow: 'hidden',
        animation: 'fadeInScale 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        {/* ── CABEÇALHO ── */}
        <div style={{
          padding: '32px 32px 28px',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #0891b2 100%)',
          position: 'relative',
        }}>
          {/* wrapper de orbs com overflow hidden separado */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '28px 28px 0 0', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-20px', width: '140px', height: '140px', background: 'rgba(8,145,178,0.2)', borderRadius: '50%' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(8px)' }}>
                <ShieldCheck size={26} color="white" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(186,230,253,0.9)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>O Encontrei!</p>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.3px' }}>Termos de Uso e Privacidade</h2>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(219,234,254,0.9)', margin: 0, lineHeight: 1.6, maxWidth: '480px' }}>
              Antes de continuar, leia nossos termos com atenção. Eles foram criados para garantir um ambiente seguro e confiável para todos.
            </p>
          </div>
        </div>

        {/* ── BARRA DE PROGRESSO ── */}
        <div style={{ height: '4px', background: '#f1f5f9', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
            transition: 'width 0.2s ease',
            borderRadius: '0 4px 4px 0',
          }} />
        </div>

        {/* ── CONTEÚDO ROLÁVEL ── */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 8px' }}
        >
          {/* Aviso de leitura */}
          {!scrolledToBottom && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px' }}>
              <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '13px', color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                Role até o final para habilitar o botão de aceite.
              </p>
            </div>
          )}

          {scrolledToBottom && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px' }}>
              <Check size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '13px', color: '#15803d', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                Você leu todos os termos! Clique em "Aceitar e Continuar" para acessar a plataforma.
              </p>
            </div>
          )}

          <Section icon={BookOpen} iconColor="#2563eb" iconBg="#eff6ff" title="1. Aceitação dos Termos">
            <p style={{ margin: 0 }}>
              Ao acessar e usar a plataforma <strong style={{ color: '#1e293b' }}>O Encontrei!</strong>, você concorda em cumprir estes termos e condições de uso. Se não concordar com alguma parte, você está proibido de usar a plataforma.
            </p>
          </Section>

          <Section icon={Lock} iconColor="#7c3aed" iconBg="#f5f3ff" title="2. Uso Responsável">
            <p style={{ margin: '0 0 10px 0' }}>A plataforma facilita a devolução de itens perdidos em escolas. É expressamente proibido:</p>
            <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
              {[
                'Publicar itens falsos ou que não pertencem ao ambiente escolar',
                'Exigir recompensa financeira pela devolução de itens',
                'Usar o chat para assédio, bullying ou conduta inadequada',
                'Cadastrar itens ilegais, perigosos ou inapropriados',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '7px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed', flexShrink: 0, marginTop: '7px' }} />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Users} iconColor="#0891b2" iconBg="#ecfeff" title="3. Privacidade e Dados">
            <p style={{ margin: 0 }}>
              Coletamos apenas informações essenciais para o funcionamento do sistema — nome, e-mail e turma. Seus dados <strong style={{ color: '#1e293b' }}>não serão vendidos ou compartilhados</strong> com terceiros fora do escopo da escola sem sua autorização.
            </p>
          </Section>

          <Section icon={Star} iconColor="#d97706" iconBg="#fffbeb" title="4. Sistema de Reputação">
            <p style={{ margin: 0 }}>
              Nossa plataforma avalia a confiabilidade dos usuários com base em devoluções bem-sucedidas. O mau uso pode resultar em <strong style={{ color: '#1e293b' }}>perda de reputação e banimento permanente</strong>, a critério dos administradores.
            </p>
          </Section>

          <Section icon={ShieldCheck} iconColor="#059669" iconBg="#f0fdf4" title="5. Modificações">
            <p style={{ margin: 0 }}>
              O Encontrei! pode revisar estes termos a qualquer momento. Ao continuar usando a plataforma, você concorda em ficar vinculado à versão mais recente dos termos de serviço.
            </p>
          </Section>

          <div style={{ height: '12px' }} />
        </div>

        {/* ── RODAPÉ / AÇÕES ── */}
        <div style={{ padding: '20px 32px 28px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleAceitar}
              disabled={!scrolledToBottom || carregando}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '16px',
                border: 'none',
                cursor: scrolledToBottom && !carregando ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s',
                background: scrolledToBottom && !carregando
                  ? 'linear-gradient(135deg, #1d4ed8, #2563eb)'
                  : '#e2e8f0',
                color: scrolledToBottom && !carregando ? 'white' : '#94a3b8',
                boxShadow: scrolledToBottom && !carregando
                  ? '0 8px 24px rgba(37,99,235,0.35)'
                  : 'none',
              }}
            >
              {carregando ? (
                <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <>
                  <Check size={18} />
                  Aceitar e Continuar
                </>
              )}
            </button>
            <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
              Ao aceitar, você confirma que leu e concorda com todos os termos acima.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
