import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Shuffle, RotateCcw, Info } from "lucide-react";

// === Banco de questões (curadoria baseada em OpenStax Biology 2e, ch. 10–11) ===
// Cada questão: enunciado, alternativas, índice da correta, explicação curta.
const QUESTION_BANK = [
  {
    q: "Função principal da mitose em organismos multicelulares:",
    options: [
      "Produzir gametas haploides",
      "Crescimento, reparo tecidual e manutenção",
      "Aumentar variabilidade genética",
      "Reduzir o número de cromossomos pela metade",
    ],
    a: 1,
    why:
      "Mitose gera células geneticamente idênticas para crescimento e reparo; não reduz a ploidia.",
  },
  {
    q: "Evento exclusivo da prófase I da meiose:",
    options: [
      "Desaparecimento do nucléolo",
      "Separação das cromátides-irmãs",
      "Pareamento de homólogos com crossing-over (quiasmas)",
      "Formação do sulco de clivagem",
    ],
    a: 2,
    why:
      "Na prófase I ocorre sinapse dos homólogos e recombinação (crossing-over).",
  },
  {
    q: "Na metáfase da mitose, os cromossomos:",
    options: [
      "Se alinham na placa equatorial, cada cromátide ligada a polos opostos",
      "Se emparelham em tétrades",
      "Se separam nos centrômeros",
      "Descondensam e formam os núcleos-filhos",
    ],
    a: 0,
    why:
      "Alinhamento equatorial com microtúbulos de cinetócoro em polos opostos caracteriza a metáfase mitótica.",
  },
  {
    q: "O que se separa na anáfase I?",
    options: [
      "Cromátides-irmãs",
      "Cromossomos homólogos",
      "Fragmentos de envelope nuclear",
      "Centríolos",
    ],
    a: 1,
    why: "Na anáfase I, homólogos migram para polos opostos; cromátides permanecem juntas.",
  },
  {
    q: "O que se separa na anáfase II?",
    options: [
      "Cromossomos homólogos",
      "Tétrades",
      "Cromátides-irmãs (separação dos centrômeros)",
      "Cromossomos com quiasmas",
    ],
    a: 2,
    why: "A anáfase II espelha a anáfase da mitose: separa cromátides-irmãs.",
  },
  {
    q: "Resultado numérico da mitose a partir de uma célula diploide (2n):",
    options: ["4 células n", "2 células 2n idênticas", "2 células n", "4 células 2n"],
    a: 1,
    why: "Mitose mantém a ploidia e gera duas células geneticamente iguais.",
  },
  {
    q: "Resultado numérico da meiose a partir de uma célula diploide (2n):",
    options: ["2 células 2n idênticas", "4 células n geneticamente distintas", "2 células n idênticas", "4 células 2n"],
    a: 1,
    why: "Meiose produz quatro células haploides diferentes (crossing-over + assortimento).",
  },
  {
    q: "Durante G1 da interfase, ocorre:",
    options: [
      "Replicação do DNA",
      "Crescimento celular, síntese de proteínas e organelas",
      "Separação de cromátides",
      "Pareamento de homólogos",
    ],
    a: 1,
    why: "G1 é fase de intensa atividade biossintética e crescimento; a replicação é na fase S.",
  },
  {
    q: "A duplicação do DNA acontece em qual fase?",
    options: ["G1", "S", "G2", "Prófase"],
    a: 1,
    why: "A síntese (S) é a fase de replicação do DNA e duplicação do centrosomo.",
  },
  {
    q: "Duas fontes de variabilidade geradas pela meiose:",
    options: [
      "Crossing-over e assortimento independente",
      "Citocinese e telófase",
      "Replicação do DNA e condensação",
      "Formação do fuso e clivagem",
    ],
    a: 0,
    why: "Recombinação na prófase I e distribuição aleatória das tétrades na metáfase I.",
  },
  {
    q: "Na prófase da mitose, qual evento é esperado?",
    options: [
      "Reformação do envelope nuclear",
      "Descondensação cromossômica",
      "Condensação cromossômica e início da formação do fuso",
      "Separação dos homólogos",
    ],
    a: 2,
    why: "Mitose inicia com condensação e montagem do fuso; envelope nuclear se rompe na prometáfase.",
  },
  {
    q: "Em quais etapas a citocinese geralmente começa e termina (células animais)?",
    options: [
      "Começa na prófase e termina na metáfase",
      "Começa na anáfase tardia e conclui-se após a telófase",
      "Apenas após G2",
      "Apenas na prófase I",
    ],
    a: 1,
    why: "Sulco de clivagem surge no fim da anáfase e a divisão do citoplasma conclui após telófase.",
  },
  {
    q: "O estado G0 descreve:",
    options: [
      "Células mortas",
      "Células em quiescência, podendo ser permanentes (neurônios) ou reentrar no ciclo",
      "Células em mitose",
      "Células que duplicam DNA",
    ],
    a: 1,
    why: "G0 é quiescente; algumas células nunca retornam (neurônios), outras podem retornar (hepatócitos).",
  },
  {
    q: "Na metáfase I, as tétrades se alinham no equador. Uma consequência direta disso é:",
    options: [
      "Aumento do número de cromossomos",
      "Assortimento independente dos homólogos",
      "Replicação extra de DNA",
      "Fim da recombinação",
    ],
    a: 1,
    why: "O alinhamento aleatório das tétrades gera combinações 2^n de cromossomos parentais.",
  },
  {
    q: "Em vegetais (citocinese), forma-se:",
    options: [
      "Sulco de clivagem",
      "Placa celular (fragmoplasto) que origina a parede celular",
      "Anel contrátil de actina-miosina",
      "Centríolos duplicados",
    ],
    a: 1,
    why: "A citocinese vegetal ocorre por placa celular formada por vesículas do Golgi (fragmoplasto).",
  },
  {
    q: "Qual afirmação sobre mitose é INCORRETA?",
    options: [
      "O número de cromossomos é mantido",
      "Há pareamento de homólogos com quiasmas",
      "Gera células geneticamente idênticas",
      "Ocorre em crescimento e reparo",
    ],
    a: 1,
    why: "Pareamento com crossing-over é exclusivo da meiose I, não da mitose.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function QuizCore() {
  const [seed, setSeed] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showWhy, setShowWhy] = useState(true);

  // embaralha questões e alternativas a cada seed
  const questions = useMemo(() => {
    return shuffle(QUESTION_BANK).map((q, idx) => {
      const order = shuffle(q.options.map((_, i) => i));
      const remap = order.map((i) => q.options[i]);
      const correctIndex = order.indexOf(q.a);
      return { ...q, options: remap, a: correctIndex, _id: idx };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  // Reset answers/submitted cada vez que as perguntas mudam
  useEffect(() => {
    setAnswers(Object.fromEntries(questions.map((_, i) => [i, null])));
    setSubmitted(false);
  }, [questions]);

  // Função para reset universal
  const resetAnswers = () => {
    setAnswers(Object.fromEntries(questions.map((_, i) => [i, null])));
    setSubmitted(false);
  };

  const score = useMemo(
    () =>
      Object.entries(answers).reduce((acc, [i, v]) => {
        const ii = Number(i);
        if (v === null) return acc;
        return acc + (v === questions[ii].a ? 1 : 0);
      }, 0),
    [answers, questions]
  );

  const allAnswered = Object.values(answers).every((v) => v !== null);

  return (
    <div className="min-h-screen w-full bg-neutral-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Treinador: Mitose × Meiose</h1>
          <p className="text-neutral-600">
            Múltipla escolha com embaralhamento. Responda tudo e clique em
            <span className="font-semibold"> Enviar</span>. Depois pode revisar
            explicações e reiniciar.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setSeed((s) => s + 1)} variant="secondary">
              <Shuffle className="mr-2 h-4 w-4" /> Embaralhar/novo simulado
            </Button>
            <Button onClick={resetAnswers} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" /> Limpar respostas
            </Button>
            <Button onClick={() => setShowWhy((v) => !v)} variant="outline">
              <Info className="mr-2 h-4 w-4" /> {showWhy ? "Ocultar" : "Mostrar"} explicações
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4">
          {questions.map((q, qi) => {
            const chosen = answers[qi];
            const correct = submitted && chosen === q.a;
            const wrong = submitted && chosen !== null && chosen !== q.a;
            return (
              <Card key={q._id} className="rounded-2xl shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                      {qi + 1}
                    </span>
                    <div className="flex-1 space-y-3">
                      <h2 className="text-lg font-semibold">{q.q}</h2>
                      <div className="grid gap-2">
                        {q.options.map((opt, oi) => {
                          const isPicked = chosen === oi;
                          const isCorrect = submitted && oi === q.a;
                          return (
                            <button
                              key={oi}
                              onClick={() => !submitted && setAnswers((a) => ({ ...a, [qi]: oi }))}
                              className={
                                "flex w-full items-center justify-between rounded-xl border p-3 text-left transition " +
                                (submitted
                                  ? isCorrect
                                    ? "border-green-600"
                                    : isPicked
                                    ? "border-red-600"
                                    : "border-neutral-200"
                                  : isPicked
                                  ? "border-neutral-900"
                                  : "border-neutral-200 hover:border-neutral-400")
                              }
                              aria-disabled={submitted}
                            >
                              <span>{opt}</span>
                              {submitted && isCorrect && <Check className="h-5 w-5" />}
                              {submitted && !isCorrect && isPicked && <X className="h-5 w-5" />}
                            </button>
                          );
                        })}
                      </div>

                      {submitted && showWhy && (
                        <p className="rounded-xl bg-neutral-100 p-3 text-sm text-neutral-700">
                          <span className="font-semibold">Explicação: </span>
                          {q.why}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <footer className="sticky bottom-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200">
          <div className="text-sm text-neutral-600">
            {submitted ? (
              <span>
                Resultado: <span className="font-semibold">{score}</span> / {questions.length}
              </span>
            ) : (
              <span>
                {allAnswered ? "Pronto para enviar." : "Responda todas as questões para enviar."}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              disabled={!allAnswered || submitted}
              aria-disabled={!allAnswered || submitted}
              onClick={() => setSubmitted(true)}
              className=""
            >
              Enviar respostas
            </Button>
          </div>
        </footer>

        <div className="pt-2 text-xs text-neutral-500">
          Fontes de conteúdo: OpenStax Biology 2e (Caps. 10–11) e materiais clássicos de Biologia Celular.
        </div>
      </div>
    </div>
  );
}


// --- Login Gate (simples; não usar para produção segura) ---
function LoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [err, setErr] = React.useState("");
  const tryLogin = () => {
    const OK_USER = "Gabriel";
    const OK_PASS = "123456";
    if (user === OK_USER && pass === OK_PASS) {
      localStorage.setItem("quiz_mm_authed", "1");
      onUnlock();
    } else {
      setErr("Credenciais inválidas.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Acesso</h1>
          <div className="space-y-2">
            <input className="w-full rounded-xl border p-3" placeholder="Usuário" value={user} onChange={(e)=>setUser(e.target.value)} />
            <input className="w-full rounded-xl border p-3" placeholder="Senha" type="password" value={pass} onChange={(e)=>setPass(e.target.value)} />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <Button className="w-full" onClick={tryLogin}>Entrar</Button>
          <p className="text-xs text-neutral-500">Dica para testes: Usuário <b>Gabriel</b> — Senha <b>123456</b>.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = React.useState<boolean>(false);
  useEffect(()=>{
    setAuthed(localStorage.getItem("quiz_mm_authed") === "1");
  },[]);
  if (!authed) return <LoginGate onUnlock={() => setAuthed(true)} />;
  return <QuizCore />;
}